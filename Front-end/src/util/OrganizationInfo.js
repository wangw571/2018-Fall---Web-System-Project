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

const templates  = [
  {
    name: "temp1"
  },
  {
    name: "temp2"
  }, 
  {
    name: "temp3"
  }
]

const users = [
  {
    name: "user1"
  },
  {
    name: "user2"
  },
  {
    name: "user3"
  }
]

// Private variables
const auth = Authentication.getInstance();
let _orgName = null;
let _orgUserName = null;
let _orgEmail = null;
let _orgService = ["service1", "service2"];
class _OrganizationInfo {

  constructor() {

  }

  addOrganization = (_username, _email, _name, _password) => new Promise((resolve, reject) => {
    console.log("Hello");
    fetch(
      process.env.REACT_APP_SERVER + '/orgs', {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.token}` },
        body: JSON.stringify({ _name, _orgService})
      }).then(dat => dat.json()).then(({ data, err }) => {
        console.log(data);
        console.log(err);
        if (!err){
          console.log(data);
          resolve(data);
          return
        }
        reject(err);
      });
  });

  removeOrganization = (key) => {
    test.splice(key, 1);
    console.log(test);
  }

  getOrganizationName = (key) => {
      // TODO: get the organization name from the backend
      auth.getToken();
      return test[key].name;
  }

  getOrganizationPassword = (key) => {
    return test[key].password;
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

  /*getOrganizationsList = () => new Promise((resolve, reject) => {
    const token = auth.getToken();
    fetch(
      process.env.REACT_APP_SERVER + '/orgs', {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.token}`},
        body: JSON.stringify({ token })
      }).then(dat => dat.json()).then(({ data, err }) => {
        if (!err){
          console.log(data);
          resolve(data);
          return
        }
        reject(err);
      });
      return test;
  });*/

  getOrganizationsList = () => {
    return test;
  }

  getTemplates = () => {
    return templates;
  }

  getUsers = () => {
    
    return users;
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