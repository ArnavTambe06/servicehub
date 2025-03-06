import { createTheme } from '@mui/material';

export const theme = createTheme({
    palette: {
        primary: {
            main: '#C17817',      // Warm brown
            light: '#E19B24',     // Soft orange
            dark: '#8B4513',      // Deep brown
            contrastText: '#fff'
        },
        secondary: {
            main: '#718355',      // Sage green
            light: '#A4B494',     // Light sage
            dark: '#4A5D32',      // Forest green
            contrastText: '#fff'
        },
        background: {
            default: '#FDF5E6',   // Warm off-white
            paper: '#FFFFFF'
        },
        text: {
            primary: '#2C1810',   // Dark brown
            secondary: '#5C4033'  // Medium brown
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
