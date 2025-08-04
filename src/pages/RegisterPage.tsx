
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
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const supabase=createClient(supabaseUrl,supabaseAnonKey);






  



export default function RegisterPage(){

 const[username,setUsername]= useState('');
 const [email,setEmail]= useState('');
 const [password,setPassword]= useState('');
const[confirmPassword,setConfirmPassword]= useState('');

const passwordRegex=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{5,}$/;

if(passwordRegex.test(password)) return true;

//eğer buraya ulaştıysak şifre geçersiz demektir

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
            <button className="register-button">Kaydol</button>
            </div>

        <div className='google-apple-microsoft-account-container'>
            
            <IconButton className="account-button" onClick={AuthService.signInWithGoogle} >
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
        </div>
    )
}