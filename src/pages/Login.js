import React, { useState } from 'react';
import { Button, TextField, Divider, Typography } from '@mui/material';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebaseInit';
import GoogleIcon from '@mui/icons-material/Google';
import { useHistory, Link as RouterLink } from 'react-router-dom';
import '../styles/login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            history.push('/');
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            await signInWithPopup(auth, googleProvider);
            history.push('/');
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2>Welcome Back</h2>
                    <p>Login to access your account</p>
                </div>

                <Button
                    fullWidth
                    className="google-btn"
                    variant="outlined"
                    startIcon={<GoogleIcon />}
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                >
                    Continue with Google
                </Button>

                <Divider className="auth-divider">or</Divider>

                <form onSubmit={handleLogin}>
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-field"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-field"
                        required
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        className="submit-btn"
                        disabled={loading}
                    >
                        Login
                    </Button>
                </form>

                <div className="auth-footer">
                    <Typography
                        component={RouterLink}
                        to="/signup"
                        sx={{
                            color: 'primary.main',
                            textDecoration: 'none',
                            '&:hover': {
                                textDecoration: 'underline'
                            }
                        }}
                    >
                        Don't have an account? Sign up
                    </Typography>
                </div>
            </div>
        </div>
    );
};

export default Login;
