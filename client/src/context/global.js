import {createContext, memo} from 'react';
import GlobalStore from "../stores/GlobalStore";

export const GlobalContext = createContext(null);

export const GlobalProvider = memo((props) => (
  <GlobalContext.Provider value={GlobalStore}>
    {props.children}
  </GlobalContext.Provider>
));
