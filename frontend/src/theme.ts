import { createTheme, ThemeOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface TypographyVariants {
    h1: React.CSSProperties;
    h2: React.CSSProperties;
    h3: React.CSSProperties;
    body1: React.CSSProperties;
    button: React.CSSProperties;
  }
  
  interface TypographyVariantsOptions {
    h1?: React.CSSProperties;
    h2?: React.CSSProperties;
    h3?: React.CSSProperties;
    body1?: React.CSSProperties;
    button?: React.CSSProperties;
  }
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    h1: true;
    h2: true;
    h3: true;
    body1: true;
    button: true;
  }
}

// Define color schemes for light and dark modes
const lightPalette = {
  primary: {
    main: '#FF6B00',
    light: '#FF8C38',
    dark: '#CC5600',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#333333',
    light: '#5C5C5C',
    dark: '#0A0A0A',
  },
  error: {
    main: '#DC3545',
    light: '#E4606D',
    dark: '#A71D2A',
  },
  success: {
    main: '#28A745',
    light: '#5CB85C',
    dark: '#1E7E34',
  },
  background: {
    default: '#F5F5F5',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#333333',
    secondary: '#6C757D',
  },
};

const darkPalette = {
  primary: {
    main: '#FF8C38',
    light: '#FFA966',
    dark: '#E67300',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#9E9E9E',
    light: '#E0E0E0',
    dark: '#757575',
  },
  error: {
    main: '#F44336',
    light: '#E57373',
    dark: '#D32F2F',
  },
  success: {
    main: '#4CAF50',
    light: '#81C784',
    dark: '#388E3C',
  },
  background: {
    default: '#121212',
    paper: '#1E1E1E',
  },
  text: {
    primary: '#E0E0E0',
    secondary: '#A0A0A0',
  },
};

// Create theme with mode
const getDesignTokens = (mode: 'light' | 'dark'): ThemeOptions => {
  const isLight = mode === 'light';
  const palette = isLight ? lightPalette : darkPalette;
  
  // Define typography with proper types
  const typography = {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 600,
      color: palette.text.primary,
    } as React.CSSProperties,
    h2: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: palette.text.primary,
      marginBottom: '1rem',
    } as React.CSSProperties,
    h3: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: palette.text.primary,
    } as React.CSSProperties,
    body1: {
      fontSize: '1rem',
      color: palette.text.primary,
    } as React.CSSProperties,
    button: {
      textTransform: 'none' as const,
      fontWeight: 500,
    },
  };
  
  return {
    palette: {
      mode,
      ...palette,
    },
    shape: {
      borderRadius: 12,
    },
    typography,
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            '&.glass-effect': {
              '&::before': {
                content: '""',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: isLight 
                  ? 'rgba(255, 255, 255, 0.7)' 
                  : 'rgba(30, 30, 30, 0.7)',
                backdropFilter: 'blur(10px)',
                zIndex: -1,
              },
            },
          },
        },
      },
      MuiPaper: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: isLight 
              ? 'rgba(255, 255, 255, 0.75)' 
              : 'rgba(30, 30, 30, 0.75)',
            backdropFilter: 'blur(12px) saturate(180%)',
            WebkitBackdropFilter: 'blur(12px) saturate(180%)',
            border: `1px solid ${isLight 
              ? 'rgba(255, 255, 255, 0.5)' 
              : 'rgba(255, 255, 255, 0.1)'}`,
            boxShadow: isLight 
              ? '0 4px 30px rgba(0, 0, 0, 0.1)'
              : '0 4px 30px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              boxShadow: isLight 
                ? '0 8px 32px rgba(0, 0, 0, 0.12)'
                : '0 8px 32px rgba(0, 0, 0, 0.36)',
            },
            '&.glass-card': {
              backgroundColor: isLight 
                ? 'rgba(255, 255, 255, 0.65)' 
                : 'rgba(30, 30, 30, 0.65)',
              backdropFilter: 'blur(16px) saturate(200%)',
              WebkitBackdropFilter: 'blur(16px) saturate(200%)',
              border: `1px solid ${isLight 
                ? 'rgba(255, 255, 255, 0.5)' 
                : 'rgba(255, 255, 255, 0.1)'}`,
              borderRadius: '16px',
              boxShadow: isLight 
                ? '0 8px 32px rgba(0, 0, 0, 0.1)'
                : '0 8px 32px rgba(0, 0, 0, 0.3)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: isLight 
                  ? '0 12px 40px rgba(0, 0, 0, 0.15)'
                  : '0 12px 40px rgba(0, 0, 0, 0.4)',
              },
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            padding: '8px 16px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            },
          },
          contained: {
            '&:hover': {
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              '& fieldset': {
                borderColor: isLight ? '#DEE2E6' : '#424242',
              },
              '&:hover fieldset': {
                borderColor: isLight ? '#6C757D' : '#616161',
              },
              '&.Mui-focused fieldset': {
                borderColor: isLight ? '#FF6B00' : '#FF8C38',
                boxShadow: isLight 
                  ? '0 0 0 0.2rem rgba(255, 107, 0, 0.25)'
                  : '0 0 0 0.2rem rgba(255, 140, 56, 0.25)',
              },
            },
          },
        },
      },
    },
  };
};

// Create theme instances
export const lightTheme = createTheme(getDesignTokens('light'));
export const darkTheme = createTheme(getDesignTokens('dark'));

export const theme = lightTheme; // Default theme
