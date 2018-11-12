import { MongoClient, ObjectID } from 'mongodb';

export const database = {
  connect: () => {
    return new Promise((resolve, reject) => {
      MongoClient.connect(process.env.DB,
        (err, db) => {
          if (err) { reject(err); }
          resolve(db.db(process.env.COLLECTIONS));
        }
      )
    });
  }
};

export const getObjectId = str => ObjectID(str);