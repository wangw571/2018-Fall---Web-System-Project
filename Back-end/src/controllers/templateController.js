import { database, getObjectId } from '../util';

const getFilterTemplates = async (db, org, project) => {
  const { permissions } = await db.collection('organizations')
    .findOne({ _id: org }, { permissions: 1 })
  ;
  const data = await db.collection(TEMP)
    .find(
      { _id: { $in: permissions } },
      project
    ).toArray()
  ;
  return data;
}

const TEMP = 'templates';
// Gets all templates
const getAllTemplates = async (db, project) => (
  db.collection(TEMP).find({}, project).toArray()
)

const ERROR = 'error';
const SUCCESS = 'success';
const NO_PERMISSION = { status: ERROR, err: 'Insufficient permission' };
const TEMP_DNE = { status: ERROR, err: 'Template does not exist' };
export const templateController = {
  getTemplates: async (req, res) => {
    const { user: { sudo, _org } } = req;
    const db = await database.connect();
    let data = null;

    // Get all or subset of templates depending on permissions
    if (sudo) {
      data = await getAllTemplates(db, { _id: 1, name: 1, date: 1 });
    } else {
      data = await getFilterTemplates(db, _org, { 'data._id': 1, 'data.name': 1, 'data.date': 1 });
    }

    res.json({ status: SUCCESS, data });
    db.close();
  },

  newTemplate: async (req, res) => {
    const { user: { sudo }, file } = req;

    // Check if super admin
    if (!sudo) {
      res.status(403).json(NO_PERMISSION);
      return
    }

    // Check if template exist or not
    const db = await database.connect();
    const look = await db.collection(TEMP).findOne({ $or: [{ file: file.name }, { filename: file.filename }] });
    if (look) {
      res.status(401).json({ status: ERROR, err: `Template already exist, use /temp/${look._id} to update` });
      return
    }

    // Insert new template
    const { insertedId } = await db.collection(TEMP).insertOne({ ...file, date: new Date() });
    res.json({ status: SUCCESS, data: insertedId });
    db.close();
  },

  getTemplate: async (req, res) => {
    const { user: { sudo, _org }, params: { temp } } = req;

    // Get templates
    let temps = null;
    let id = null;
    try {
      id = getObjectId(temp);
    } catch (err) {
      res.status(401).json({ status: ERROR, err });
      return
    }

    const db = await database.connect();
    if (sudo) {
      temps = await getAllTemplates(db);
    } else {
      temps = await getFilterTemplates(db, _org);
    }

    // Find template and return it
    const data = temps.filter(({ _id }) => _id.equals(id) );
    if (data.length > 0) {
      res.json({ status: SUCCESS, data: data[0] });
    } else {
      res.status(403).json(TEMP_DNE);
    }
    db.close();
  },

  postTemplate: async (req, res) => {
    const { user: { sudo }, params: { temp }, body } = req;
    let _id;

    // Check if super admin
    if (!sudo) {
      res.status(403).json(NO_PERMISSION);
      return
    }

    try {
      _id = getObjectId(temp);
    } catch (err) {
      res.status(401).json({ status: ERROR, err });
      return
    }

    // Modify template
    const db = await database.connect();
    const { value, ok } = await db.collection(TEMP).findOneAndReplace(
      { _id },
      { $set: body },
      { returnOriginal: false }
    );

    // Return result
    if (ok && value) {
      res.json({ status: SUCCESS, data: { ...value } });
    } else {
      res.status(401).json({ status: ERROR, err: 'Invalid template id' });
    }
    db.close();
  },

  deleteTemplate: async (req, res) => {
    const { user: { sudo }, params: { temp } } = req;
    let _id;
    
    // Check if super admin
    if (!sudo) {
      res.status(403).json(NO_PERMISSION);
      return
    }

    try {
      _id = getObjectId(temp);
    } catch (err) {
      res.status(401).json({ status: ERROR, err });
      return
    }

    // Find and remove the template
    const db = await database.connect();
    const { ok, value } = await db.collection(TEMP)
      .findOneAndDelete({ _id })
    ;

    // Return result of deletion
    if (ok && value) {
      res.json({ status: SUCCESS, data: value._id });
    } else {
      res.status(403).json(TEMP_DNE);
    }
    db.close();
  }
}