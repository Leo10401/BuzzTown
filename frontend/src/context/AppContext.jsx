'use client';
import { useRouter } from "next/navigation";
import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const router = useRouter();

    // Hydration-safe: always initialize to null/false
    const [currentUser, setCurrentUser] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);

    // On mount, sync with sessionStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const stored = sessionStorage.getItem('user');
            if (stored) {
                setCurrentUser(JSON.parse(stored));
                setLoggedIn(true);
            }
        }
    }, []);

    // Keep state in sync with sessionStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (currentUser) {
                sessionStorage.setItem('user', JSON.stringify(currentUser));
            } else {
                sessionStorage.removeItem('user');
            }
        }
    }, [currentUser]);

    const login = (userData) => {
        setCurrentUser(userData);
        setLoggedIn(true);
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('user', JSON.stringify(userData));
            if (userData.token) {
                document.cookie = `token=${userData.token}; path=/;`;
            }
        }
    };

    const logout = () => {
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem('user');
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        }
        setCurrentUser(null);
        setLoggedIn(false);
        router.push('/authenticate');
    };

    return (
        <AppContext.Provider value={{
            currentUser,
            setCurrentUser,
            loggedIn,
            setLoggedIn,
            login,
            logout
        }}>
            {children}
        </AppContext.Provider>
    );
};

const useAppContext = () => useContext(AppContext);

export default useAppContext;