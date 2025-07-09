import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(localStorage.getItem("userId"));
    const isLoggedIn = !!currentUser;

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser, isLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
