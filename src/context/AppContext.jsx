import React, { createContext, useState, useContext } from "react";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [account, setAccount] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  return (
    <AppContext.Provider value={{ account, setAccount, loading, setLoading }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
