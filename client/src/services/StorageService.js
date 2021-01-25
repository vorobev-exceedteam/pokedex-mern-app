class StorageService {
  storage;

  constructor(storage) {
    this.setStorage(storage);
  }

  setRemembered = (state) => {
    localStorage.setItem('remembered', state.toString());
  }

  isRemembered = () => {
    const remembered = localStorage.getItem('remembered')
    if (!remembered) {
      return false;
    }
    return remembered === 'true';
  }

  getBrowserStorage = (storage) => {
    switch (storage) {
      case 'local':
        return localStorage;
      case 'session':
        return sessionStorage;
      default:
        throw Error('There is no such storage');
    }
  };

  setStorage = (storage) => {
    this.storage = this.getBrowserStorage(storage);
  };

  saveTokens = (tokens) => {
    this.storage.setItem('auth', JSON.stringify(tokens));
  };

  getTokens = () => {
    const emptyTokens = {
      authJWT: '',
      refreshJWT: ''
    };
    const storageTokens = this.storage.getItem('auth');
    if (!storageTokens) {
      return emptyTokens;
    }
    return JSON.parse(storageTokens);
  };

  removeTokens = () => {
    this.storage.removeItem('auth');
  };
}

export default StorageService;
