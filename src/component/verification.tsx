import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const supabase=createClient(supabaseUrl,supabaseAnonKey);
interface EmailVerificationDialogProps {
  onClose: () => void;
  tokenHash: string;
  email: string;
}

export default function EmailVerificationDialog({ onClose, tokenHash, email }: EmailVerificationDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [code, setCode] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
    setError(null);
    setSuccess(false);
  };

  const handleClose = () => {
    setOpen(false);
    setCode('');
    setError(null);
    setSuccess(false);
  };

  const handleVerify = async () => {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: code,
      type: 'email',
    });

    if (error) {
      setError('Kod doğrulanamadı: ' + error.message);
      setSuccess(false);
    } else {
      setSuccess(true);
      setError(null);
      console.log('Doğrulama başarılı:', data);
      // Gerekirse kullanıcıyı yönlendir
    }
  };

  return (
    <div  style={{zIndex: 1300}}>
      <Button variant="contained" onClick={handleClickOpen}>
        Email Doğrulama
      </Button>

      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Email Doğrulama</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Email adresinize gelen doğrulama kodunu girin.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Kod"
            fullWidth
            variant="standard"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>Doğrulama başarılı!</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>İptal</Button>
          <Button onClick={handleVerify}>Doğrula</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
