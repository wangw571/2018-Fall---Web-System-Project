// Private variables
let _token = null;

class _Authentication {

  /*
    Checks to see if the user is logged in. If so, get the token from localstorage
    and check if valid.
  */
  constructor() {
    const local = localStorage.getItem("token");
    if (local) {
      _token = local;
      this.isAuthenticated();
    }
  }

  /*
    Logs the user in
    @params email and password of user
    @returns the token on sucess, an error otherwise
  */
  login = (email, password) => {
    if (email === "example@example" && password === "example") {
      _token = {
        token: "sadsadsadsadsa",
        expires: new Date()
      };
      localStorage.setItem("token", JSON.stringify(_token));
      return _token
    }
    return { error: "NO TOKEN 4 U" }
  }

  /*
    Logs the user out
  */
  logout = () => {
    localStorage.removeItem("token");
    _token = null;
  }

  /*
    Checkes the Authentication of the user
    @params optional callback functions on authentication pass or fail
    @returns true if authenticated, false otherwise
  */
  isAuthenticated = (pass, fail) => {
    if (_token) {
      // TODO check auth
      if (pass) { pass() }
      return true
    }
    if (fail) { fail() }
    return false
  }

  /*
    Gets the token of the user
    @return The token if authenicated, null otherwise
  */
  getToken = () => _token

}

/* Singleton for authentication object */
const AuthenticationObject = new _Authentication();
export const Authentication = AuthenticationObject;