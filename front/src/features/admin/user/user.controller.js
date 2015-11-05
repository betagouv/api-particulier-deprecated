export default class UserController {
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

  deleteUser(userName) {
    this.UserService.deleteUser(userName).then((userReturned) => {
      _.remove(this.users, (user) => {
        return user.name == userName;
      });
    })
  }
}

UserController.$inject = ['UserService'];
