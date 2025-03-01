import React, { useState } from 'react';
import { Button, TextField, Container, Paper, Typography, Link } from '@mui/material';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebaseInit';
import GoogleIcon from '@mui/icons-material/Google';
import { useHistory, Link as RouterLink } from 'react-router-dom';
import './Login.css';

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
        <Container maxWidth="sm" className="loginContainer">
            <Paper elevation={3} style={{ padding: '1rem' }}>
                <Typography variant="h5" gutterBottom>Login</Typography>
                <form onSubmit={handleLogin} className="loginForm">
                    <TextField
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        className="loginButton"
                        disabled={loading}
                    >
                        Login
                    </Button>
                </form>
                <div className="googleButton" onClick={handleGoogleSignIn}>
                    <GoogleIcon />
                    <span>Continue with Google</span>
                </div>
                <Link
                    component={RouterLink}
                    to="/signup"
                    style={{ marginTop: '1rem', display: 'block', textDecoration: 'none', color: '#2575fc' }}
                >
                    Don't have an account? Create one.
                </Link>
            </Paper>
        </Container>
    );
};

export default Login;
