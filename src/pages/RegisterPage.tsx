
import logo from '../assets/rotago.png';
import '../css/registerpage.css';
import GoogleIcon from '@mui/icons-material/Google';
import MicrosoftIcon from '@mui/icons-material/Microsoft';
import AppleIcon from '@mui/icons-material/Apple';
import IconButton from '@mui/material/IconButton';
import React from 'react';
  import { createClient } from '@supabase/supabase-js'
  import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useState, useEffect } from 'react';
import { AuthService } from '../services/auth.ts';
import EmailVerificationDialog from '../component/verification';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const supabase=createClient(supabaseUrl,supabaseAnonKey);






  



export default function RegisterPage(){
const [showVerifyDialog, setShowVerifyDialog] = useState(false);

 const[username,setUsername]= useState('');
 const [email,setEmail]= useState('');
 const [password,setPassword]= useState('');
const[confirmPassword,setConfirmPassword]= useState('');
const [tokenHash,setTokenHash]= useState('');
const handleRegister=async()=>{
 

const { data, error } = await supabase.auth.signUp({
  email: email,
  password: password,
  options:{
    data:{
        username:username
    }
  }})



  
 const passwordRegex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;

if(passwordRegex.test(password)) return true;
if(password !== confirmPassword){
    alert('Şifreler eşleşmiyor');
    return;
}
if(password.length < 6){
    alert('Şifre en az 6 karakter olmalı');
    return;}
if(error){
    console.log('Error signing up:', error.message);
    alert('Kayıt sırasında bir hata oluştu: ' + error.message);
    return;}

 console.log("kayıt yapıldı");

  // Kayıt başarılıysa doğrulama ekranını aç
  setShowVerifyDialog(true);
  console.log("kayıt yapıldı");

}


    return(
     <div className="register-page">
            <img className="logo" src={logo} alt="Logo" />
      <div className="register-form">
        

        <div className="register-title-container">
        <h3 className="register-title">Kaydol</h3>
         </div>


      <div className="register-inputs-container">
         <input type="text" className="register-input" placeholder="Kullanıcı Adı"  value={username} onChange={(e)=>setUsername(e.target.value)}/>
        <input type="text" className="register-input" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
         <input type="password" className="register-input" placeholder="Şifre" value={password} onChange={(e)=>setPassword(e.target.value)} />

            <input type="password" className="register-input" placeholder="Şifreyi yeniden gir" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
        </div>

        <div className="register-button-container">
            <button className="register-button" onClick={handleRegister}>Kaydol</button>
            </div>

        <div className='google-apple-microsoft-account-container'>
            
            <IconButton className="account-button" >
                <GoogleIcon className="account-icon" />
          </IconButton>
          
             <IconButton className="account-button">
                <MicrosoftIcon className="account-icon" />
          </IconButton>

              <IconButton className="account-button">
                <AppleIcon className="account-icon" />
          </IconButton>

          </div>



         </div>

        <div className="register-link" >
            <p className="register-link-text">Zaten hesabın var mı? <a href="/login" className="register-link-anchor">Giriş yap</a></p>
        </div>
               {showVerifyDialog && <EmailVerificationDialog onClose={() => setShowVerifyDialog(false)} tokenHash={tokenHash} email={email} />}
        
        </div>
    )
}

