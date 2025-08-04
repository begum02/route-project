import react from 'react';
import { createBrowserRouter} from 'react-router'; 

import MapPage from '../pages/MapPage';
import loginPage from   '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

const router=createBrowserRouter([
    {
        path:'/',
        Component:MapPage
    },

    {
        path:'/register',
        Component:RegisterPage
    },

{
    path:'/Login',
    Component:loginPage
}
])


export default router; 
