
import express from "express";
import prisma from "../lib/prisma.js";
import authMiddleware from "../middleware/authMiddleware.js";
import cloudinary from "../lib/cloudinary.js";
import upload from "../lib/upload.js";
import bcrypt from "bcrypt";

const router = express.Router();


router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const userId = String(
      req.user?.userId ??
      req.user?.id ??
      req.user?.sub ??
      ""
    );

    if (!userId) {
      return res.status(401).json({
        message: "Please sign in again.",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profileImageUrl: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Fetch profile error:", error);

    return res.status(500).json({
      message: "Failed to load profile.",
    });
  }
});

router.patch("/profile", authMiddleware, async (req, res) => {
  try {
    const userId = String(
      req.user?.userId ??
      req.user?.id ??
      req.user?.sub ??
      ""
    );

    if (!userId) {
      return res.status(401).json({
        message: "Please sign in again.",
      });
    }

    const { name } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        message: "Full name is required.",
      });
    }

    const trimmedName = name.trim();

    if (trimmedName.length < 2 || trimmedName.length > 80) {
      return res.status(400).json({
        message: "Name must be between 2 and 80 characters.",
      });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { name: trimmedName },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return res.status(200).json({
      message: "Profile updated successfully.",
      user,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      message: "Failed to update profile.",
    });
  }
});


router.post(
  "/profile/photo",
  authMiddleware,
  upload.single("profileImage"),
  async (req, res) => {
    let uploadedImage;

    try {
      const userId = String(
        req.user?.userId ??
        req.user?.id ??
        req.user?.sub ??
        ""
      );

      if (!userId) {
        return res.status(401).json({
          message: "Please sign in again.",
        });
      }

     if (!["ADMIN", "STUDENT"].includes(req.user?.role)) {
        return res.status(403).json({
          message: "You are not allowed to update this profile photo.",
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message: "Please select a photo.",
        });
      }

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
      ];

      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
          message: "Please upload a JPG, PNG, or WebP image.",
        });
      }

      if (req.file.size > 5 * 1024 * 1024) {
        return res.status(400).json({
          message: "Photo size must not exceed 5 MB.",
        });
      }

      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          profileImagePublicId: true,
        },
      });

      if (!existingUser) {
        return res.status(404).json({
          message: "User not found.",
        });
      }

      // Upload the selected photo to Cloudinary.
      uploadedImage = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "mycode-academy/student-profiles",
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        stream.end(req.file.buffer);
      });

      // Save the image URL and Cloudinary public ID.
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          profileImageUrl: uploadedImage.secure_url,
          profileImagePublicId: uploadedImage.public_id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          profileImageUrl: true,
        },
      });

      // Delete the previous image after the new one is saved.
      if (existingUser.profileImagePublicId) {
        try {
          await cloudinary.uploader.destroy(
            existingUser.profileImagePublicId
          );
        } catch (cleanupError) {
          console.error(
            "Old profile photo cleanup error:",
            cleanupError
          );
        }
      }

      return res.status(200).json({
        message: "Profile photo updated successfully.",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Update profile photo error:", error);

      // Remove a new upload if saving the database record failed.
      if (uploadedImage?.public_id) {
        try {
          await cloudinary.uploader.destroy(
            uploadedImage.public_id
          );
        } catch (cleanupError) {
          console.error(
            "New profile photo cleanup error:",
            cleanupError
          );
        }
      }

      return res.status(500).json({
        message: "Failed to update profile photo.",
      });
    }
  }
);


router.delete("/profile/photo", authMiddleware, async (req, res) => {
  try {
    const userId = String(
      req.user?.userId ??
      req.user?.id ??
      req.user?.sub ??
      ""
    );

    if (!userId) {
      return res.status(401).json({
        message: "Please sign in again.",
      });
    }

    if (!["ADMIN", "STUDENT"].includes(req.user?.role)) {
        return res.status(403).json({
          message: "You are not allowed to update this profile photo.",
        });
      }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        profileImagePublicId: true,
      },
    });

    if (!existingUser) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // Remove the photo reference from the database first.
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        profileImageUrl: null,
        profileImagePublicId: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        profileImageUrl: true,
      },
    });

    // Then remove the image from Cloudinary.
    if (existingUser.profileImagePublicId) {
      try {
        await cloudinary.uploader.destroy(
          existingUser.profileImagePublicId
        );
      } catch (cleanupError) {
        console.error("Remove Cloudinary photo error:", cleanupError);
      }
    }

    return res.status(200).json({
      message: "Profile photo removed successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Remove profile photo error:", error);

    return res.status(500).json({
      message: "Failed to remove profile photo.",
    });
  }
});



router.patch("/password", authMiddleware, async (req, res) => {
  try {
    const userId = String(
      req.user?.userId ??
      req.user?.id ??
      req.user?.sub ??
      ""
    );

    if (!userId) {
      return res.status(401).json({
        message: "Please sign in again.",
      });
    }

    const { currentPassword, newPassword } = req.body;

    if (
      typeof currentPassword !== "string" ||
      typeof newPassword !== "string" ||
      !currentPassword ||
      !newPassword
    ) {
      return res.status(400).json({
        message: "Please fill in all password fields.",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "Your new password must be at least 8 characters.",
      });
    }

    if (newPassword.length > 72) {
      return res.status(400).json({
        message: "Your new password must not exceed 72 characters.",
      });
    }

    if (newPassword.length < 8 || newPassword.length > 72) {
        return res.status(400).json({
          message: "Password must be between 8 and 72 characters.",
        });
      }

      if (!/[A-Z]/.test(newPassword)) {
        return res.status(400).json({
          message: "Password must contain an uppercase letter.",
        });
      }

      if (!/[a-z]/.test(newPassword)) {
        return res.status(400).json({
          message: "Password must contain a lowercase letter.",
        });
      }

      if (!/[0-9]/.test(newPassword)) {
        return res.status(400).json({
          message: "Password must contain a number.",
        });
      }

      if (!/[^A-Za-z0-9\s]/.test(newPassword)) {
        return res.status(400).json({
          message: "Password must contain a special character.",
        });
      }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        message: "Your current password is incorrect.",
      });
    }

    const isSamePassword = await bcrypt.compare(
      newPassword,
      user.password
    );

    if (isSamePassword) {
      return res.status(400).json({
        message: "Your new password must be different from your current password.",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return res.status(200).json({
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error("Update password error:", error);

    return res.status(500).json({
      message: "Failed to update password.",
    });
  }
});


export default router;