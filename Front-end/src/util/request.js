import { Authentication } from '.';

const auth = Authentication.getInstance();
export const request = (path, method, body, headers = {}) => new Promise((resolve, reject) => {
  if (auth.isAuthenticated()) {
    headers.Authorization = `Bearer ${auth.getToken()}`;
  }
  fetch(
    process.env.REACT_APP_SERVER + path,
    {
      method: method? method: 'GET',
      headers,
      body
    }
  ).then(
    dat => dat.json()
  ).then(
    res => res.err? reject(res): resolve(res.data)
  );
});

export const reduce = async (arr, key) => (
  arr.reduce((obj, item) => {
    obj[item[key]] = item;
    return obj
  }, {})
)