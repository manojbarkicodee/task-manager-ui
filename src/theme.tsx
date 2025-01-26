import { createTheme, ThemeOptions } from '@mui/material/styles';

// Define your custom theme options
const theme: ThemeOptions = createTheme({
  palette: {
    primary: {
      main: '#7b1984', // Custom primary color
      light: '#63a4ff', // Lighter shade of primary
      dark: '#004ba0', // Darker shade of primary
      contrastText: '#fff', // Text color on primary background
    },
    secondary: {
      main: '#212121', // Custom secondary color
      light: '#424242',
      dark: '#616161',
      contrastText: '#757575',
    },
   info: {
       main:"#ceffcc",
       light:"#fac3ff",
       dark:"#f1f1f1",
       contrastText:"#85d9f1",
   },
    background: {
      default: '#ffffff', // Default background color
      paper: '#fff', // Paper background color
    },
    text: {
      primary: '#333', // Default text color
      secondary: '#666', // Secondary text color
    },
  },
  typography: {
    fontFamily: `'inter',  sans-serif`, // Custom font family
    h1: {
      fontFamily: `'inter', sans-serif`,
      fontWeight: 700,
    },
    h2: {
      fontFamily: `'inter', sans-serif`,
      fontWeight: 600,
    },

    body1: {
      fontFamily: `'inter', sans-serif`,
    },
  },
});

export default theme;
