import { request } from '.';

// Private variables
let _token = null;
<<<<<<< HEAD
let _username = null;
=======
let _user = null;
>>>>>>> 5f5cb4f85e6dbe3b5cccca40d86a3dabd30cb4d7

class _Authentication {

  /*
    Checks to see if the user is logged in. If so, get the token from localstorage
    and check if valid.
  */
  constructor() {
    const local = localStorage.getItem("token");
    if (local) {
      _token = local;
      _user = JSON.parse(localStorage.getItem("user"));
    }
  }

  /*
    Logs the user in
    @params email and password of user
    @returns the token on sucess, an error otherwise
  */
<<<<<<< HEAD
  login = (username, password) => {
    if (username === "bob" && password === "bob") {
      // TODO: Get the token ffrom backend
      const token = {
        token: "sadsadsadsadsa",
        expires: new Date()
      };
      this._username = username;
      localStorage.setItem("token", JSON.stringify(this._token));
      return token
=======
  login = async (email, password) => {
    let res;
    try {
      res = await request(
        '/login',
        'POST',
        null,
        JSON.stringify({ email, password })
      );
    } catch (err) {
      return err;
>>>>>>> 5f5cb4f85e6dbe3b5cccca40d86a3dabd30cb4d7
    }

<<<<<<< HEAD
  /*
    Checks if the username that the user enters at login
    exists in the database.
    @params username
    @returns True if exists, false otherwise
  */
  isValidUsername = (username) => {
    // dummy username
    if (username === "bob") {
      this._username = username;
      return true;
    } else {
      this._username = ""
      return false;
    }
  }

  isValidPassForUser = (password) => {
    // dummy username and password
    if (this._username === "bob" && password === "bob"){
      return true;
    } else {
      return false;
    }
=======
    const { data } = res;
    _user = data;
    _token = data.token;
    localStorage.setItem('token', _token);
    localStorage.setItem('user', JSON.stringify(_user));
    return data;
>>>>>>> 5f5cb4f85e6dbe3b5cccca40d86a3dabd30cb4d7
  }
  
  /*
    Logs the user out
  */
<<<<<<< HEAD
  logout = () => {
    localStorage.removeItem("token");
    _username = "";
=======
  logout = async () => {
    let data;
    try {
      data = await request(
        '/logout',
        'POST'
      );
    } catch (err) {
      return err;
    }

>>>>>>> 5f5cb4f85e6dbe3b5cccca40d86a3dabd30cb4d7
    _token = null;
    _user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return data;
  }

  /*
    Checkes the Authentication of the user
    @returns true if authenticated, false otherwise
  */
  isAuthenticated = () => _token? true: false

  /*
    Gets the token of the user
    @return The token if authenicated, null otherwise
  */
  getToken = () => _token
  getUser = () => _user
}

/* Singleton for authentication object */
let instance;
export const Authentication = {
  getInstance: () => {
    if (!instance) {
      instance = new _Authentication();
    }
    return instance
  }
};