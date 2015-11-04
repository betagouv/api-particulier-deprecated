export default class AdminController {
  constructor(UserService) {
    let self = this;
    UserService.loadUsers().then(function(users) {
      self.users = users;
    })
  }
}

AdminController.$inject = ['UserService'];
