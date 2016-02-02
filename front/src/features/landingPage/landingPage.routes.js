routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
    .state('landingPage', {
      url: '/',
      template: require('./landingPage.html')
    })
    .state('registration', {
      url: '/registration',
      template: require('./registration.html')
    });
}
