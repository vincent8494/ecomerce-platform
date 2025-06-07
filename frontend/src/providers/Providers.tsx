import React, { ReactNode, useMemo } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { CartProvider } from '../contexts/CartContext';
import { WishlistProvider } from '../contexts/WishlistContext';
import { AuthProvider } from '../contexts/AuthContext';
import { theme } from '../styles/theme';

interface ProvidersProps {
  children: ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  // Memoize the providers to prevent unnecessary re-renders
  const providers = useMemo(() => [
    [Router],
    [ThemeProvider, { theme }],
    [AuthProvider],
    [CartProvider],
    [WishlistProvider],
  ] as const, []);

  // Compose all providers
  const renderProviders = (elements: ReactNode, [Provider, props = {}]: [React.ComponentType<any>, any?]) => {
    return <Provider {...props}>{elements}</Provider>;
  };

  return (
    <>
      {providers.reduceRight(renderProviders, children)}
    </>
  );
};

export default Providers;
