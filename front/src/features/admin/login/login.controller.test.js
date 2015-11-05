import admin from './../index';

describe('Controller: Login', function() {
  let $controller;
  let $cookies;

  beforeEach(angular.mock.module(admin));

  beforeEach(angular.mock.inject(( _$cookies_, _$controller_) => {
    $controller = _$controller_;
    $cookies = _$cookies_
  }));

  describe('when logging', () => {
    it('store the token in a cookie', () => {
      spyOn($cookies, 'put')
      const ctrl = $controller("LoginController");
      ctrl.login({name: 'tototiti', password: 'tututiti'});
      expect($cookies.put).toHaveBeenCalledWith('API-TOKEN', '185235020')
    });
  })

  describe("the hashCode function", () => {
    it("return the hash of the string", () => {
      const ctrl = $controller("LoginController");
      const hash =ctrl.hashCode("Toto")
      expect(hash).toEqual("2612822")

    })
  })





});
