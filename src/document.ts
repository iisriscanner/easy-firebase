import { FieldValue } from "firebase-admin/firestore";
import _ from "lodash";

class Document {
  constructor(private db: FirebaseFirestore.Firestore) {}

  async add(path: string, data: object): Promise<{ error: Error | null; data: object | null | undefined }> {
    try {
      const reference = this.db.doc(path);
      const storedData = (await reference.get()).data();
      if (!storedData) throw new Error("Document value is undefined.");
      const hasAnyKey = _.keys(_.pick(storedData, _.keys(data))).length > 0;
      if (hasAnyKey) {
        throw new Error("Document already contains fields you're trying to add.");
      }
      await reference.update(data);
      return { error: null, data };
    } catch (err) {
      if (err instanceof Error) {
        return { error: { name: err.name, message: err.message }, data: null };
      }
      return { error: new Error("Something went wrong"), data: undefined };
    }
  }
  async update(path: string, data: object): Promise<{ error: Error | null; data: object | null | undefined }> {
    try {
      const reference = this.db.doc(path);
      const storedData = (await reference.get()).data();
      if (!storedData) throw new Error("Document value is undefined.");
      const allKeysExists = _.keys(data).every((item) => _.keys(storedData).includes(item));
      if (!allKeysExists) {
        throw new Error("Document keys not matched with input data.");
      }
      await reference.update(data);
      return { error: null, data };
    } catch (err) {
      if (err instanceof Error) {
        return { error: { name: err.name, message: err.message }, data: null };
      }
      return { error: new Error("Something went wrong"), data: undefined };
    }
  }
  async addToArray(
    path: string,
    fieldName: string,
    item: any
  ): Promise<{ error: Error | null; data: object | null | undefined }> {
    try {
      const reference = this.db.doc(path);
      const storedData = (await reference.get()).data();
      if (!storedData) throw new Error("Document value is undefined.");
      const isKeyExists = _.keys(storedData).includes(fieldName);
      if (!isKeyExists) {
        throw new Error(`Key ${fieldName} does not exists in the document.`);
      }
      await reference.update({
        [fieldName]: FieldValue.arrayUnion(item),
      });
      (storedData[fieldName] as Array<any>).push(item);
      return { error: null, data: storedData };
    } catch (err) {
      if (err instanceof Error) {
        return { error: { name: err.name, message: err.message }, data: null };
      }
      return { error: new Error("Something went wrong"), data: undefined };
    }
  }

  async removeFromArray(
    path: string,
    fieldName: string,
    item: any
  ): Promise<{ error: Error | null; data: object | null | undefined }> {
    try {
      const reference = this.db.doc(path);
      const storedData = (await reference.get()).data();
      if (!storedData) throw new Error("Document value is undefined.");
      const isKeyExists = _.keys(storedData).includes(fieldName);
      if (!isKeyExists) throw new Error(`Key ${fieldName} does not exists in the document.`);

      if (!_.isArray(storedData[fieldName])) throw new Error(`Value of key ${fieldName} is not array.`);
      console.log(_.isEqual(storedData[fieldName][0], item));
      if ((storedData[fieldName] as Array<any>).filter((value) => _.isEqual(value, item)).length === 0)
        throw new Error(`Item ${item} does not exists in the array.`);

      await reference.update({
        [fieldName]: FieldValue.arrayRemove(item),
      });

      return { error: null, data: (storedData[fieldName] as Array<any>).filter((value) => !_.isEqual(value, item)) };
    } catch (err) {
      if (err instanceof Error) {
        return { error: { name: err.name, message: err.message }, data: null };
      }
      return { error: new Error("Something went wrong"), data: undefined };
    }
  }
}

export default Document;
