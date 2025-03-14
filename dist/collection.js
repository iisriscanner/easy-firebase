import _ from "lodash";
class Collection {
    db;
    constructor(db) {
        this.db = db;
    }
    /**
     * Get documents data from a collection
     * @param path collection path Eg. users or data/1234/tasks
     * @param orderBy the key to order the documents and must be present in all documents at first level
     *
     */
    async getMany(path, orderBy, limit = 10, offset = 0) {
        try {
            const reference = this.db.collection(path);
            const testSnapshot = await reference.limit(1).get();
            if (testSnapshot.empty)
                return { error: null, data: null };
            const testDocumentData = orderBy in testSnapshot.docs[0].data();
            if (!testDocumentData)
                throw new Error(`Invalid orderBy field, "${orderBy}" is not a valid key`);
            let snapshot = await reference.orderBy(orderBy).offset(offset).limit(limit).get();
            if (snapshot.empty)
                throw new Error("Collection does not exist or empty");
            const data = snapshot.docs.map((doc) => {
                const documentData = doc.data();
                if (!("id" in documentData) || documentData.id === null)
                    return { id: doc.id, ...doc.data() };
                return doc.data();
            });
            return { error: null, data };
        }
        catch (err) {
            if (err instanceof Error) {
                return { error: { name: err.name, message: err.message }, data: null };
            }
            return { error: new Error("Something went wrong"), data: undefined };
        }
    }
    async get(path, id) {
        try {
            const reference = this.db.collection(path).doc(id);
            let snapshot = await reference.get();
            if (!snapshot.exists)
                throw new Error("Document does not exist");
            const documentData = snapshot.data();
            if (!documentData || _.isEmpty(documentData))
                return { error: null, data: null };
            if (!("id" in documentData) || documentData.id === null)
                return { error: null, data: { id: _.last(path.split("/")), ...documentData } };
            return { error: null, data: documentData };
        }
        catch (err) {
            if (err instanceof Error) {
                return { error: { name: err.name, message: err.message }, data: undefined };
            }
            return { error: new Error("Something went wrong"), data: null };
        }
    }
    async add(path, data, id) {
        try {
            const reference = this.db.collection(path);
            if (id) {
                if ((await reference.doc(id).get()).exists)
                    throw new Error("Document with the same id already exists");
                await reference.doc(id).set(data);
                return { error: null, data: { id, ...data } };
            }
            const docReference = await this.db.collection(path).add(data);
            return { error: null, data: { id: docReference.id, ...data } };
        }
        catch (err) {
            if (err instanceof Error) {
                return { error: { name: err.name, message: err.message }, data: undefined };
            }
            return { error: new Error("Something went wrong"), data: null };
        }
    }
    async overwrite(path, data, id) {
        try {
            const reference = this.db.collection(path);
            if (!(await reference.doc(id).get()).exists)
                throw new Error("Document not found.");
            await reference.doc(id).set(data);
            return { error: null, data: { id, ...data } };
        }
        catch (err) {
            if (err instanceof Error) {
                return { error: { name: err.name, message: err.message }, data: undefined };
            }
            return { error: new Error("Something went wrong"), data: null };
        }
    }
    async delete(path, id) {
        try {
            const reference = this.db.collection(path);
            const snapshot = await reference.doc(id).get();
            if (!snapshot.exists)
                throw new Error("Document not found.");
            await reference.doc(id).delete();
            return { error: null, data: { id, ...snapshot.data() } };
        }
        catch (err) {
            if (err instanceof Error) {
                return { error: { name: err.name, message: err.message }, data: undefined };
            }
            return { error: new Error("Something went wrong"), data: null };
        }
    }
}
export default Collection;
