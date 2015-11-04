import admin from './index';

describe('Controller: Admin', function() {
  let $controller;

  beforeEach(angular.mock.module(admin));

  beforeEach(angular.mock.inject(function(_$controller_) {
    $controller = _$controller_;
  }));

  it('initialized with list of users', function() {
    let ctrl = $controller('AdminController');
    expect(ctrl.users).toEqual([
      {
        name:"Lyon",
        token: "<qpiodfsjpoqjjd",
        role: "user"
      },
      {
        name:"Admin",
        token: "",
        role: "admin"
      }
    ]);
  });
});
