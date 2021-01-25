import {action, makeObservable, observable} from 'mobx';
import * as PokemonService from '../services/PokemonService';
import GlobalStore from "./GlobalStore";
import config from "../config";


class PokemonsStore {
  @observable pokemons = [];
  @observable state = 'index';
  @observable pokemonsNames = [];

  constructor() {
    makeObservable(this)
  }

  @action setPendingState = () => {
    if (this.state !== 'pending') {
      this.state = 'pending';
      GlobalStore.setPendingState();
    }
  };

  @action setIndexState = () => {
    this.state = 'index';
  };

  @action setFetchState = () => {
    this.state = 'fetch';
  };


  @action setPokemons = (pokemons) => {
    this.pokemons = pokemons;
  };

  @action setPokemonsNames = (pokemonsNames) => {
    this.pokemonsNames = pokemonsNames;
  };


  indexPokemons = async (filterTypes) => {
    try {
      this.setPendingState();
      let pokemonsResponse;
      if (filterTypes.length) {
        pokemonsResponse = new Set([]);
        for (let type of filterTypes) {
          const typeResponse = (
            await PokemonService.getTypeByName(type)
          ).data.pokemon.map((pokemonEl) => pokemonEl.pokemon);
          for (let pokemonName of typeResponse) {
            pokemonsResponse.add(pokemonName);
          }
        }
        pokemonsResponse = Array.from(pokemonsResponse);
      } else {
        pokemonsResponse = (await PokemonService.getPokemons(0, config.maxPokemons)).data
          .results;
      }
      let pokemonsNames = pokemonsResponse.map((pokemon) => pokemon.name);
      this.setPokemonsNames(pokemonsNames);
      this.setFetchState()
    } catch (e) {
      GlobalStore.setErrorState(e);
    }
  };

  fetchPokemons = async (page, limit, filterName) => {
    try {
      this.setPendingState();
      let pokemonsNames = this.pokemonsNames;
      if (filterName) {
        pokemonsNames = this.pokemonsNames.filter((pokemon) =>
          pokemon.startsWith(filterName.toLowerCase())
        );
      }
      const offset = (page - 1) * limit
      const pokemonsOnPage = pokemonsNames.slice(
        offset,
        limit + offset
      );
      const pokemons = [];
      for (let pokemon of pokemonsOnPage) {
        const pokemonDetails = (await PokemonService.getPokemonByName(pokemon))
          .data;
        pokemons.push(PokemonService.transformPokemonForCard(pokemonDetails));
      }
      this.fetchSuccess(pokemons);
    } catch (e) {
      this.setErrorState(e);
    }
  };

  @action setErrorState = (e) => {
    this.state = 'error';
    GlobalStore.setErrorState(e);
  };

  @action fetchSuccess = (pokemons) => {
    this.pokemons = pokemons;
    this.state = 'success';
    GlobalStore.setIdleState();
  };
}

export default PokemonsStore;
