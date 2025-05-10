import { createContext, useContext, useState } from 'react';

const TitleContext = createContext();

export const TitleProvider = ({ children }) => {
  const [title, setTitle] = useState('Overview');
  
  return (
    <TitleContext.Provider value={{ title, setTitle }}>
      {children}
    </TitleContext.Provider>
  );
};

export const useTitle = () => useContext(TitleContext);