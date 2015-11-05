export default class LoginController {
  constructor($cookies) {
    this.$cookies = $cookies
  }

  login(user) {
    const token = this.hashCode(user.name+user.password);
    this.$cookies.put('API-TOKEN', token)
    console.log('API-TOKEN', token)
  }

  hashCode(input) {
    var hash = 0, i, chr, len;
    if (input.length == 0) return hash;
    for (i = 0, len = input.length; i < len; i++) {
      chr   = input.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash + "";
  }
}

LoginController.$inject = ["$cookies"];
