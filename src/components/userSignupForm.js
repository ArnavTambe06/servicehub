import React, { useState } from 'react';
import { TextField, Button, Grid, Divider } from '@mui/material';
import { createUserWithEmailAndPassword, signInWithPopup, signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebaseInit';
import { useHistory } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import '../styles/userSignupForm.css';

const UserSignupForm = () => {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: '',
        email: '',
        password: ''
    });
    const [loginData, setLoginData] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            await sendEmailVerification(userCredential.user); // Email verification sent
            await setDoc(doc(db, 'users', userCredential.user.uid), {
                fullName: formData.fullName,
                phone: formData.phone,
                address: formData.address,
                email: formData.email,
                cart: [],
                role: 0,
                uid: userCredential.user.uid,
            });
            alert("Account created successfully! Please verify your email before logging in.");
            setIsLogin(true); // Switch to login view
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                alert("This email is already in use. Please use a different email.");
            } else {
                alert(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
            history.push('/');
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            setLoading(true);
            const result = await signInWithPopup(auth, googleProvider);
            const userDoc = await getDoc(doc(db, 'users', result.user.uid));
            if (!userDoc.exists()) {
                await setDoc(doc(db, 'users', result.user.uid), {
                    fullName: result.user.displayName || '',
                    phone: result.user.phoneNumber || '',
                    address: '',
                    email: result.user.email,
                    cart: [],
                    role: 0,
                    uid: result.user.uid,
                });
            }
            history.push('/');
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        // Removed the outer "u_auth-container" and replaced with a "card" wrapper
        <div className="card">
            <div className="u_auth-header">
                <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                <p>{isLogin ? 'Sign in to continue' : 'Join our community'}</p>
            </div>

            <Button
                fullWidth
                className="u_google-btn"
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={handleGoogleSignIn}
                disabled={loading}
            >
                Continue with Google
            </Button>

            <Divider className="u_auth-divider">or</Divider>

            {isLogin ? (
                <form onSubmit={handleLogin}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth name="email" label="Email" type="email"
                                value={loginData.email || ''}
                                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} required
                                sx={{ input: { fontSize: '1.2rem', padding: '16px' } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth name="password" label="Password" type="password"
                                value={loginData.password || ''}
                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} required
                                sx={{ input: { fontSize: '1.2rem', padding: '16px' } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button fullWidth variant="contained" type="submit" className="u_submit-btn" disabled={loading}>
                                Login
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            ) : (
                <form onSubmit={handleSignup}>
                    <Grid container spacing={3} className="u_form-container-spaced">
                        <Grid item xs={12}>
                            <TextField
                                fullWidth label="Full Name" name="fullName"
                                onChange={handleChange} value={formData.fullName || ''}
                                required
                                sx={{ input: { fontSize: '1.2rem', padding: '16px' } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth label="Phone" name="phone"
                                onChange={handleChange} value={formData.phone || ''}
                                required
                                sx={{ input: { fontSize: '1.2rem', padding: '16px' } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth label="Address" name="address"
                                onChange={handleChange} value={formData.address || ''}
                                sx={{ input: { fontSize: '1.2rem', padding: '16px' } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth label="Email" name="email" type="email"
                                onChange={handleChange} value={formData.email || ''}
                                required
                                sx={{ input: { fontSize: '1.2rem', padding: '16px' } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth label="Password" name="password" type="password"
                                onChange={handleChange} value={formData.password || ''}
                                required
                                sx={{ input: { fontSize: '1.2rem', padding: '16px' } }}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        className="u_submit-btn"
                        disabled={loading}
                    >
                        Sign Up
                    </Button>
                </form>
            )}
            <div className="u_auth-footer">
                <Button onClick={() => setIsLogin(!isLogin)} sx={{ color: 'primary.main' }}>
                    {isLogin
                        ? "Don't have an account? Sign Up"
                        : "Already have an account? Login"}
                </Button>
            </div>
        </div>
    );
};

export default UserSignupForm;
