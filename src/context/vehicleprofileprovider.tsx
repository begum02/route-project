import React, { createContext, useContext, useState } from 'react';

export interface ProfileContextType {
    activeButtonMenu: string | null;
    activeButtonSubMenu: string | null;
    setActiveButtonMenu: (name: string | null) => void;
    setActiveButtonSubMenu: (option: string | null) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

// ProfileProvider - context'i sağlayan component
export function ProfileProvider({ children }: { children: React.ReactNode }) {
    const [activeButtonMenu, setActiveButtonMenu] = useState<string | null>(null);
    const [activeButtonSubMenu, setActiveButtonSubMenu] = useState<string | null>(null);
    
    return (
        <ProfileContext.Provider value={{ 
            activeButtonMenu, 
            activeButtonSubMenu, 
            setActiveButtonMenu, 
            setActiveButtonSubMenu 
        }}>
            {children}
        </ProfileContext.Provider>
    );
}

// useProfile - context'i kullanmak için hook
// eslint-disable-next-line react-refresh/only-export-components
export   function useProfile() {
    const context = useContext(ProfileContext);
    if (context === undefined) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
}



