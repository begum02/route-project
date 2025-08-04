
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const supabase=createClient(supabaseUrl,supabaseAnonKey);



export const AuthService = {
  //email  ve şifre ile kayıt
  signUpWithEmail:async(email:string,password:string)=>{
    const{data,error}=await supabase.auth.signUp({
      email: email,
      password:password,
    })
    if(error) {
      throw new Error('Kayıt başarısız: ' + error.message);
    }
  },
  // Google OAuth
  signInWithGoogle: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:5173',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    if (error) throw new Error(`Google ile giriş başarısız: ${error.message}`);
  },

  // Microsoft OAuth
  signInWithMicrosoft: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        redirectTo: 'http://localhost:5173/register',
        scopes: 'openid email profile',
        params: {
          prompt: 'select_account',
        },
      },
    });
    if (error) throw new Error(`Microsoft ile giriş başarısız: ${error.message}`);
  },

  // Apple OAuth
  signInWithApple: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: 'http://localhost:5173/auth/callback',
        params: {
          response_mode: 'form_post',
          scope: 'name email',
        },
      },
    });
    if (error) throw new Error(`Apple ile giriş başarısız: ${error.message}`);
  },
};