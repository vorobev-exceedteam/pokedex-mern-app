import {createContext, memo} from 'react';
import PokemonStore from '../stores/PokemonStore';

export const PokemonContext = createContext();


export const PokemonProvider = memo((props) => (
  <PokemonContext.Provider value={new PokemonStore()}>
    {props.children}
  </PokemonContext.Provider>
));
