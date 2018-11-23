import { database, getHash, getObjectId } from '../util';


const SUCCESS = "success";
const ERROR = 'error';
const ACCESS_DN = { status: ERROR, err: "Access Denied" };
const USERS = 'users';


const getUsers = async (db, match) => (
  db.collection(USERS).find(
    match,
    { password: 0, token: 0 }
  ).toArray()
);

const validUser = ({ firstname, lastname, email, admin, password }) => {

  const res = { isValid: true };

  if (!firstname || typeof(firstname) !== 'string') {
    res.err = `${!firstname? 'Missing': 'Invalid'} firstname`;
    res.isValid = false;
  }

  else if (!lastname || typeof(lastname) !== 'string') {
    res.err = `${!lastname? 'Missing': 'Invalid'} lastname`;
    res.isValid = false;
  }

  else if (!email || typeof(email) !== 'string' || !email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
    res.err = `${!email? 'Missing': 'Invalid'} email`;
    res.isValid = false;
  }

  else if (admin === null || typeof(admin) !== 'boolean') {
    res.err = `${!admin? 'Missing': 'Invalid'} admin status`;
    res.isValid = false;
  }

  else if (!password || typeof(password) !== 'string') {
    res.err = `${!password? 'Missing': 'Invalid'} password`;
    res.isValid = false;
  }

  return res
}


export const UsersController = {
  
  getAllUsers: async (req, res) => {
    const { _org, sudo } = req.user;

    // Find all users in the authenticated user's organization
    const db = await database.connect();
    const users = await getUsers(db, sudo? {} : { _org });

    // Return all the users
    res.json({ status: SUCCESS, data: users });
    db.close();
  },

  getMe: async (req, res) => {
    const { user, sudo } = req;

    // Return all the users
    delete user._org;
    delete user.password;
    delete user.token;
    user._sys = sudo;
    res.json({ status: SUCCESS, data: user });
  },

  postMe: async (req, res) => {
    const { body, user: { _id, _org } } = req;

    if (body.password) {
      body.password = getHash(body.password);
    }

    // Find user and update token
    const db = await database.connect();
    const { value, ok } = await db.collection(USERS).findOneAndReplace(
      { _id, _org },
      { $set: body },
      { projection: { password: 0, token: 0 }, returnOriginal: false }
    );

    // Return OK and has value
    if (ok && value) {
      res.json({ status: SUCCESS, data: { ...value } });
    } else {
      res.json({ status: ERROR, data: "No such user exist in database" });
    }
    db.close();
  },

  getOrgUsers: async (req, res) => {
    const { params: { org }, user } = req;
    let _org = null;

    // Create objectIds
    try {
      _org = getObjectId(org);
    } catch (err) {
      res.status(401).json({ status: ERROR, err });
      return
    }

    // Check if user is allowed to access users of this organization
    if (!user._org.equals(_org) && !user.sudo) {
      res.status(403).json(ACCESS_DN);
      return
    }

    // Get users of this organization
    const db = await database.connect();
    const users = await getUsers(db, { _org });
    res.json({ status: SUCCESS, data: users });
    db.close();
  },

  postOrgUser: async (req, res) => {
    const { params, user, body } = req;
    let _org = null;

    // Create objectIds
    try {
      _org = getObjectId(params.org);
    } catch (err) {
      res.status(403).json({ status: ERROR, err });
      return
    }

    // Check if user is allowed to insert user of this organization
    if ((!user._org.equals(_org) || !user.admin) && !user.sudo) {
      res.status(403).json(ACCESS_DN);
      return
    }

    // Check if data is valid
    const { isValid, err } = validUser(body);
    if (isValid) {

      // Check if user is in database
      const db = await database.connect();
      const findUser = await db.collection(USERS).findOne({ email: body.email });

      // If not insert user
      if (!findUser) {
        const { ops } = await db.collection(USERS).insertOne({
          _org,
          ...body,
          password: getHash(body.password),
          token: null
        });

        // Hide password & token and return inserted user
        delete ops[0].password;
        delete ops[0].token;
        res.json({ status: SUCCESS, data: ops[0] });
        db.close();

      } else {
        // If user is in database
        res.status(403).json({ status: ERROR, err: `User ${body.email} already exist!` });
      }
    } else {

      // If data is invalid
      res.status(403).json({ status: ERROR, err });
    }
  },

  getUser: async (req, res) => {
    const { params, user } = req;
    let _org = null;
    let _id = null;

    // Create objectIds
    try {
      _org = getObjectId(params.org);
      _id = getObjectId(params.user);
    } catch (err) {
      res.status(403).json({ status: ERROR, err });
      return
    }

    // Check if user is allowed to access user of this organization
    if (!user._org.equals(_org) && !user.sudo) {
      res.status(403).json(ACCESS_DN);
      return
    }

    // Get users of this organization
    const db = await database.connect();
    const data = await db.collection(USERS).findOne(
      { _org, _id },
      { password: 0, token: 0 }
    );
    
    const { _sys } = await db.collection('organizations').findOne(
      { _id: _org },
      { _sys: 1 }
    );
    
    data._sys = _sys;
    res.json({ status: SUCCESS, data });
    db.close();
  },

  postUser: async (req, res) => {
    const { params, user, body } = req;
    let _org = null;
    let _id = null;

    // Create objectIds
    try {
      _org = getObjectId(params.org);
      _id = getObjectId(params.user);
    } catch (err) {
      res.status(403).json({ status: ERROR, err });
      return
    }

    // Check if user is allowed to update user of this organization
    // Or if user is themselves
    if ((!user._org.equals(_org) || !user.admin) && !user.sudo && !user._id.equals(_id)) {
      res.status(403).json(ACCESS_DN);
      return
    }

    if (body.password) {
      body.password = getHash(body.password);
    }
    // Find user and update token
    const db = await database.connect();
    const { value, ok } = await db.collection(USERS).findOneAndReplace(
      { _id, _org },
      { $set: body },
      { projection: { password: 0, token: 0 }, returnOriginal: false }
    );

    // Return OK and has value
    if (ok && value) {
      res.json({ status: SUCCESS, data: value });
    } else {
      res.json({ status: ERROR, data: "No such user exist in database" });
    }
    db.close();
  },

  deleteUser: async (req, res) => {
    const { params, user } = req;
    let _org = null;
    let _id = null;

    // Create objectIds
    try {
      _org = getObjectId(params.org);
      _id = getObjectId(params.user);
    } catch (err) {
      res.status(403).json({ status: ERROR, err });
      return
    }

    // Check if user is allowed to update user of this organization
    // Or not themselves (Can't have them getting rid of them self....)
    if ((!user._org.equals(_org) || !user.admin) && !user.sudo) {
      res.status(403).json(ACCESS_DN);
      return
    }

    // Find user and update token
    const db = await database.connect();
    const { ok, value } = await db.collection(USERS)
      .findOneAndDelete({ _id, _org })
    ;

    if (ok && value) {
      res.json({ status: SUCCESS, data: value._id });
    } else {
      res.status(403).json({ status: ERROR, err: 'User does not exist' });
    }
    db.close();
  }
}
