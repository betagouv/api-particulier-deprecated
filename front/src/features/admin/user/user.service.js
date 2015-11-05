class UserService {
  constructor($http, $q, $cookies) {
    this.$http = $http;
    this.$q = $q;
    this.$cookies = $cookies
  }

  loadUsers() {
    let url = '/api/admin/users';
    let deferred = this.$q.defer();
    this.$http({
      method: 'GET',
      url: url,
      headers: {
       'X-API-Key': this.getCurrentUserToken()
      }
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
      headers: {
       'X-API-Key': this.getCurrentUserToken()
     },
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
      url: url,
      headers: {
       'X-API-Key': this.getCurrentUserToken()
      }
    }).then(() => {
      deferred.resolve()
    }, (err) => {
      deferred.reject(err)
    });
    return deferred.promise;
  }

  getCurrentUserToken() {
    return this.$cookies.get("API-TOKEN")
  }
}

UserService.$inject = ['$http', '$q', '$cookies'];


export default angular.module('app.user', [])
  .service('UserService', UserService)
  .name;
