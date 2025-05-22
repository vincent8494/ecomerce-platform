import React, { useState, useMemo } from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import AppRouter from './components/AppRouter';
import { 
  CssBaseline, 
  ThemeProvider, 
  StyledEngineProvider, 
  IconButton,
  Box
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { lightTheme, darkTheme } from './theme';

// Create a custom theme context
export const ColorModeContext = React.createContext({ 
  toggleColorMode: () => {} 
});

function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  // Update the theme only if the mode changes
  const theme = useMemo(
    () => (mode === 'light' ? lightTheme : darkTheme),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <Provider store={store}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box 
              sx={{
                position: 'fixed',
                top: 16,
                right: 16,
                zIndex: 9999,
              }}
            >
              <IconButton 
                onClick={colorMode.toggleColorMode} 
                color="inherit"
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  boxShadow: theme.shadows[2],
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                  },
                }}
              >
                {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Box>
            <AppRouter />
          </ThemeProvider>
        </StyledEngineProvider>
      </Provider>
    </ColorModeContext.Provider>
  );
}

export default App;
