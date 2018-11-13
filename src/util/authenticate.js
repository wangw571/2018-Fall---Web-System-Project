import crypto from 'crypto';
import { database } from '.';

export const authenticate = async (req, res, next) => {

  // Get and validate bearer token
  const auth  = req.header('Authorization');
  if (auth && auth.startsWith("Bearer ")) {

    // Find user associated with token
    const dbo = await database.connect();
    const user = await dbo.collection('users').findOne({ token: auth.slice(7) });

    // If user found, pass user down to handler
    if (user) {
      const sudo = await dbo.collection('organizations').findOne({ _id: user._org }, { _sys: 1 });
      req.user = {
        ...user,
        sudo: sudo._sys
      };
      next();
      return
    }
  }

  // User not found, return error message and deny access to handler
  res.status(403).json({ status: "error", err: "Invalid token. Access Denied" });
}

export const getHash = data => (
  crypto.createHash(process.env.HASH).update(data).digest('base64')
);
