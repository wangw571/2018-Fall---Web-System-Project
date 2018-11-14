import { database, getObjectId } from "../util";

const clean = ({ name, _sys, permissions }, noDefault) => {
  const def = noDefault? {}: {
    name: null,
    _sys: false,
    permissions: []
  };

  if (name && typeof(name) === 'string') {
    def.name = name;
  }

  if (_sys && typeof(_sys) === 'boolean') {
    def._sys = _sys;
  }

  if (permissions && typeof(permissions) === 'object') {
    permissions.forEach(perm => {
      try {
        const id = getObjectId(perm);
        def.permissions.push(id);
      } catch (err) {
        console.log(err); // Skip that id
      }
    });
  }

  return def;
}

export const orgsController = {

  getOrganizations: async ({ user: { sudo } }, res) => {
    if (sudo) {
      const db = await database.connect();
      const data = await db.collection('organizations').find(
        {}, { _id: 1, _sys: 1, name: 1 }
      ).toArray();
      res.json({ status: 'success', data });
      db.close();
    } else {
      res.status(403).json({ status: 'error', err: 'Permission Denied' });
    }
  },

  postOrganizations: async ({ user: { sudo }, body }, res) => {
    if (sudo) {
      const db = await database.connect();
      const insert = await clean(body);
      
      if (!insert.name) {
        res.status(401).json({ status: 'error', err: 'Please provide a name' });
        return
      }

      const { insertedId } = await db.collection('organizations').insertOne(insert);
      if (insertedId) {
        res.json({ status: 'success', data: { _id: insertedId, ...insert } });
      } else {
        res.status(401).json({ status: 'error', err: 'Unexpected error for organization creation' });
      }
      db.close();
    } else {
      res.status(403).json({ status: 'error', err: 'Permission Denied' });
    }
  },

  getOrganization: async (req, res) => {
    const { user: { sudo, admin, _org }, params: { org } } = req;
    let _id;

    try {
      _id = getObjectId(org);
    } catch (err) {
      res.status(401).json({ status: 'error', err });
    }

    if ((_org.equals(_id) && admin) || sudo) {
      const db = await database.connect();
      const data = await db.collection('organizations').findOne({ _id });
      res.json({ status: 'success', data });
      db.close();

    } else {
      res.status(403).json({ status: 'error', err: 'Permission Denied' });
    }

  },

  postOrganization: async (req, res) => {
    const { user: { sudo, admin, _org }, params: { org }, body } = req;
    let _id;

    try {
      _id = getObjectId(org);
    } catch (err) {
      res.status(401).json({ status: 'error', err });
    }

    if ((_org.equals(_id) && admin) || sudo) {
      const db = await database.connect();
      const set = await clean(body, true);
      const { value, ok } = await db.collection('organizations').findOneAndReplace(
        { _id },
        { $set: set },
        { returnOriginal: false }
      );

      if (value && ok) {
        res.json({ status: 'success', data: value });
      } else {
        res.status(401).json({ status: 'error', err: 'Unable to update this organization' });
      }
      db.close();

    } else {
      res.status(403).json({ status: 'error', err: 'Permission Denied' });
    }
  },

  deleteOrganization: async (req, res) => {
    const { user: { sudo }, params: { org } } = req;
    let _id;

    try {
      _id = getObjectId(org);
    } catch (err) {
      res.status(401).json({ status: 'error', err });
    }

    if (sudo) {
      const db = await database.connect();
      const { value, ok } = await db.collection('organizations')
        .findOneAndDelete({ _id })
      ;

      if (value && ok) {
        const { deletedCount } = await db.collection('users').deleteMany(
          {  _org: _id }
        );

        res.json({ status: 'success', data: { _org: value._id, usersDeleted: deletedCount } });
      } else {
        res.status(401).json({ status: 'error', err: 'Unable to remove this organization' });
      }
      db.close();

    } else {
      res.status(403).json({ status: 'error', err: 'Permission Denied' });
    }
  }

};