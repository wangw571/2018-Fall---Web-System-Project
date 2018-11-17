import { Authentication } from '.';
const DEFAULT_HEAD = { 'Content-Type': "application/json" };
const auth = Authentication.getInstance();

export const request = (path, method, body, headers = {}) => new Promise((resolve, reject) => {
  const head = DEFAULT_HEAD;
  if (auth.isAuthenticated()) {
    head.Authorization = `Bearer ${auth.getToken()}`;
  }
  fetch(
    process.env.REACT_APP_SERVER + path,
    {
      method: method? method: 'GET',
      headers: { ...head, ...headers },
      body
    }
  ).then(
    dat => dat.json()
  ).then(
    res => res.err? reject(res): resolve(res.data)
  );
});

export const upload = (path, body, headers = {}) => new Promise((resolve, reject) => {
  const head = headers;
  if (auth.isAuthenticated()) {
    head.Authorization = `Bearer ${auth.getToken()}`;
  }
  fetch(
    process.env.REACT_APP_SERVER + path,
    {
      method: 'POST',
      headers: { ...head, ...headers },
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