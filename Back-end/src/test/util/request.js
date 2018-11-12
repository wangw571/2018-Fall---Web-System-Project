import chai from 'chai';
import chaiHttp from 'chai-http';
import { server } from '../../server';
chai.use(chaiHttp);

// Decorates http request to request as specific user
const fetchAs = (http, token) => http.set('Authorization', `Bearer ${token}`);
class UserRequest {

  constructor(http) {
    this.http = http;
  }

  asNoOne() {
    return this.http
  }

  asSpecified(token) {
    return fetchAs(this.http, token)
  }

  asSystemAdmin() {
    return fetchAs(this.http, process.env.SYS_ADMIN)
  }

  asSystemUser() {
    return fetchAs(this.http, process.env.SYS_USER)
  }

  asRegularAdmin() {
    return fetchAs(this.http, process.env.REG_ADMIN)
  }

  asRegularUser() {
    return fetchAs(this.http, process.env.REG_USER)
  }
}

// Custom fetching with authorizations
export const request = (url, method = 'GET') => (
  new UserRequest(
    chai.request(server) // Setup chai-http request
    [method.toLowerCase()](url) // Setup method
  )
)