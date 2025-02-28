import React, { useState } from 'react';
import { Container, Paper, Switch, FormControlLabel, Typography } from '@mui/material';
import UserSignUpForm from '../components/userSignupForm';
import ProviderSignUpForm from '../components/providerSignupForm';

const SignUp = () => {
    const [isProvider, setIsProvider] = useState(false);

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
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
                            Sign up as {isProvider ? 'Provider' : 'User'}
                        </Typography>
                    }
                    sx={{ mb: 3 }}
                />

                {isProvider ? <ProviderSignUpForm /> : <UserSignUpForm />}
            </Paper>
        </Container>
    );
};

export default SignUp;
