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
    }).then((response) => {
      deferred.resolve(response.data)
    }, (err) => {
      deferred.reject(err)
    });
    return deferred.promise;
  }

  createUser(user) {
    let url = '/api/admin/users';
    let deferred = this.$q.defer();
    this.$http({
      method: 'POST',
      url: url,
      data: user
    }).then((response) => {
      deferred.resolve(response.data)
    }, (err) => {
      deferred.reject(err)
    });
    return deferred.promise;
  }

  deleteUser(userName) {
    let url = '/api/admin/users/'+ userName;
    let deferred = this.$q.defer();
    this.$http({
      method: 'DELETE',
      url: url
    }).then(() => {
      deferred.resolve()
    }, (err) => {
      deferred.reject(err)
    });
    return deferred.promise;
  }
}

export default angular.module('app.user', [])
  .service('UserService', UserService)
  .name;
