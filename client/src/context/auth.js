import {createContext, memo} from 'react';
import AuthStore from '../stores/AuthStore';

export const AuthContext = createContext();

export const AuthProvider = memo((props) => {
  return (
    <AuthContext.Provider value={new AuthStore()}>
      {props.children}
    </AuthContext.Provider>
  );
});
