import { toast } from 'react-hot-toast';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const UserAuthContext = createContext();

export const UserAuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const router = useRouter();

    const requireAuth = () => {
        if (!user) {
            toast.error('Login to Continue');
            router.push('/authenticate');
            return false;
        }
        return true;
    };

    return (
        <UserAuthContext.Provider value={{ user, setUser, requireAuth }}>
            {children}
        </UserAuthContext.Provider>
    );
};

const useUserAuth = () => useContext(UserAuthContext);

export default useUserAuth;