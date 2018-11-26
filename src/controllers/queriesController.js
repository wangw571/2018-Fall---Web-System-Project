import { database, getObjectId } from '../util';

const ERROR = 'error';
const INSUF_PERMISSION = { status: ERROR, err: 'Insufficient permission' };
const QUER = 'queries';
const SUCCESS = 'success';

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

const NO_SUCH_Q = { status: ERROR, err: 'No such query' };
const INVALID_Q = { status: ERROR, err: 'Invalid query id' };
export const queriesController = {
  getQueries: async (req, res) => {
    const { user: { sudo } } = req;

    if (!sudo) {
      res.status(403).json(INSUF_PERMISSION);
      return
    }

    const db = await database.connect();
    const data = await db.collection(QUER).find({}, { _id: 1, name: 1, date: 1 }).toArray();
    res.json({ status: SUCCESS, data });
    db.close();
  },

  postQueries: async (req, res) => {
    const { user: { sudo, _id }, body } = req;

    // Check if super admin
    if (!sudo) {
      res.status(403).json(INSUF_PERMISSION);
      return
    }

    if (typeof(body.query) === 'string') {
      try {
          body.query = JSON.parse(body.query);
      } catch (err) {
        res.status(406).json({ status: ERROR, err });
        return
      }
    }

    let data = validate(body);
    if (!data.err) {
      const db = await database.connect();
      data = { ...data, created_by: _id, date: new Date() }
      const { insertedId } = await db.collection(QUER).insertOne(data);

      res.json({ status: SUCCESS, data: { _id: insertedId, ...data } });
      db.close();

    } else {
      res.status(403).json({ status: ERROR, err: data.err });
    }
  },

  getQuery: async (req, res) => {
    const { user: { sudo }, params } = req;

    if (!sudo) {
      res.status(403).json(INSUF_PERMISSION);
      return
    }

    let _id;
    try {
      _id = getObjectId(params.qid);
    } catch (err) {
      res.status(404).json({ status: ERROR, err });
    }

    // Get query
    const db = await database.connect();
    const data = await db.collection(QUER).findOne({ _id });
    if (data) {
      res.json({ status: SUCCESS, data });
    } else {
      res.status(404).json(NO_SUCH_Q);
    }
    db.close();
  },

  postQuery: async (req, res) => {
    const { user: { sudo }, params, body } = req;

    if (!sudo) {
      res.status(403).json(INSUF_PERMISSION);
      return
    }

    let _id;
    try {
      _id = getObjectId(params.qid);
    } catch (err) {
      res.status(401).json({ status: ERROR, err });
      return
    }

    if (typeof(body.query) === 'string') {
      try {
        body.query = JSON.parse(body.query);
      } catch (err) {
        res.status(401).json({ status: ERROR, err });
        return
      }
    }

    let data = validate(body);
    if (data.err) {
      res.status(406).json(INVALID_Q);
      return
    }
    
    const db = await database.connect();
    data = { ...data, created_by: _id, date: new Date() };
    const { value, ok } = await db.collection(QUER).findOneAndReplace(
      { _id },
      { $set: data },
      { returnOriginal: false }
    );

    // Return result
    if (ok && value) {
      res.json({ status: 'success', data: { ...value } });
    } else {
      res.status(403).json({ status: ERROR, err: data.err });
    }
    db.close();
  },

  deleteQuery: async (req, res) => {
    const { user: { sudo }, params } = req;

    if (!sudo) {
      res.status(403).json(INSUF_PERMISSION);
      return
    }

    let _id;
    try {
      _id = getObjectId(params.qid);
    } catch (err) {
      res.status(401).json({ status: ERROR, err });
      return
    }

    // Modify query
    const db = await database.connect();
    const { value, ok } = await db.collection(QUER).findOneAndDelete({ _id });

    // Return result
    if (ok && value) {
      res.json({ status: SUCCESS, data: value._id });
    } else {
      res.status(403).json(INVALID_Q);
    }
    db.close();
  },

  runQuery: async (req, res) => {
    const { user: { sudo }, params } = req;

    if (!sudo) {
      res.status(403).json(INSUF_PERMISSION);
      return
    }

    let _id;
    try {
      _id = getObjectId(params.qid);
    } catch (err) {
      res.status(403).json({ status: ERROR, err });
      return
    }

    const db = await database.connect();
    const data = await db.collection(QUER).findOne({ _id }, { query: 1 });

    if (!data) {
      res.status(401).json({ status: 'error', err: 'No such query' });
      return
    }

    try {
      const result = await db.collection('submissions').aggregate(JSON.parse(data.query)).toArray();
      res.json({ status: SUCCESS, data: result });
    } catch(err) {
      res.status(406).json({ status: ERROR, err: 'Query operation failed' });
    }
  }
}