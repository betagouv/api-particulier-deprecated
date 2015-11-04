import angular from 'angular';

class UserService {
  constructor($http, $q) {
    this.$http = $http;
    this.$q = $q;
  }

  loadUsers() {
    let url = '/api/admin/users';
    let deferred = this.$q.defer();
    this.$http({
      method: 'GET',
      url: url
    }).then(function successCallback(response) {
      deferred.resolve(response.data)
    }, function errorCallback(err) {
      deferred.reject(err)
    });
    return deferred.promise;
  }
}

export default angular.module('app.user', [])
  .service('UserService', UserService)
  .name;
