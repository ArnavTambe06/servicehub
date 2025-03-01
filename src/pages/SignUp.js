import React, { useState } from 'react';
import { Container, Paper, Switch, FormControlLabel, Typography, Box } from '@mui/material';
import UserSignupForm from '../components/userSignupForm';
import ProviderSignupForm from '../components/providerSignupForm';

const SignUp = () => {
    const [isProvider, setIsProvider] = useState(false);

    return (
        <Box>
            <Container maxWidth="sm">
                <Paper elevation={6} sx={{ p: 4, borderRadius: 2 }}>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isProvider}
                                onChange={(e) => setIsProvider(e.target.checked)}
                                color="primary"
                            />
                        }
                        label={
                            <Typography variant="h6">
                                {isProvider ? "Sign Up as Provider" : "Sign Up as User"}
                            </Typography>
                        }
                        sx={{ mb: 3 }}
                    />
                    {isProvider ? <ProviderSignupForm /> : <UserSignupForm />}
                </Paper>
            </Container>
        </Box>
    );
};

export default SignUp;
