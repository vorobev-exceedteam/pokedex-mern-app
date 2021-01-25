import {createContext, memo} from 'react';
import PokemonsStore from '../stores/PokemonsStore';

export const PokemonsContext = createContext(null);

export const PokemonsProvider = memo((props) => (
  <PokemonsContext.Provider value={new PokemonsStore()}>
    {props.children}
  </PokemonsContext.Provider>
));
