routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
    .state('landingPage', {
      url: '/',
      template: require('./landingPage.html')
    })
    .state('registration', {
      url: '/registration',
      template: require('./registration.html'),
      redirectTo: 'registration.charte',
    })
    .state('registration.charte', {
      url: '/charte',
      template: require('./registration/charte.html')
    })
    .state('registration.contact', {
      url: '/contact',
      template: require('./registration/contact.html')
    })
    .state('registration.tech', {
      url: '/tech',
      template: require('./registration/tech.html')
    });
}
