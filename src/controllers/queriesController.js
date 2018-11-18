import { database, getHash, getObjectId } from '../util';


const getQueryDB = async (db, org, project) => {
  const { permissions } = await db.collection('organizations')
    .findOne({ _id: org }, { permissions: 1 })
  ;
  const data = await db.collection('queries')
    .find(
      { _id: { $in: permissions } },
      project
    ).toArray()
  ;
  return data;
}

const validQuery = ({ id, name, created_by, query }) => {

  const res = { isValid: true };

  if (!id || typeof(id) !== 'string') {
    res.err = `${!id? 'Missing': 'Invalid'} id`;
    res.isValid = false;
  }

  else if (!name || typeof(name) !== 'string') {
    res.err = `${!name? 'Missing': 'Invalid'} name`;
    res.isValid = false;
  }

  else if (!created_by || typeof(created_by) !== 'string') {
    res.err = `${!created_by? 'Missing': 'Invalid'} created_by`;
    res.isValid = false;
  }

  else if (!query || typeof(query) !== 'string') {
    res.err = `${!query? 'Missing': 'Invalid'} query`;
    res.isValid = false;
  }

  return res
}


const getAllQueries = async (db, project) => (
  db.collection('queries').find({}, project).toArray()
)


export const queriesController = {
  getQueries: async (res, req) => {
    const { user: { sudo } } = req;
    const db = await database.connect();
    let data = null;

    // Get all or subset of templates depending on permissions
    if (sudo) {
      data = await getAllQueries(db, { _id: 1, name: 1, date: 1 });
    } else {
      res.status(403).json({ status: 'error', err: 'Insufficient permission' });
      db.close();
      return
    }

    res.json({ status: 'success', data });
    db.close();
    return
  },

  postQueries: async (res, req) => {
    const { user: { sudo }, body } = req;
    let _id;

    // Check if super admin
    if (!sudo) {
      res.status(403).json({ status: 'error', err: 'Insufficient permission' });
      return
    }

    try {
      _id = getObjectId(body.query);
    } catch (err) {
      res.status(401).json({ status: 'err', err });
      return
    }

    // Modify template
    const db = await database.connect();
    const { value, ok } = await db.collection('queries').findOneAndReplace(
      { _id },
      { $set: body },
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

  getQuery: async (res, req) => {
    const { user: { sudo }, params } = req;

    // Get templates
    let queries = null;
    const id = getObjectId(params.qid);
    const db = await database.connect();
    if (sudo) {
      queries = await getAllQueries(db);
    } else {
      res.status(403).json({ status: 'error', err: 'Insufficient permission' });
      return
    }

    // Find template and return it
    const data = queries.filter(({ _id }) => _id.equals(id) );
    if (data.length > 0) {
      res.json({ status: 'success', data: data[0] });
    } else {
      res.status(403).json({ status: 'error', err: "Query does not exist" });
    }
    db.close();
  },

  postQuery: async (res, req) => {
    const { user: { sudo }, params, body } = req;
    let _id = params.qid;

    // Check if super admin
    if (!sudo) {
      res.status(403).json({ status: 'error', err: 'Insufficient permission' });
      return
    }

    // Modify query
    const db = await database.connect();
    const { value, ok } = await db.collection('queries').findOneAndReplace(
      { _id },
      { $set: body },
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

  runQuery: async (res, req) => {
    const { user: { sudo }, params } = req;

    // Get queries
    let queries = null;
    const id = getObjectId(params.qid);
    const db = await database.connect();
    if (sudo) {
      queries = await getAllQueries(db);
    } else {
      res.status(403).json({ status: 'error', err: 'Insufficient permission' });
      return
    }

    // Find the required template
    const data = queries.filter(({ _id }) => _id.equals(id) );  
    if (data.length > 0) {
      let TheQuery = data[0][3].toString();
      const parser = require('js-sql-parser');
      let parsedQuery;
      // Try translate the sql query to dictionary of options
      try {
        parsedQuery = parser.parse(TheQuery);
      } catch (err) {
        res.status(401).json({ status: 'err', err});
        return
      }
        // TODO: query job
      res.json({ status: 'success', data: data[0] });
    } else {
      res.status(403).json({ status: 'error', err: "Query does not exist" });
    }
    db.close();
  }
}