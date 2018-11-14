import { database, getHash } from "../util";

export const AuthController = {
  login: async (req, res) => {

    // Get payload
    const { email, password } = req.body;

    if (email && password) {

      // Create password hash and token
      const hash = getHash(password);
      const token = getHash(new Date() + email);
      const dbo = await database.connect();

      // Find user and update token
      const { value, ok } = await dbo.collection('users').findOneAndReplace(
        { email, password: hash },
        { $set: { token } },
        { projection: { password: 0 } }
      );

      const { _sys } = await dbo.collection('organizations').findOne(
        { _id: value._org },
        { _sys: 1 }
      );

      // Return OK and has value
      if (ok && value) {
        res.json({ status: 'success', data: { ...value, _sys, token } });
        dbo.close();
        return;
      }
      dbo.close();
    }

    // Return error
    res.status(403).json({ status: "error", err: "Invalid password/email" });
  },

  logout: async ({ user: { _id } }, res) => {

    // Remove token from user
    const dbo = await database.connect();
    const { ok } = await dbo.collection('users').findOneAndReplace({ _id }, { $set: { token: null } });

    // Return status of removal
    if (ok) {
      res.json({ status: "success", data: _id });
      dbo.close();
    } else {
      res.status(403).json({ status: "err", err: "Unable to sign user out" });
    }
  }
}