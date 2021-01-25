import {action, makeObservable, observable} from 'mobx';
import * as UserService from '../services/UserService';
import config from '../config';
import GlobalStore from "./GlobalStore";
import HelperService from "../services/HelperService";

class AuthStore {
  @observable state = 'idle';
  @observable validationErrors = [];

  constructor() {
    makeObservable(this);
  }

  @action setIdleState = () => {
    this.state = 'idle';
  };

  @action setGoogleAuthState = () => {
    GlobalStore.setPendingState();
    this.state = 'googleAuth';
  }

  googleAuth = (remembered, failureCb) => {
    this.setGoogleAuthState();
    const receiveMessage = (event) => {
      if (event.origin === process.env.REACT_APP_RECEIVE_ORIGIN) {
        switch (event.data.source) {
          case config.googleMsgSrc:
            this.googleAuthSuccess(event.data, remembered);
            window.removeEventListener('message', receiveMessage, false);
            break;
          default:
            break;
        }
      }
    };
    const windowSettings = 'resizable=yes';
    const googleWindow = window.open(
      config.googleSrc,
      'Google OAuth',
      windowSettings
    );

    const timer = setInterval(() => {
      if(googleWindow.closed) {
        window.removeEventListener('message', receiveMessage, false);
        if (this.state === 'googleAuth') {
          this.googleAuthFailure(failureCb);
        }
        clearInterval(timer);
      }
    }, 1000);
    window.addEventListener('message', receiveMessage, false);
  };

  @action loginSuccess = (data) => {
    GlobalStore.saveTokens({
      authJWT: data.authJWT,
      refreshJWT: data.refreshJWT
    });
    GlobalStore.setUser(data.user);
    GlobalStore.setAuthorized(true);
    this.state = 'loginSuccess';
    this.validationErrors = [];
    GlobalStore.setIdleState();
  };

  @action loginFailure = (e) => {
    this.state = 'loginFailure';
    if (e.type === 'ValidationError') {
      this.validationErrors = e.details
      GlobalStore.setIdleState();
    } else {
      GlobalStore.setErrorState(e);
    }
  };

  @action googleAuthSuccess = (data, remembered) => {
    this.state = 'success'
    if (remembered) {
      GlobalStore.setStorage('local');
    } else {
      GlobalStore.setStorage('session');
    }
    GlobalStore.setRemembered(remembered);
    GlobalStore.saveTokens({
      authJWT: data.authJWT,
      refreshJWT: data.refreshJWT
    });
    GlobalStore.setUser(data.user);
    GlobalStore.setAuthorized(true);
    this.state = 'idle';
    this.validationErrors = [];
    GlobalStore.setIdleState();
  };

  @action googleAuthFailure = (failureCb) => {
    this.state = 'idle';
    failureCb()
    GlobalStore.setIdleState();
  };

  @action signupSuccess = () => {
    this.state = 'signupSuccess';
    this.validationErrors = [];
    GlobalStore.setIdleState();
  };

  @action signupFailure = (e) => {
    this.state = 'signupFailure';
    if (e.type === 'ValidationError') {
      this.validationErrors = e.details
      GlobalStore.setIdleState();
    } else {
      GlobalStore.setErrorState(e);
    }
  };

  @action setPendingState = () => {
    this.validationErrors = [];
    this.state = 'pending';
    GlobalStore.setPendingState();
  };

  signup = async (email, password) => {
    try {
      this.setPendingState();
      await UserService.signup(email, password);
      this.signupSuccess();
    } catch (e) {
      this.signupFailure(HelperService.getErrorPayload(e));
    }
  };


  login = async (email, password, remembered) => {
    try {
      this.setPendingState();
      const response = await UserService.login(email, password);
      if (remembered) {
        GlobalStore.setStorage('local');
      } else {
        GlobalStore.setStorage('session');
      }
      GlobalStore.setRemembered(remembered);
      this.loginSuccess(response.data.data);
    } catch (e) {
      this.loginFailure(HelperService.getErrorPayload(e));
    }
  };
}

export default AuthStore;
