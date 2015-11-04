export default class AdminController {
  constructor(UserService) {
    let self = this;
    this.users = [];
    this.UserService = UserService;
    UserService.loadUsers().then((users) => {
      self.users = users;
    })
  }

  createUser(user) {
    this.UserService.createUser(user).then((userReturned) => {
      this.users.push(userReturned)
    })
  }
}

AdminController.$inject = ['UserService'];
