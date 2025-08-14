// import react from 'react';
import { createBrowserRouter} from 'react-router-dom'; 


import loginPage from   '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import MapPage from '../pages/MapPage';
import { ProfileProvider } from '../context/context.tsx';
 
// ProfileProvider'ı içeren bir layout component
export const ProfileLayout = ({ children }: { children: React.ReactNode }) => (
  <ProfileProvider>{children}</ProfileProvider>
); 
const router=createBrowserRouter(
    [    {
        path: '/',
        element: <ProfileLayout><MapPage /></ProfileLayout>,
    },

{
    path:'/Login',
    Component:loginPage
},
{
    path:'/register',
    Component:RegisterPage
}
])


// eslint-disable-next-line react-refresh/only-export-components
export default router; 
