//import { TEQ_ORGANIZATION, NORMAL_ORGANIZATION } from '../values';

// Private variables
let _organizationName = null;
let _organizationType = null;

class _OrganizationInfo {

  constructor() {

  }

  getOrganizationName = () => {
      // TODO: get the organization name from the backend
      return "org";
  }

  getOrganizationType = () => {
      // TODO: get the organization name from the backend
      return "TEQ";
  }

  getOrganizationEmail = () => {
    return "example@example.com"
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