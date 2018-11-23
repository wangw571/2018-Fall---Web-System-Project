import { database, getObjectId } from "../util";

const SUBM = 'submissions';
const ERROR = 'error';
const SUBM_NOT_EXIST = { status: ERROR, err: 'Submission does not exist' };
const INV_TEMP_ID = { status: ERROR, err: 'Invalid template id' };
const SUCCESS = 'success';

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
    const data = await db.collection(SUBM).find(
      { _org }, { _id: 1, _temp: 1, date: 1, submitted: 1 }
    ).toArray();

    if (data) {
      res.json({ status: SUCCESS, data });
    }
    db.close();
  },


  getSubmission: async (req, res) => {
    const { user: { _org }, params } = req;
    let _temp;


    try {
      _temp = getObjectId(params.tid);
    } catch {
      res.status(401).json(INV_TEMP_ID);
      return
    }

    const db = await database.connect();
    const data = await db.collection(SUBM).findOne(
      { _org, _temp }
    );

    if (data) {
      res.json({ status: SUCCESS, data });
    } else {
      res.status(403).json({ status: ERROR, err: 'Unable to get requested submission' });
    }
    db.close();
  },

  postSubmission: async (req, res) => {
    const { user: { _org, sudo }, params, upload } = req;
    let _temp;
    
    try {
      _temp = getObjectId(params.tid);
    } catch {
      res.status(401).json(INV_TEMP_ID);
      return
    }

    const db = await database.connect();
    const check = sudo || await hasTemplate(db, _temp, _org);

    if (check) {
      const hasSubmission = await db.collection(SUBM).findOne({ _org, _temp });
      if (hasSubmission) {
        res.status(401).json({ status: ERROR, err: 'A submission already exist' });
      } else {
        const data = {
          _org, _temp, date: new Date(), submitted: false, data: upload
        };
        const { insertedId } = await db.collection(SUBM).insertOne(data);

        if (insertedId) {
          res.json({ status: SUCCESS, data: { _id: insertedId, ...data } });
        } else {
          res.status(401).json({ status: ERROR, err: 'Unexpected error from insertion' });
        }
      }
    } else {
      res.status(403).json({ status: ERROR, err: 'Unable to find template for organization' });
    }
    db.close();
  },

  patchSubmission: async (req, res) => {
    const { user: { _org }, params, body } = req;
    let _temp;
    
    try {
      _temp = getObjectId(params.tid);
    } catch {
      res.status(401).json(INV_TEMP_ID);
      return
    }

    const db = await database.connect();
    const { value, ok } = await db.collection(SUBM).findOneAndReplace(
      { _temp, _org },
      { $set: body },
      { returnOriginal: false }
    );
    if (value && ok) {
      res.json({ status: SUCCESS, data: value });
    } else {
      res.status(401).json(SUBM_NOT_EXIST);
    }
    db.close();
  },

  deleteSubmission: async (req, res) => {
    const { user: { _org }, params } = req;
    let _temp;
    
    try {
      _temp = getObjectId(params.tid);
    } catch {
      res.status(401).json(INV_TEMP_ID);
      return
    }

    const db = await database.connect();
    const { ok, value } = await db.collection(SUBM).findOneAndDelete(
      { _temp, _org },
      { _id: 1, name: 1 }
    );

    if (ok && value) {
      res.json({ status: SUCCESS, data: _temp });
    } else {
      res.status(401).json(SUBM_NOT_EXIST);
    }
    db.close();
  }

}