
import { useEffect, useState } from "react";
import {
  Mail,
  UserRound,
  ShieldCheck,
  Save,
  Camera,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";

function getStoredUser() {
  try {
    const storedUser =
      localStorage.getItem("user") ||
      sessionStorage.getItem("user");

    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
}

async function compressProfileImage(file) {
  const image = new Image();
  const objectUrl = URL.createObjectURL(file);

  try {
    image.src = objectUrl;

    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
    });

    const maxSize = 500;
    const scale = Math.min(
      maxSize / image.width,
      maxSize / image.height,
      1
    );

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(image.width * scale);
    canvas.height = Math.round(image.height * scale);

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Unable to process this image.");
    }

    context.drawImage(
      image,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return await new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(
              new File([blob], "profile.jpg", {
                type: "image/jpeg",
              })
            );
          } else {
            reject(new Error("Image compression failed."));
          }
        },
        "image/jpeg",
        0.8
      );
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export default function StudentSettings({
  accountLabel = "Student Account",
}) {
  const [user, setUser] = useState(getStoredUser);
  const initialName = user?.name || user?.fullName || "";
  const [name, setName] = useState(initialName);
  const [savedName, setSavedName] = useState(initialName);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordRequirements = [
              {
                label: "At least 8 characters",
                met: newPassword.length >= 8,
              },
              {
                label: "One uppercase letter (A-Z)",
                met: /[A-Z]/.test(newPassword),
              },
              {
                label: "One lowercase letter (a-z)",
                met: /[a-z]/.test(newPassword),
              },
              {
                label: "One number (0-9)",
                met: /[0-9]/.test(newPassword),
              },
              {
                label: "One special character (!@#$)",
                met: /[^A-Za-z0-9\s]/.test(newPassword),
              },
            ];

            const isStrongPassword = passwordRequirements.every(
              (requirement) => requirement.met
            );

  const passwordsMatch =
  newPassword.length > 0 &&
  confirmPassword.length > 0 &&
  newPassword === confirmPassword;

  const passwordsMismatch =
    confirmPassword.length > 0 &&
    newPassword !== confirmPassword;

  const email = user?.email || "No email available";

  const initials = (name || "Student")
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();


  
useEffect(() => {
  async function loadProfile() {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    if (!token) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/settings/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load profile.");
      }

      const updatedUser = data.user;

      setUser(updatedUser);
      setName(updatedUser.name || "");
      setSavedName(updatedUser.name || "");

      const savedUser = JSON.stringify(updatedUser);

      if (
        localStorage.getItem("user") ||
        localStorage.getItem("token")
      ) {
        localStorage.setItem("user", savedUser);
      }

      if (
        sessionStorage.getItem("user") ||
        sessionStorage.getItem("token")
      ) {
        sessionStorage.setItem("user", savedUser);
      }

      window.dispatchEvent(
        new CustomEvent("profileUpdated", {
          detail: updatedUser,
        })
      );
    } catch (error) {
      console.error("Load student profile error:", error);
      setError(error.message || "Failed to load profile.");
    }
  }

  loadProfile();
}, []);
 
  async function handleSaveName(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    const trimmedName = name.trim();

    if (trimmedName.length < 2 || trimmedName.length > 80) {
      setError("Name must be between 2 and 80 characters.");
      return;
    }

    if (trimmedName === savedName) {
      setMessage("Your name has not changed.");
      return;
    }

    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    if (!token) {
      setError("Please sign in again.");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/settings/profile`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ name: trimmedName }),
          }
        );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update your name."
        );
      }

      setUser(data.user);
      window.dispatchEvent(
        new CustomEvent("profileUpdated", {
          detail: data.user,
        })
      );
      setName(data.user.name);
      setSavedName(data.user.name);

      const storage = localStorage.getItem("user")
        ? localStorage
        : sessionStorage;

      storage.setItem("user", JSON.stringify(data.user));

      setMessage("Your name has been updated successfully.");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  }

  
async function handlePhotoUpload(event) {
  const file = event.target.files?.[0];
  event.target.value = "";

  if (!file) return;

  setMessage("");
  setError("");

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    setError("Please select a JPG, PNG, or WebP image.");
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    setError("Photo size must not exceed 5 MB.");
    return;
  }

  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  if (!token) {
    setError("Please sign in again.");
    return;
  }

  setIsSaving(true);

  try {
    const compressedFile = await compressProfileImage(file);

    const formData = new FormData();
    formData.append("profileImage", compressedFile);

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/settings/profile/photo`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to upload photo.");
    }

    setUser(data.user);
    window.dispatchEvent(
      new CustomEvent("profileUpdated", {
        detail: data.user,
      })
    );

    const storedUser = JSON.stringify(data.user);

    if (localStorage.getItem("user")) {
      localStorage.setItem("user", storedUser);
    }

    if (sessionStorage.getItem("user")) {
      sessionStorage.setItem("user", storedUser);
    }

    setMessage("Profile photo updated successfully.");
  } catch (err) {
    setError(err.message || "Failed to upload photo.");
  } finally {
    setIsSaving(false);
  }
}

async function handleRemovePhoto() {
  setMessage("");
  setError("");

  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  if (!token) {
    setError("Please sign in again.");
    return;
  }

  setIsSaving(true);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/settings/profile/photo`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to remove photo.");
    }

    setUser(data.user);
     window.dispatchEvent(
      new CustomEvent("profileUpdated", {
        detail: data.user,
      })
    );

    const storedUser = JSON.stringify(data.user);

    if (localStorage.getItem("user")) {
      localStorage.setItem("user", storedUser);
    }

    if (sessionStorage.getItem("user")) {
      sessionStorage.setItem("user", storedUser);
    }

    setMessage("Profile photo removed successfully.");
  } catch (err) {
    setError(err.message || "Failed to remove photo.");
  } finally {
    setIsSaving(false);
  }
}



async function handleChangePassword(event) {
  event.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    if (!isStrongPassword) {
      setPasswordError(
        "Your new password must meet all the requirements."
      );
      return;
    }

  if (newPassword !== confirmPassword) {
    setPasswordError("The new passwords do not match.");
    return;
  }

  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  if (!token) {
    setPasswordError("Please sign in again.");
    return;
  }

  setIsChangingPassword(true);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/settings/password`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to update password."
      );
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setPasswordMessage("Password updated successfully.");
  } catch (error) {
    setPasswordError(
      error.message || "Failed to update password."
    );
  } finally {
    setIsChangingPassword(false);
  }
}

  return (
    <div className=" w-full max-w-6xl space-y-6 p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold text-(--text-primary)">
          Settings
        </h1>
        <p className="mt-1 text-sm text-(--text-secondary)">
          Manage your account information.
        </p>
      </div>

      
<section className="rounded-xl border border-(--border) bg-(--surface) p-6">
  <div className="flex flex-wrap items-center gap-4">
    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-xl font-semibold text-blue-700">
      {user?.profileImageUrl ? (
        <img
          src={user.profileImageUrl}
          alt="Student profile"
          className="h-full w-full object-cover"
        />
      ) : (
        initials
      )}
    </div>

    <div className="min-w-0 flex-1">
      <h2 className="text-lg font-semibold text-(--text-primary)">
        {name || "Student"}
      </h2>

      <p className="text-sm text-(--text-secondary)">{accountLabel}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        <label className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border border-(--border) px-3 py-2 text-sm font-medium text-(--text-primary) transition hover:bg-(--surface-secondary) ${
          isSaving ? "pointer-events-none opacity-50" : ""
        }`}>
          <Camera size={16} />
          {user?.profileImageUrl ? "Change Photo" : "Upload Photo"}

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handlePhotoUpload}
            disabled={isSaving}
            className="hidden"
          />
        </label>

        {user?.profileImageUrl && (
          <button
            type="button"
            onClick={handleRemovePhoto}
            disabled={isSaving}
            className="cursor-pointer inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 size={16} />
            Remove Photo
          </button>
        )}
      </div>
    </div>
  </div>
</section>

    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
           <section className="space-y-5 rounded-xl border border-(--border) bg-(--surface) p-6">
              <div>
                <h2 className="text-lg font-semibold text-(--text-primary)">
                  Account Information
                </h2>
                <p className="mt-2 text-sm text-(--text-secondary)">
                  Update your personal information.
                </p>
              </div>

              <form onSubmit={handleSaveName} className="space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor="student-name"
                    className="text-sm font-medium text-(--text-primary)"
                  >
                    Full Name
                  </label>

                  <div className="flex items-center gap-3 rounded-lg border border-(--border) px-4 py-3 focus-within:border-blue-500">
                    <UserRound size={18} className="text-(--text-muted)" />

                    <input
                      id="student-name"
                      type="text"
                      value={name}
                      onChange={(event) => {
                        setName(event.target.value);
                        setMessage("");
                        setError("");
                      }}
                      minLength={2}
                      maxLength={80}
                      required
                      className="w-full bg-transparent text-(--text-primary) outline-none"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-sm font-medium text-(--text-primary)">
                      Email Address
                    </label>
                    <span className="text-xs text-(--text-muted)">
                      Read-only
                    </span>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg border border-(--border) bg-(--surface-secondary) px-4 py-3">
                    <Mail size={18} className="text-(--text-muted)" />
                    <span className="break-all text-(--text-primary)">
                      {email}
                    </span>
                  </div>
                </div>

                {message && (
                  <p className="text-sm text-green-600" role="status">
                    {message}
                  </p>
                )}

                {error && (
                  <p className="text-sm text-red-600" role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSaving || name.trim() === savedName}
                  className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save size={18} />
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </form>
          </section>

        
          <section className="min-w-0 rounded-xl border border-(--border) bg-(--surface) p-6 lg:p-8">
            <div className="mb-6">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-blue-600" size={22} />

                <h2 className="text-lg font-semibold text-(--text-primary)">
                  Password & Security
                </h2>
              </div>

              <p className="mt-2 text-sm text-(--text-secondary)">
                Update your password to keep your account secure.
              </p>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-5">
             <div className="relative">
                <input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(event) => {
                    setCurrentPassword(event.target.value);
                    setPasswordError("");
                    setPasswordMessage("");
                  }}
                  required
                  className="w-full rounded-lg border border-(--border) bg-(--surface) px-4 py-3 pr-12 text-(--text-primary) outline-none placeholder:text-(--text-muted) focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Enter current password"
                />

                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((prev) => !prev)}
                  aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
                  className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-(--text-muted) transition hover:text-(--text-primary)"
                >
                  {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
             </div>

             <div className="relative">
                <input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={72}
                  value={newPassword}
                  onChange={(event) => {
                    setNewPassword(event.target.value);
                    setPasswordError("");
                    setPasswordMessage("");
                  }}
                  required
                  className="w-full rounded-lg border border-(--border) bg-(--surface) px-4 py-3 pr-12 text-(--text-primary) outline-none placeholder:text-(--text-muted) focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="At least 8 characters"
                />

                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                  className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-(--text-muted) transition hover:text-(--text-primary)"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                
             </div>
                  <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {passwordRequirements.map((requirement) => (
                      <p
                        key={requirement.label}
                        className={`flex items-center gap-2 text-xs ${
                          requirement.met
                            ? "text-green-600"
                            : "text-(--text-secondary)"
                        }`}
                      >
                        <span aria-hidden="true">
                          {requirement.met ? "✓" : "○"}
                        </span>

                        {requirement.label}
                      </p>
                    ))}
                </div>  
              <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    maxLength={72}
                    value={confirmPassword}
                    onChange={(event) => {
                      setConfirmPassword(event.target.value);
                      setPasswordError("");
                      setPasswordMessage("");
                    }}
                    required
                    className={`w-full rounded-lg border px-4 py-3 pr-12 outline-none focus:ring-2 ${
                      passwordsMismatch
                        ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                        : passwordsMatch
                          ? "border-green-500 focus:border-green-500 focus:ring-green-100"
                          : "border-(--border) bg-(--surface) text-(--text-primary) placeholder:text-(--text-muted) focus:border-blue-500 focus:ring-blue-500/20"
                    }`}
                    placeholder="Enter your new password again"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"}
                    className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 text-(--text-muted) transition hover:text-(--text-primary)"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
              </div>

              {passwordsMismatch && (
                <p className="text-sm text-red-600" role="alert">
                  Passwords do not match.
                </p>
              )}

              {passwordsMatch && (
                <p className="text-sm text-green-600" role="status">
                  Passwords match.
                </p>
              )}

              {passwordError && (
                <p className="text-sm text-red-600" role="alert">
                  {passwordError}
                </p>
              )}

              {passwordMessage && (
                <p className="text-sm text-green-600" role="status">
                  {passwordMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={
                  isChangingPassword ||
                  !currentPassword ||
                  !newPassword ||
                  !confirmPassword
                }
                className="cursor-pointer rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isChangingPassword ? "Updating..." : "Update Password"}
              </button>
            </form>
          </section>

    </div>
     
    </div>
  );
}
