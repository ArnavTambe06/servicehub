import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Divider } from '@mui/material';
import { createUserWithEmailAndPassword, signInWithPopup, signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebaseInit';
import { useHistory } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';

const ProviderSignupForm = () => {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        description: '',
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
            await sendEmailVerification(userCredential.user);
            await setDoc(doc(db, 'providers', userCredential.user.uid), {
                companyName: formData.companyName,
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                description: formData.description,
                services: [],
                role: 1,
                uid: userCredential.user.uid,
            });
            alert("Account created successfully! Please verify your email before logging in.");
            setIsLogin(true); // Switch to login view
        } catch (error) {
            alert(error.code === 'auth/email-already-in-use'
                ? "This email is already in use. Please use another email."
                : error.message);
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
            const providerDoc = await getDoc(doc(db, 'providers', result.user.uid));
            if (!providerDoc.exists()) {
                await setDoc(doc(db, 'providers', result.user.uid), {
                    companyName: '',
                    firstName: result.user.displayName?.split(' ')[0] || '',
                    lastName: result.user.displayName?.split(' ')[1] || '',
                    email: result.user.email,
                    phone: result.user.phoneNumber || '',
                    description: '',
                    services: [],
                    role: 1,
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
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h5" textAlign="center">Provider Sign Up</Typography>
            </Grid>
            <Grid item xs={12}>
                <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<GoogleIcon />}
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                >
                    Continue with Google
                </Button>
                <Divider sx={{ my: 2 }}>OR</Divider>
            </Grid>
            {isLogin ? (
                <form onSubmit={handleLogin}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={loginData.email || ''}
                                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Password"
                                name="password"
                                type="password"
                                value={loginData.password || ''}
                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" fullWidth disabled={loading}>
                                Login as Provider
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            ) : (
                <form onSubmit={handleSignup}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Company Name"
                                name="companyName"
                                onChange={handleChange}
                                value={formData.companyName || ''}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="First Name"
                                name="firstName"
                                onChange={handleChange}
                                value={formData.firstName || ''}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Last Name"
                                name="lastName"
                                onChange={handleChange}
                                value={formData.lastName || ''}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                onChange={handleChange}
                                value={formData.email || ''}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Phone"
                                name="phone"
                                onChange={handleChange}
                                value={formData.phone || ''}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                name="description"
                                multiline
                                rows={3}
                                onChange={handleChange}
                                value={formData.description || ''}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Password"
                                name="password"
                                type="password"
                                onChange={handleChange}
                                value={formData.password || ''}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" fullWidth disabled={loading}>
                                Sign Up as Provider
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            )}
            <Grid item xs={12}>
                <Button fullWidth onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? "Don't have a provider account? Sign Up" : "Already have a provider account? Login"}
                </Button>
            </Grid>
        </Grid>
    );
};

export default ProviderSignupForm;
