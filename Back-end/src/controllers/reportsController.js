import { database, getObjectId } from "../util";

export const reportsController = {

  getReports: async (req, res) => {
    const db = await database.connect();
    const data = await db.collection('reports').find(
      {}, { _id: 1, name: 1, date: 1 }
    ).toArray();

    res.json({ status: 'success', data });
    db.close();
  },

  postReports: async (req, res) => {
    const { user: { sudo, _id }, body } = req;

    if (!sudo) {
      res.status(403).json({ status: 'error', err: 'Permission Denied' });
      return
    }

    const db = await database.connect();
    const data = { ...body, created_by: _id, date: new Date() }
    const { insertedId } = await db.collection('reports').insertOne(data);

    if (insertedId) {
      res.json({ status: 'success', data: { _id: insertedId, ...data } });
    } else {
      res.status(401).json({ status: 'error', err: 'Unexpected error for report creation' });
    }
    db.close();
  },

  getReport: async (req, res) => {
    const { params } = req;
    let _id;

    try {
      _id = getObjectId(params.rid);
    } catch (err) {
      res.status(401).json({ status: 'error', err });
      return
    }

    const db = await database.connect();
    const data = await db.collection('reports').findOne({ _id });

    if (data) {
      res.json({ status: 'success', data });
    } else {
      res.status(403).json({ status: 'error', err: 'Unable to get that report' });
    }
    db.close();
  },

  postReport: async (req, res) => {
    const { user: { sudo }, body, params } = req;
    let _id;

    if (!sudo) {
      res.status(403).json({ status: 'error', err: 'Permission Denied' });
      return
    }

    try {
      _id = getObjectId(params.rid);
    } catch (err) {
      res.status(401).json({ status: 'error', err });
      return
    }

    const db = await database.connect();
    const { value, ok } = await db.collection('reports').findOneAndReplace(
      { _id },
      { $set: { ...body, date: new Date() } },
      { returnOriginal: false }
    );

    if (ok && value) {
      res.json({ status: 'success', data: { ...value } });
    } else {
      res.status(401).json({ status: 'error', err: 'Invalid query id' });
    }
    db.close();
  },

  deleteReport: async (req, res) => {
    const { user: { sudo }, params } = req;
    let _id;

    if (!sudo) {
      res.status(403).json({ status: 'error', err: 'Permission Denied' });
      return
    }

    try {
      _id = getObjectId(params.rid);
    } catch (err) {
      res.status(401).json({ status: 'error', err });
      return
    }

    const db = await database.connect();
    const { value, ok } = await db.collection('reports').findOneAndDelete({ _id });

    if (value && ok) {
      res.json({ status: 'success', data: value._id });
    } else {
      res.status(401).json({ status: 'error', err: 'Unable to remove this report' });
    }
    db.close();
  }      
}