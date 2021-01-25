import {action, makeObservable, observable} from 'mobx';
import * as PokemonService from '../services/PokemonService';
import GlobalStore from "./GlobalStore";
import config from "../config";

class PokemonStore {
  @observable pokemon = config.initPokemon;
  @observable state = 'load';

  constructor() {
    makeObservable(this);
  }

  @action getPokemonSuccess = (pokemon) => {
    this.pokemon = pokemon;
    this.state = 'success';
    GlobalStore.setIdleState();
  };

  @action getPokemonFailure = (e) => {
    this.state = 'error';
    GlobalStore.setErrorState(e);
  };

  getPokemon = async (id) => {
    try {
      GlobalStore.setPendingState();
      const pokemon = await PokemonService.getPokemonForPage(id);
      this.getPokemonSuccess(pokemon);
    } catch (e) {
      GlobalStore.setErrorState(e);
    }
  };
}

export default PokemonStore;
