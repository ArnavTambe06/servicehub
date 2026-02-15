import { createTheme } from '@mui/material';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#A47149',
            light: '#BB8B67',
            dark: '#7D4B29',
            contrastText: '#fff'
        },
        secondary: {
            main: '#D7BFA6',
            light: '#EADDCB',
            dark: '#BFA685',
            contrastText: '#fff'
        },
        background: {
            default: '#FBF5EE',
            paper: '#FFFFFF'
        },
        text: {
            primary: '#3C2F2F',
            secondary: '#6E6253'
        }
    },
    shape: {
        borderRadius: 8
    },
    typography: {
        fontFamily: "'Inter', 'Roboto', 'Arial', sans-serif",
        h1: {
            fontSize: '2.5rem',
            fontWeight: 600
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 600
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 500
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 500
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 500
        }
    }
});
