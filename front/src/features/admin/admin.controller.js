export default class AdminController {
  constructor(UserService) {
    let self = this;
    UserService.loadUsers().then((users) => {
      self.users = users;
    })
  }
}

AdminController.$inject = ['UserService'];
