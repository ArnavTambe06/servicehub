import React, { useState } from 'react';
import { TextField, Button, Divider } from '@mui/material';
import { createUserWithEmailAndPassword, signInWithPopup, signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebaseInit';
import { useHistory } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import '../styles/providerSignupForm.css';

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

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );
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
            alert(
                'Account created successfully! Please verify your email before logging in.'
            );
            setIsLogin(true);
        } catch (error) {
            alert(
                error.code === 'auth/email-already-in-use'
                    ? 'This email is already in use. Please use another email.'
                    : error.message
            );
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
        <div className="container">
            <div className="card">
                <header className="header">
                    <h2>{isLogin ? 'Provider Login' : 'Become a Provider'}</h2>
                    <p>
                        {isLogin
                            ? 'Access your provider account'
                            : 'Start offering your services'}
                    </p>
                </header>
                <section>
                    <Button
                        className="google-button"
                        variant="outlined"
                        startIcon={<GoogleIcon />}
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        fullWidth
                    >
                        Continue with Google
                    </Button>
                    <Divider>or</Divider>
                </section>
                {isLogin ? (
                    <form onSubmit={handleLogin}>
                        <div className="form-container">
                            <TextField
                                className="input-field"
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={loginData.email}
                                onChange={(e) =>
                                    setLoginData({ ...loginData, email: e.target.value })
                                }
                                required
                            />
                            <TextField
                                className="input-field"
                                fullWidth
                                label="Password"
                                name="password"
                                type="password"
                                value={loginData.password}
                                onChange={(e) =>
                                    setLoginData({ ...loginData, password: e.target.value })
                                }
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            className="primary-button"
                            variant="contained"
                            disabled={loading}
                            fullWidth
                        >
                            Login as Provider
                        </Button>
                    </form>
                ) : (
                    <form onSubmit={handleSignup}>
                        <div className="form-container">
                            <TextField
                                className="input-field"
                                fullWidth
                                label="Company Name"
                                name="companyName"
                                onChange={handleChange}
                                value={formData.companyName}
                                required
                            />
                            <TextField
                                className="input-field"
                                fullWidth
                                label="Phone"
                                name="phone"
                                onChange={handleChange}
                                value={formData.phone}
                                required
                            />
                            <TextField
                                className="input-field"
                                fullWidth
                                label="First Name"
                                name="firstName"
                                onChange={handleChange}
                                value={formData.firstName}
                                required
                            />
                            <TextField
                                className="input-field"
                                fullWidth
                                label="Last Name"
                                name="lastName"
                                onChange={handleChange}
                                value={formData.lastName}
                                required
                            />
                            <TextField
                                className="input-field"
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                onChange={handleChange}
                                value={formData.email}
                                required
                            />
                            <TextField
                                className="input-field"
                                fullWidth
                                label="Password"
                                name="password"
                                type="password"
                                onChange={handleChange}
                                value={formData.password}
                                required
                            />
                            <TextField
                                className="input-field"
                                fullWidth
                                label="Company Description"
                                name="description"
                                multiline
                                onChange={handleChange}
                                value={formData.description}
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            className="primary-button"
                            variant="contained"
                            disabled={loading}
                            fullWidth
                        >
                            Sign Up as Provider
                        </Button>
                    </form>
                )}
                <footer style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                    <Button
                        onClick={() => setIsLogin(!isLogin)}
                        sx={{ color: 'primary.main' }}
                    >
                        {isLogin
                            ? "Don't have a provider account? Sign Up"
                            : 'Already have a provider account? Login'}
                    </Button>
                </footer>
            </div>
        </div>
    );
};

export default ProviderSignupForm;