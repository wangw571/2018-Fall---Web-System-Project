import { Authentication } from '.';

const auth = Authentication.getInstance();
export const request = (path, method, headers, body) => new Promise((resolve, reject) => {
  const head = { 'Content-Type': 'application/json' };
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
    res => res.err? reject(res): resolve(res)
  );
});