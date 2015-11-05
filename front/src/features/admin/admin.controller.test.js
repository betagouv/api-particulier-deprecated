import admin from './index';

describe('Controller: Admin', function() {
  let $controller;
  let UserService;

  beforeEach(angular.mock.module(admin));

  beforeEach(angular.mock.inject((_UserService_, _$controller_) => {
    UserService = _UserService_;
    $controller = _$controller_;
  }));

  it('initialise with users', () => {
    spyOn(UserService, 'loadUsers').and.returnValue({
    then(callback) {
      callback(["toto"])
    }});
    let ctrl = $controller("AdminController");
    expect(ctrl.users).toEqual(["toto"])
  });

  describe('creating an user', () => {
    let user = {
      name: 'toto',
      token: 'totoToken',
      role: 'user'
    }

    it('add call the service to create the user', () => {
      let ctrl = $controller("AdminController");

      spyOn(UserService, 'createUser').and.returnValue({
      then(callback) {
        callback({toto: 'toto'})
      }});
      ctrl.createUser({tutu: 'tutu'})

      expect(ctrl.users).toEqual([{toto: 'toto'}])
    });

  })

  describe('deleting an user', () => {
    let user = {
      name: 'toto',
      token: 'totoToken',
      role: 'user'
    }

    it('add call the service to delete the user', () => {
      let ctrl = $controller("AdminController");
      ctrl.users = [ user ]
      spyOn(UserService, 'deleteUser').and.returnValue({
      then(callback) {
        callback()
      }});
      ctrl.deleteUser(user.name)

      expect(ctrl.users).toEqual([])
    });

  })


});
