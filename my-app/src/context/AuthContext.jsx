import React, { createContext, useState, useContext, useMemo } from 'react';

// 1. Create the Context
const AuthContext = createContext(null);

// 2. Create a Provider Component
export const AuthProvider = ({ children }) => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); // Initial state

  // You might want to add logic here to check localStorage/sessionStorage
  // for an existing session when the app loads.
  // useEffect(() => {
  //   const storedUser = localStorage.getItem('isUserLoggedIn');
  //   if (storedUser === 'true') {
  //     setIsUserLoggedIn(true);
  //   }
  // }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    isUserLoggedIn,
    setIsUserLoggedIn,
  }), [isUserLoggedIn]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Create a custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};