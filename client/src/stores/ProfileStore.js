import {action, makeObservable, observable} from 'mobx';
import * as PokemonService from '../services/PokemonService';
import * as UserService from '../services/UserService';
import GlobalStore from './GlobalStore';
import HelperService from "../services/HelperService";

class ProfileStore {
  @observable pokemons = [];
  @observable state = 'fetch';
  @observable validationErrors = [];

  constructor() {
    makeObservable(this);
  }

  getPokemons = async (page, limit) => {
    try {
      const pokemons = [];
      const offset = (page - 1) * limit;
      const favoritePokemonsOnPage = Array.from(
        GlobalStore.user.favoritePokemons
      ).slice(offset, limit + offset);
      for (let pokemon of favoritePokemonsOnPage) {
        const pokemonDetails = (await PokemonService.getPokemonByName(pokemon))
          .data;
        pokemons.push(
          PokemonService.transformPokemonForMiniCard(pokemonDetails)
        );
      }
      this.getPokemonsSuccess(pokemons);
    } catch (e) {
      this.getPokemonsFailure(e);
    }
  };

  @action setFetchState = () => {
    this.state = 'fetch';
  }

  @action getPokemonsSuccess = (pokemons) => {
    this.state = 'idle';
    this.pokemons = pokemons;
    GlobalStore.setIdleState();
  };

  @action getPokemonsFailure = () => {
    this.state = 'failure';
    this.pokemons = [];
    GlobalStore.setIdleState();
  };

  logoutAll = async () => {
    try {
      GlobalStore.setPendingState();
      const { refreshJWT } = GlobalStore.getTokens();
      await UserService.logoutAll(refreshJWT);
      GlobalStore.logoutSuccess();
    } catch (e) {
      GlobalStore.logoutSuccess();
    }
  };

  @action setDialogPendingState = () => {
    this.state = 'dialogLoading';
    this.validationErrors = [];
  };

  @action updatePasswordFailure = (e, successCb, failureCb) => {
    this.state = 'dialogFailure';
    switch (e.type) {
      case 'ValidationError':
        this.validationErrors = e.details;
        break;
      case 'AuthTokenExpired':
        GlobalStore.handleExpiredToken(successCb, () => {
          failureCb(e);
          GlobalStore.setErrorState(e);
        });
        break;
      default:
        failureCb(e);
        GlobalStore.setErrorState(e);
        break;
    }
  };

  @action updatePasswordSuccess = (data, successCb) => {
    this.state = 'idle';
    GlobalStore.saveTokens(data);
    GlobalStore.setUserPasswordState(true);
    successCb();
  };

  updatePassword = async (data, successCb, failureCb) => {
    try {
      this.setDialogPendingState();
      const { refreshJWT } = GlobalStore.getTokens();
      const response = await UserService.updatePassword({
        refreshJWT,
        password: data.password,
        oldPassword: data.oldPassword
      });
      this.updatePasswordSuccess(response.data.data, successCb);
    } catch (e) {
      this.updatePasswordFailure(
        HelperService.getErrorPayload(e),
        () => this.updatePassword(data, successCb, failureCb),
        failureCb
      );
    }
  };
}

export default ProfileStore;
