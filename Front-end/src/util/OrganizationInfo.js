import { request } from ".";

//import { TEQ_ORGANIZATION, NORMAL_ORGANIZATION } from '../values';
const test = [
  {
    id: 1,
    name: "Name1",
  },
  {
    id: 2,
    name: "Name2",
  },
  {
    id: 3,
    name: "Name3",
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
    name: "user1",
    email: "Email1",
    id: "Name1",
    password: "pass1"
  },
  {
    name: "user2",
    email: "Email2",
    id: "Name2",
    password: "pass1"

  },
  {
    name: "user3",
    email: "Email3",
    id: "Name3",
    password: "pass1"
  }
]

// Private variables
class _OrganizationInfo {

  addUser = async (_firstname, _lastname, _email, _admin, _id, _password) => {
    try{
      await request(
        '/users',
        '/POST',
        null,
        JSON.stringify({_firstname, _lastname, _id, _admin, _email, _password})
      );
    } catch (err) {
      return err;
    }
  }

  removeUser = (key) => {
    test.splice(key, 1);
    console.log(test);
  }

  addOrganization = async (_id, _name, _services) => {
    try{
      await request(
        '/orgs',
        '/POST',
        null,
        JSON.stringify({_id, _name, _services})
      );
    } catch (err) {
      return err;
    }
  }

  deleteOrganization = async (_name, _id) => {
    try {
      await request(
        '/orgs',
        '/POST',
        null,
        JSON.stringify({ _name, _id})
      );
    } catch (err) {
      return err;
    }
  }
  

  /*getOrganizationID = async (key) => {
    let res;
    try {
      res = await request(
        '/orgs/:id',
        'GET',
        key
      );
      return res;
    } catch (err) {
      return err;
    }
  }*/

  getOrganizationID = async (key) => {
    return test[key].name;
  }

  getOrganizationPassword = (key) => {
    return test[key].password;
  }

  getOrganizationType = () => {
      return "TEQ";
  }

  /*getOrganizationEmail = async (key) => {
    let res;
    try {
      res = await request(
        '/orgs/:id',
        'GET',
        key
      );
      return res;
    } catch (err) {
      return err;
    }
  }*/

  getOrganizationEmail = async (key) => {
    return test[key].email;
  }

  getOrganizationUsername = (key) => {
    return test[key].username;
  }

  /*getOrganizationsList = async () => {
    let res;
    try{
      res = await request(
        '/orgs',
        '/GET',
        null
      );
      return res;
    } catch (err) {
      return err;
    }
  }*/

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