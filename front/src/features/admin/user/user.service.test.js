import admin from './../index';

describe('Service: User', function() {
  let UserService;
  let $httpBackend;
  let $cookies;

  beforeEach(angular.mock.module(admin));

  beforeEach(angular.mock.inject((_UserService_, _$httpBackend_, _$cookies_) => {
    UserService = _UserService_;
    $httpBackend = _$httpBackend_;
    $cookies = _$cookies_;
  }));

  describe('getting all the Users', () => {
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
  })

  describe("when saving a new user", () => {
    it('it add the new user in the backend', (done) => {
      var user =
        {
          name:"Lyon",
          token: "<qpiodfsjpoqjjd",
          role: "user"
        };

      $httpBackend.expectPOST("/api/admin/users", user).respond(201, user)
      var promise = UserService.createUser(user);
      promise.then((result) => {
        expect(result).toEqual(user)
        done();
      }, (err) => {
        expect("error" + err).toBeUndefined();
        done(err);
      })
      $httpBackend.flush();
    });
  })

  describe("when remouving the user", () => {
    it('remove user in the backend given its name', (done) => {
      $httpBackend.expectDELETE("/api/admin/users/toto").respond(204)
      var promise = UserService.deleteUser("toto");
      promise.then((result) => {
        done();
      }, (err) => {
        expect("error" + err).toBeUndefined();
        done(err);
      })
      $httpBackend.flush();
    });
  })


  describe('when retreiving the user identify', () => {
    it('return the hash', () => {
      spyOn($cookies, 'get').and.returnValue("TOKEN-VALUE")
      var token = UserService.getCurrentUserToken();
      expect(token).toEqual('TOKEN-VALUE')
      expect($cookies.get).toHaveBeenCalledWith('API-TOKEN')
    });
  })
});
