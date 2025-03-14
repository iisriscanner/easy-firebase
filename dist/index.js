import { Firestore } from "firebase-admin/firestore";
import Collection from "./collection";
import Document from "./document";
class EasyFirebase {
    db;
    collection;
    document;
    constructor(db) {
        this.db = db;
        this.collection = new Collection(this.db);
        this.document = new Document(this.db);
    }
}
export default EasyFirebase;
