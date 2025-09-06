import logo from '../assets/rotago.png';
import GoogleIcon from '@mui/icons-material/Google';
import MicrosoftIcon from '@mui/icons-material/Microsoft';
import AppleIcon from '@mui/icons-material/Apple';
import '../css/loginpage.css'
import { useNavigate } from 'react-router-dom';


export default function LoginPage(){

  const navigate=useNavigate();

    return (
        <div className="login-page">
              <img className="logo" src={logo} alt="Logo" />
              <h1>Giriş Yap</h1>
            <div className="login-form">

            
               <form className='login-form-container'>
                <input type="email" placeholder="Email" className="login-input" />
                <input type="password" placeholder="Şifre" className="login-input" />
                <a href="#">Şifremi Unuttum</a>
                <a href="#" onClick={e=>{e.preventDefault();navigate("/register")}}>Hesabım yok, Kaydol</a>
                <button className="login-button">Giriş Yap </button>
                </form>

                <div className="login-page-buttons">
                    <button className="login-page-button">   <GoogleIcon className="login-page-icon" />     Google hesabı ile devam et</button>
                    <button className="login-page-button"> <MicrosoftIcon className="login-page-icon" /> Microsoft hesabı ile devam et</button>
                    <button className="login-page-button"><AppleIcon className="login-page-icon"/> Apple hesabı ile devam et</button>
               

                  </div>

      </div>
        </div>
    )
}