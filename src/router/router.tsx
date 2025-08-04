import react from 'react';
import { createBrowserRouter} from 'react-router'; 

../../MapPage
import loginPage from   '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

const router=createBrowserRouter([

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
