import {action, makeObservable, observable} from 'mobx';
import StorageService from '../services/StorageService';
import * as UserService from '../services/UserService';
import HelperService from "../services/HelperService";
import config from "../config";

class GlobalStore {
  @observable state = 'startup';
  @observable isLoading = true;
  @observable error = null;
  @observable tokenStore = new StorageService('session');
  @observable isAuthorized = false;
  @observable user = config.initUser;

  constructor() {
    makeObservable(this);
    if (this.tokenStore.isRemembered()) {
      this.tokenStore.setStorage('local');
    }
  }

  @action setUserPasswordState = (state) => {
    this.user.hasPassword = state;
  }

  @action setRemembered = (state) => {
    this.tokenStore.setRemembered(state);
  };


  @action addFavoritePokemon = (id) => {
    this.user.favoritePokemons.add(id);
  };

  @action getTokens = () => {
    return this.tokenStore.getTokens();
  };

  @action saveTokens = (tokens) => {
    this.tokenStore.saveTokens(tokens);
  };

  @action setUser = (user) => {
    this.user = {
      ...user,
      favoritePokemons: new Set(user.favoritePokemons),
    };
  };

  @action addToFavoriteSuccess = (id) => {
    this.addFavoritePokemon(id);
    this.setIdleState();
  };

  @action removeFromFavoriteSuccess = (id) => {
    this.removeFavoritePokemon(id);
    this.setIdleState();
  };

  addPokemonToFavorite = async (id, success, failure) => {
    try {
      this.setChangingFavoriteState();
      const authToken = this.tokenStore.getTokens().authJWT;
      await UserService.addToFavorites(authToken, id);
      this.addToFavoriteSuccess(id);
      success('add');
    } catch (e) {
      const err = HelperService.getErrorPayload(e)
      if (err.type === 'AuthTokenExpired') {
        return this.handleExpiredToken(() =>
          this.addPokemonToFavorite(id, success, failure)
        );
      } else {
        failure('add', err);
        this.setErrorState(err)
      }
    }
  };

  removePokemonFromFavorite = async (id, success, failure) => {
    try {
      this.setChangingFavoriteState();
      const authToken = this.tokenStore.getTokens().authJWT;
      await UserService.removeFromFavorites(authToken, id);
      this.removeFromFavoriteSuccess(id);
      success('remove');
    } catch (e) {
      const err = HelperService.getErrorPayload(e);
      if (err.type === 'AuthTokenExpired') {
        return this.handleExpiredToken(() =>
          this.removePokemonFromFavorite(id, success, failure),
          () => failure('remove', err)
        );
      } else {
        failure('remove', err);
        this.setErrorState(err)
      }
    }
  };

  changePokemonFavorState = (id, success, failure) => {
    if (this.user.favoritePokemons.has(id)) {
      return this.removePokemonFromFavorite(id, success, failure);
    }
    return this.addPokemonToFavorite(id, success, failure);
  };

  @action removeFavoritePokemon = (id) => {
    this.user.favoritePokemons.delete(id);
  };

  @action setLoading = (state) => {
    this.isLoading = state;
  };

  @action setStorage = (storage) => {
    this.tokenStore.setStorage(storage);
  };

  @action setAuthorized = (state) => {
    this.isAuthorized = state;
  };

  @action setPendingState = () => {
    this.state = 'pending';
    this.isLoading = true;
    this.error = null;
  };

  @action setChangingFavoriteState = () => {
    this.state = 'changeFavoriteState';
    this.isLoading = false;
    this.error = null;
  };

  @action setErrorState = (err) => {
    this.error = err;
    this.state = 'error';
    this.isLoading = false;
  };

  getUser = async () => {
    try {
      const authToken = this.tokenStore.getTokens().authJWT;
      if (!authToken) {
        return this.getUserSuccess();
      }
      const response = await UserService.getUser(authToken);
      this.getUserSuccess(response.data.data);
    } catch (e) {
      return this.getUserFailure(HelperService.getErrorPayload(e));
    }
  };

  logoutSuccess = () => {
    this.initializeUser();
    this.setRemembered(false);
    this.tokenStore.removeTokens();
    this.setIdleState();
  };

  logout = async () => {
    try {
      this.setPendingState();
      const token = this.tokenStore.getTokens().refreshJWT;
      await UserService.logout(token);
      this.logoutSuccess();
    } catch (e) {
      const error = HelperService.getErrorPayload(e);
      if (this.isTokenError(error)) {
        return this.logoutSuccess();
      }
      return this.setErrorState(error);
    }
  };

  handleExpiredToken = async (successCb, failureCb) => {
    try {
      const token = this.tokenStore.getTokens().refreshJWT;
      const response = await UserService.refresh(token);
      this.saveTokens(response.data.data);
      return successCb();
    } catch (e) {
      const err = HelperService.getErrorPayload(e);
      if (failureCb) {
        failureCb();
      }
      if (err.type === 'RefreshedTokenExpired') {
        this.initializeUser();
        this.setIdleState();
      } else {
        this.setErrorState(err);
      }
    }
  };


  @action setIdleState = () => {
    this.state = 'idle';
    this.isLoading = false;
  };

  @action getUserSuccess = (data) => {
    if (!data) {
      this.isAuthorized = false;
      this.setIdleState();
      return;
    }
    this.isAuthorized = true;
    this.setUser(data.user);
    this.setIdleState();
  };

  @action getUserFailure = (error) => {
    switch (true) {
      case error.type === 'AuthTokenExpired':
        return this.handleExpiredToken(this.getUser);
      case error.type === 'TokenInvalid':
        this.initializeUser();
        this.setIdleState();
        break;
      default:
        this.initializeUser();
        this.setErrorState(error);
    }
  };

  isTokenError = (err) => {
    switch (err.type) {
      case 'RefreshedTokenExpired':
      case 'AuthTokenExpired':
      case 'TokenInvalid':
        return true;
      default:
        return false;
    }
  };

  @action initializeUser = () => {
    this.user = config.initUser;
    this.tokenStore.removeTokens();
    this.isAuthorized = false;
  };
}

export default new GlobalStore();
