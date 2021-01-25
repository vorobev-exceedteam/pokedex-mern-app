const apiTokenWrapper = (api, token) => {
  if (token) {
    const tokenizedApi = { ...api };
    tokenizedApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return tokenizedApi;
  }
  return api;
};

export default apiTokenWrapper;
