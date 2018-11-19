import { database, getHash, getObjectId } from '../util';

const incll = (query, inc) => {
  return query.includes(inc) ||
   query.includes(inc.toLocaleLowerCase()) ||
    query.includes(inc.toLocaleUpperCase())||
     query.includes(inc.slice(0, 0).toLocaleUpperCase() + inc.slice(1));
}

const validQuery = (body) => {

  const res = { isValid: true };
  try{
    JSON.parse(body.query.toString());
  }
  catch(err){
    res.isValid = false;
  }
  if(!res.isValid){
    res.err = `Query invalid`;
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
    const { user: {sudo, id}, body } = req;
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
    const { isValid, err } = validQuery(body);
    if (isValid) {
      // Modify query
      const db = await database.connect();
      const { value, ok } = await db.collection('queries').findOneAndReplace(
        { _id },
        { $set: { name: body.name, query: body.query, created_by: id} },
        { returnOriginal: false }
      );

      // Return result
      if (ok && value) {
        res.json({ status: 'success', data: { ...value } });
      } else {
        res.status(401).json({ status: 'error', err: 'Invalid query id' });
      }
      db.close();
    } else {
      // If data is invalid
      res.status(403).json({ status: "error", err });
    }
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
    const data = queries.filter(({ _id }) => _id.equals(id));
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
    const { isValid, err } = validQuery(body);
    if (isValid) {
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
  }
  else {
    // If data is invalid
    res.status(403).json({ status: "error", err });
  }
  },

  deleteQuery: async (res, req) => {
    const { user: { sudo }, params, body } = req;
    let _id = params.qid;
    const { isValid, err } = validQuery(body);
    if (isValid) {
    // Check if super admin
    if (!sudo) {
      res.status(403).json({ status: 'error', err: 'Insufficient permission' });
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
  }
  else {
    // If data is invalid
    res.status(403).json({ status: "error", err });
  }
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
    const data = queries.filter(({ _id }) => _id.equals(id));
    if (data.length > 0) {
      let TheQuery = JSON.parse(data[0][3].toString());
      // Try translate the sql query to dictionary of options
      try {
        let { value, ok } = await db.collection('submissions').aggregate(TheQuery);
        if(ok) {
        res.json({ status: 'success', data: {...value} });
        }
        else{
          res.status(401).json({ status: 'error', err: 'Query Operation Failed' });
        }
      } catch (err) {
        res.status(401).json({ status: 'err', err });
      }
      return
    } else {
      res.status(403).json({ status: 'error', err: "Query does not exist" });
    }
  }
}