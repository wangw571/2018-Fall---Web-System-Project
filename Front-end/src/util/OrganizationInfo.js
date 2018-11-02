import { Authentication } from "./Authentication";

//import { TEQ_ORGANIZATION, NORMAL_ORGANIZATION } from '../values';
const test = [
  {
    username: "Username1",
    email: "Email1",
    name: "Name1",
    password: "pass1"
  },
  {
    username: "Username2",
    email: "Email2",
    name: "Name2",
    password: "pass1"
  },
  {
    username: "Username3",
    email: "Email3",
    name: "Name3",
    password: "pass1"
  }
]
// Private variables
const auth = Authentication.getInstance();
class _OrganizationInfo {

  constructor() {

  }

  addOrganization = (username, email, name, password) => {
    test.push({username: username, email: email, name: name, password: password});

  }
  removeOrganization = (key) => {
    test.splice(key, 1);
    console.log(test);
  }

  getOrganizationName = (key) => {
      // TODO: get the organization name from the backend
      auth.getToken();
      return test[key].name;
  }

  getOrganizationType = () => {
      // TODO: get the organization name from the backend
      auth.getToken();
      return "TEQ";
  }

  getOrganizationEmail = (key) => {
    auth.getToken();
    return test[key].email;
  }

  getOrganizationUsername = (key) => {
    return test[key].username;
  }

  getOrganizationsList = () => {
    //auth.getToken();
    return test;
  }
}

/* Singleton for authentication object */
let instance = null;
export const OrganizationInfo = {
  getInstance: () => {
    if (instance === null) {
      instance = new _OrganizationInfo();
    }
    return instance
  }
};