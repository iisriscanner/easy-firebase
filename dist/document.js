import { FieldValue } from "firebase-admin/firestore";
import _ from "lodash";
class Document {
    db;
    constructor(db) {
        this.db = db;
    }
    async set(path, data) {
        try {
            const reference = this.db.doc(path);
            const storedData = (await reference.get()).data();
            if (!storedData)
                throw new Error("Document value is undefined.");
            await reference.update(data);
            return { error: null, data };
        }
        catch (err) {
            if (err instanceof Error) {
                return { error: { name: err.name, message: err.message }, data: null };
            }
            return { error: new Error("Something went wrong"), data: undefined };
        }
    }
    async add(path, data) {
        try {
            const reference = this.db.doc(path);
            const storedData = (await reference.get()).data();
            if (!storedData)
                throw new Error("Document value is undefined.");
            const hasAnyKey = _.keys(_.pick(storedData, _.keys(data))).length > 0;
            if (hasAnyKey) {
                throw new Error("Document already contains fields you're trying to add.");
            }
            await reference.update(data);
            return { error: null, data };
        }
        catch (err) {
            if (err instanceof Error) {
                return { error: { name: err.name, message: err.message }, data: null };
            }
            return { error: new Error("Something went wrong"), data: undefined };
        }
    }
    async update(path, data) {
        try {
            const reference = this.db.doc(path);
            const storedData = (await reference.get()).data();
            if (!storedData)
                throw new Error("Document value is undefined.");
            const allKeysExists = _.keys(data).every((item) => _.keys(storedData).includes(item));
            if (!allKeysExists) {
                throw new Error("Document keys not matched with input data.");
            }
            await reference.update(data);
            return { error: null, data };
        }
        catch (err) {
            if (err instanceof Error) {
                return { error: { name: err.name, message: err.message }, data: null };
            }
            return { error: new Error("Something went wrong"), data: undefined };
        }
    }
    async addToArray(path, fieldName, item) {
        try {
            const reference = this.db.doc(path);
            const storedData = (await reference.get()).data();
            if (!storedData)
                throw new Error("Document value is undefined.");
            const isKeyExists = _.keys(storedData).includes(fieldName);
            if (!isKeyExists) {
                throw new Error(`Key ${fieldName} does not exists in the document.`);
            }
            await reference.update({
                [fieldName]: FieldValue.arrayUnion(item),
            });
            storedData[fieldName].push(item);
            return { error: null, data: storedData };
        }
        catch (err) {
            if (err instanceof Error) {
                return { error: { name: err.name, message: err.message }, data: null };
            }
            return { error: new Error("Something went wrong"), data: undefined };
        }
    }
    async removeFromArray(path, fieldName, item) {
        try {
            const reference = this.db.doc(path);
            const storedData = (await reference.get()).data();
            if (!storedData)
                throw new Error("Document value is undefined.");
            const isKeyExists = _.keys(storedData).includes(fieldName);
            if (!isKeyExists)
                throw new Error(`Key ${fieldName} does not exists in the document.`);
            if (!_.isArray(storedData[fieldName]))
                throw new Error(`Value of key ${fieldName} is not array.`);
            console.log(_.isEqual(storedData[fieldName][0], item));
            if (storedData[fieldName].filter((value) => _.isEqual(value, item)).length === 0)
                throw new Error(`Item ${item} does not exists in the array.`);
            await reference.update({
                [fieldName]: FieldValue.arrayRemove(item),
            });
            return { error: null, data: storedData[fieldName].filter((value) => !_.isEqual(value, item)) };
        }
        catch (err) {
            if (err instanceof Error) {
                return { error: { name: err.name, message: err.message }, data: null };
            }
            return { error: new Error("Something went wrong"), data: undefined };
        }
    }
}
export default Document;
