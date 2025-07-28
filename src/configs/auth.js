const auth = {
  meEndpoint: '/meEndpoint',
  loginEndpoint: '/login',
  registerEndpoint: '/registration',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}

export default auth;
