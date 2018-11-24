import { database, getObjectId } from "../util";

const ERROR = 'error';
const SUCCESS = 'success';
const PmDenied = 'permission denied';
const ORG = 'organizations';
const USER = 'users';

const clean = ({ name, _sys, permissions }, noDefault) => {
  const def = noDefault? {}: {
    name: `org-${Math.random()}`,
    _sys: false,
    permissions: []
  };

  if (name && typeof(name) === 'string') {
    def.name = name;
  }

  if (_sys !== null && typeof(_sys) === 'boolean') {
    def._sys = _sys;
  }

  if (permissions && typeof(permissions) === 'object') {
    const p = [];
    permissions.forEach(perm => {
      try {
        const id = getObjectId(perm);
        p.push(id);
      } catch (err) {
        console.log(err); // Skip that id
      }
    });
    def.permissions = p;
  }

  return def;
}


export const orgsController = {

  getOrganizations: async ({ user: { sudo } }, res) => {
    if (sudo) {
      const db = await database.connect();
      const data = await db.collection(ORG).find({}).toArray();
      res.json({ status: SUCCESS, data });
      db.close();
    } else {
      res.status(403).json({ status: ERROR, err: PmDenied });
    }
  },

  postOrganizations: async ({ user: { sudo }, body }, res) => {
    if (sudo) {
      const db = await database.connect();
      const insert = await clean(body);
      
      if (!insert.name) {
        res.status(401).json({ status: ERROR, err: 'Please provide a name' });
        return
      }

      const { insertedId } = await db.collection(ORG).insertOne(insert);
      if (insertedId) {
        res.json({ status: SUCCESS, data: { _id: insertedId, ...insert } });
      } else {
        res.status(409).json({ status: ERROR, err: 'Unexpected error for organization creation' });
      }
      db.close();
    } else {
      res.status(403).json({ status: ERROR, err: PmDenied });
    }
  },

  getOrganization: async (req, res) => {
    const { user: { sudo, admin, _org }, params: { org } } = req;
    let _id;

    try {
      _id = getObjectId(org);
    } catch (err) {
      res.status(401).json({ status: ERROR, err });
    }

    if ((_org.equals(_id) && admin) || sudo) {
      const db = await database.connect();
      const data = await db.collection(ORG).findOne({ _id });
      res.json({ status: SUCCESS, data });
      db.close();

    } else {
      res.status(403).json({ status: ERROR, err: PmDenied });
    }

  },

  postOrganization: async (req, res) => {
    const { user: { sudo, admin, _org }, params: { org }, body } = req;
    let _id;

    try {
      _id = getObjectId(org);
    } catch (err) {
      res.status(401).json({ status: ERROR, err });
    }

    if ((_org.equals(_id) && admin) || sudo) {
      const db = await database.connect();
      const set = await clean(body, true);
      const { value, ok } = await db.collection(ORG).findOneAndReplace(
        { _id },
        { $set: set },
        { returnOriginal: false }
      );

      if (value && ok) {
        res.json({ status: SUCCESS, data: value });
      } else {
        res.status(409).json({ status: ERROR, err: 'Unable to update this organization' });
      }
      db.close();

    } else {
      res.status(403).json({ status: ERROR, err: PmDenied });
    }
  },

  deleteOrganization: async (req, res) => {
    const { user: { sudo }, params: { org } } = req;
    let _id;

    try {
      _id = getObjectId(org);
    } catch (err) {
      res.status(401).json({ status: ERROR, err });
    }

    if (sudo) {
      const db = await database.connect();
      const { value, ok } = await db.collection(ORG)
        .findOneAndDelete({ _id })
      ;

      if (value && ok) {
        const { deletedCount } = await db.collection(USER).deleteMany(
          {  _org: _id }
        );

        res.json({ status: SUCCESS, data: { _org: value._id, usersDeleted: deletedCount } });
      } else {
        res.status(409).json({ status: ERROR, err: 'Unable to remove this organization' });
      }
      db.close();

    } else {
      res.status(403).json({ status: ERROR, err: PmDenied });
    }
  }

};