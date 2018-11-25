import { database, getObjectId } from '../util';

const validate = ({ name, query }) => {
  const data = {};

  // Check if has a name
  if (!name || typeof(name) !== 'string') {
    return { err: `${!name? "Missing": "Invalid"} query name` }
  } else { data.name = name }

  // Check if array of objects
  try {
    if (!query) {
      return { err: 'Missing query' }
    } else if (!Array.isArray(query)) {
      return { err: 'Invalid query' };
    } else {
      const err = query.filter(item => typeof(item) !== 'object');
      if (err.length !== 0) { return { err: 'Invalid query' } }
      // Stringify to prevent BSON detection
      else { data.query = JSON.stringify(query) }
    }
  } catch (err) {
    return { err }
  }

  return data;
}

export const queriesController = {
  getQueries: async (req, res) => {
    const { user: { sudo } } = req;

    if (!sudo) {
      res.status(403).json({ status: 'error', err: 'Insufficient permission' });
      return
    }

    const db = await database.connect();
    const data = await db.collection('queries').find({}, { _id: 1, name: 1, date: 1 }).toArray();
    res.json({ status: 'success', data });
    db.close();
  },

  postQueries: async (req, res) => {
    const { user: { sudo, _id }, body } = req;

    // Check if super admin
    if (!sudo) {
      res.status(403).json({ status: 'error', err: 'Insufficient permission' });
      return
    }

    if (typeof(body.query) === 'string') {
      try {
          body.query = JSON.parse(body.query);
      } catch (err) {
        res.status(401).json({ status: 'error', err });
        return
      }
    }

    let data = validate(body);
    if (!data.err) {
      const db = await database.connect();
      data = { ...data, created_by: _id, date: new Date() }
      const { insertedId } = await db.collection('queries').insertOne(data);

      res.json({ status: "success", data: { _id: insertedId, ...data } });
      db.close();

    } else {
      res.status(403).json({ status: "error", err: data.err });
    }
  },

  getQuery: async (req, res) => {
    const { user: { sudo }, params } = req;

    if (!sudo) {
      res.status(403).json({ status: 'error', err: 'Insufficient permission' });
      return
    }

    let _id;
    try {
      _id = getObjectId(params.qid);
    } catch (err) {
      res.status(401).json({ status: 'error', err });
      return
    }

    // Get query
    const db = await database.connect();
    const data = await db.collection('queries').findOne({ _id });
    if (data) {
      res.json({ status: 'success', data });
    } else {
      res.status(401).json({ status: 'error', err: 'No such query' });
    }
    db.close();
  },

  postQuery: async (req, res) => {
    const { user: { sudo }, params, body } = req;

    if (!sudo) {
      res.status(403).json({ status: 'error', err: 'Insufficient permission' });
      return
    }

    let _id;
    try {
      _id = getObjectId(params.qid);
    } catch (err) {
      res.status(401).json({ status: 'error', err });
      return
    }

    if (typeof(body.query) === 'string') {
      try {
        body.query = JSON.parse(body.query);
      } catch (err) {
        res.status(401).json({ status: 'error', err });
        return
      }
    }

    let data = validate(body);
    if (data.err) {
      res.status(403).json({ status: "error", err: data.err });
      return
    }
    
    const db = await database.connect();
    data = { ...data, created_by: _id, date: new Date() };
    const { value, ok } = await db.collection('queries').findOneAndReplace(
      { _id },
      { $set: data },
      { returnOriginal: false }
    );

    // Return result
    if (ok && value) {
      res.json({ status: 'success', data: { ...value } });
    } else {
      res.status(401).json({ status: 'error', err: 'Invalid query id' });
    }
    db.close();
  },

  deleteQuery: async (req, res) => {
    const { user: { sudo }, params } = req;

    if (!sudo) {
      res.status(403).json({ status: 'error', err: 'Insufficient permission' });
      return
    }

    let _id;
    try {
      _id = getObjectId(params.qid);
    } catch (err) {
      res.status(401).json({ status: 'error', err });
      return
    }

    // Modify query
    const db = await database.connect();
    const { value, ok } = await db.collection('queries').findOneAndDelete({ _id });

    // Return result
    if (ok && value) {
      res.json({ status: 'success', data: value._id });
    } else {
      res.status(401).json({ status: 'error', err: 'Invalid query id' });
    }
    db.close();
  },

  runQuery: async (req, res) => {
    const { user: { sudo }, params } = req;

    if (!sudo) {
      res.status(403).json({ status: 'error', err: 'Insufficient permission' });
      return
    }

    let _id;
    try {
      _id = getObjectId(params.qid);
    } catch (err) {
      res.status(401).json({ status: 'error', err });
      return
    }

    const db = await database.connect();
    const data = await db.collection('queries').findOne({ _id }, { query: 1 });

    if (!data) {
      res.status(401).json({ status: 'error', err: 'No such query' });
      return
    }

    try {
      const result = await db.collection('submissions').aggregate(JSON.parse(data.query)).toArray();
      if (result) {
        res.json({ status: 'success', data: result });
      }
    } catch(err) {
      res.status(401).json({ status: 'error', err });
    }
  }
}