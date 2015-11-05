routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
    .state('admin', {
      url: '/admin',
      template: require('./admin.html'),
      resolve: {
        token: () => {return $cookies.get('API-TOKEN')}
      }
    })
    .state('admin.user', {
      url: '/user',
      template: require('./user/user.html'),
      controller: 'UserController',
      controllerAs: 'user'
    })
    .state('admin.login', {
      url: '/login',
      template: require('./login/login.html'),
      controller: 'LoginController',
      controllerAs: 'login'
    })
}
