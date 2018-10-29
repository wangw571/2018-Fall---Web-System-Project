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
      return TEQ_ORGANIZATION;
  }

}

/* Singleton for authentication object */
let instance;
export const OrganizationInfo = {
  getInstance: () => {
    if (!instance) {
      instance = new _OrganizationInfo();
    }
    return instance
  }
};