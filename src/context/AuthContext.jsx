import {
    createContext,
    useState,
    useEffect,
    useContext
} from "react";

const AuthContext = createContext(null);

const DEFAULT_AUTH_STATE = {
    isAuthenticated: false,
    name: "",
    email: ""
};

export const AuthProvider = ({ children }) => {

// *************************************** To receive Data from localstorage BY user************************
     //User
    const [users, setUsers] = useState(() => {
        const savedUsers = localStorage.getItem("users");

        if (savedUsers) {
            return JSON.parse(savedUsers);
        }

        return [];
    });

// *************************************** To receive Data from localstorage BY auth************************

    // Authentication
    const [auth, setAuth] = useState(() => {
        const savedAuth = localStorage.getItem("auth");

        if (savedAuth) {
            return JSON.parse(savedAuth);
        }

        return DEFAULT_AUTH_STATE;
    });

    const [authError, setAuthError] = useState("");

    
// *************************************** To save users and auth ********************************************

    // Save users
    useEffect(() => {
        localStorage.setItem("users", JSON.stringify(users));
    }, [users]);

    // Save auth
    useEffect(() => {
        localStorage.setItem("auth", JSON.stringify(auth));
    }, [auth]);


// ************************************************* Sign Up *************************************************

    // SIGN UP
    const signUp = (name, email, password) => {
        const existingUser = users.find(
            (user) => user.email === email
        );

        if (existingUser) {
            setAuthError("User with this email already exists.");
            return false;
        }

        setAuthError("");

        setUsers((prev) => [
            ...prev,
            {
                name,
                email,
                password
            }
        ]);

        return true;
    };

// ************************************************* Sign In *************************************************
    // SIGN IN
    const signIn = (email, password) => {

        const existingUser = users.find(
            (user) =>
                user.email === email &&
                user.password === password
        );

        if (!existingUser) {
            setAuthError("Invalid email or password.");
            return false;
        }

        setAuthError("");

        setAuth({
            isAuthenticated: true,
            name: existingUser.name,
            email: existingUser.email
        });

        return true;
    };


    // LOGOUT
    const logout = () => {
        setAuth(DEFAULT_AUTH_STATE);
        setAuthError("");
    };


    return (
        <AuthContext.Provider
            value={{
                signUp,
                signIn,
                logout,
                auth,
                authError
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {
    return useContext(AuthContext);
};

