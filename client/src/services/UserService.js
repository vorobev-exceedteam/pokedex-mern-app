import authApi from '../api/apiAuth';
import apiTokenWrapper from '../api/apiTokenWrapper';
import favoritesApi from '../api/pokemonApi';

export const login = (email, password) =>
  authApi.post('/login', {
    email,
    password
  });

export const google = () => {
  return authApi.get('/google')
}

export const signup = (email, password) =>
  authApi.post('/signup', {
    email,
    password
  });

export const checkToken = (token) => {
  return apiTokenWrapper(authApi, token).get('/checkToken');
};

export const logout = (token) => {
  return authApi.delete('/logout', {data: {refreshJWT: token}});
};

export const logoutAll = (token) => {
  return authApi.delete('/logout/all', {data: {refreshJWT: token}});
};

export const updatePassword = (data) => {
  return authApi.post('/update/password', data )
}

export const getUser = (token) => {
  return apiTokenWrapper(authApi, token).get('/user');
};

export const refresh = (token) => {
  return authApi.post('/refresh', {
    refreshJWT: token
  });
};

export const getFavorites = (token) => {
  return apiTokenWrapper(favoritesApi, token).get('/favorite');
};

export const addToFavorites = (token, id) => {
  return apiTokenWrapper(favoritesApi, token).post('/favorite', {
    id
  });
};

export const removeFromFavorites = (token, id) => {
  return apiTokenWrapper(favoritesApi, token).delete('/favorite', {
    data: {
      id
    }
  });
};
