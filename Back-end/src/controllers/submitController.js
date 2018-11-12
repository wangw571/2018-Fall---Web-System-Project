import { database, getObjectId } from "../util";

const hasTemplate = async (db, tid, org) => {
  const check = await db.collection('organizations').findOne(
    { _id: org, permissions: { $in: [tid] } }
  );

  db.close();
  return check? true: false;
}

// Submissions are closed under organizations (even super admin can't access)
export const submitController = {
  getSubmissions: async (req, res) => {
    const { user: { _org } } = req;
    const db = await database.connect();
    const data = await db.collection('submissions').find(
      { _org }, { _id: 1, _temp: 1, _org: 1, time: 1 }
    ).toArray();

    if (data) {
      res.json({ status: 'success', data });
    }
    db.close();
  },


  getSubmission: async (req, res) => {
    const { user: { _org }, params } = req;
    let _temp;


    try {
      _temp = getObjectId(params.tid);
    } catch {
      res.status(401).json({ status: 'error', err: 'Invalid template id' });
      return
    }

    const db = await database.connect();
    const data = await db.collection('submissions').findOne(
      { _org, _temp }
    );

    if (data) {
      res.json({ status: 'success', data });
    } else {
      res.status(403).json({ status: 'error', err: 'Unable to get that submission' });
    }
    db.close();
  },

  postSubmission: async (req, res) => {
    const { user: { _org, sudo }, params, upload } = req;
    let _temp;
    
    try {
      _temp = getObjectId(params.tid);
    } catch {
      res.status(401).json({ status: 'error', err: 'Invalid template id' });
      return
    }

    const db = await database.connect();
    const check = sudo || await hasTemplate(db, _temp, _org);

    if (check) {
      const hasSubmission = await db.collection('submissions').findOne({ _org, _temp });
      if (hasSubmission) {
        res.status(401).json({ status: 'error', err: 'A submission already exist' });
      } else {
        const data = {
          _org, _temp, date: new Date(), submitted: false, data: upload
        };
        const { insertedId } = await db.collection('submissions').insertOne(data);

        if (insertedId) {
          res.json({ status: 'success', data: { _id: insertedId, ...data } });
        } else {
          res.status(401).json({ status: 'error', err: 'Unexpected error from insertion' });
        }
      }
    } else {
      res.status(403).json({ status: 'error', err: 'Unable to find template for organization' });
    }
    db.close();
  },

  patchSubmission: async (req, res) => {
    const { user: { _org }, params, body } = req;
    let _temp;
    
    try {
      _temp = getObjectId(params.tid);
    } catch {
      res.status(401).json({ status: 'error', err: 'Invalid template id' });
      return
    }

    const db = await database.connect();
    const { value, ok } = await db.collection('submissions').findOneAndReplace(
      { _temp, _org },
      { $set: body },
      { returnOriginal: false }
    );
    if (value && ok) {
      res.json({ status: 'success', data: value });
    } else {
      res.status(401).json({ status: 'error', err: 'Submission does not exist' });
    }
    db.close();
  },

  deleteSubmission: async (req, res) => {
    const { user: { _org }, params } = req;
    let _temp;
    
    try {
      _temp = getObjectId(params.tid);
    } catch {
      res.status(401).json({ status: 'error', err: 'Invalid template id' });
      return
    }

    const db = await database.connect();
    const { ok, value } = await db.collection('submissions').findOneAndDelete(
      { _temp, _org },
      { _id: 1, name: 1 }
    );

    if (ok && value) {
      res.json({ status: 'success', data: value._id });
    } else {
      res.status(401).json({ status: 'error', err: 'Submission does not exist' });
    }
    db.close();
  }

}