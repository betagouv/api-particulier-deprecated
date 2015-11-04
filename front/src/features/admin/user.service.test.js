import admin from './index';

describe('Service: User', function() {
  let UserService;
  let $httpBackend;

  beforeEach(angular.mock.module(admin));

  beforeEach(angular.mock.inject((_UserService_, _$httpBackend_) => {
    UserService = _UserService_;
    $httpBackend = _$httpBackend_;
  }));


  it('load the users from the backend', (done) => {
    var users = [
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
    ];

    $httpBackend.expectGET("/api/admin/users").respond(200, users)
    var promise = UserService.loadUsers();
    promise.then((result) => {
      expect(result).toEqual(users)
      done();
    }, (err) => {
      expect("error" + err).toBeUndefined();
      done(err);
    })
    $httpBackend.flush();
  });
});
