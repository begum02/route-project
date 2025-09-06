// import react from 'react';
import { createBrowserRouter} from 'react-router-dom'; 


import LoginPage from   '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import MapPage from '../pages/MapPage';
import { ProfileProvider } from '../context/vehicleprofileprovider';
import { DirectionsProvider } from '../context/directions';

// ProfileProvider'ı içeren bir layout component
export const ProfileLayout = ({ children }: { children: React.ReactNode }) => (
  <ProfileProvider>{children}</ProfileProvider>
); 

const Providers = ({ children }: { children: React.ReactNode }) => (
    <ProfileProvider>
        <DirectionsProvider>
            {children}
        </DirectionsProvider>
    </ProfileProvider>
);

const router=createBrowserRouter(
    [    {
        path: '/',
        element: (
            <Providers>
                <MapPage />
            </Providers>
        ),
    },
    {
        path: '/login',
        element: <LoginPage />
    },
    {
        path: '/register',
        element: <RegisterPage />
    }
])


// eslint-disable-next-line react-refresh/only-export-components
export default router;
