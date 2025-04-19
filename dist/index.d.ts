import { Firestore } from "firebase-admin/firestore";
import Collection from "./collection";
import Document from "./document";
declare class EasyFirebase {
    readonly db: Firestore;
    readonly collection: Collection;
    readonly document: Document;
    constructor(db: Firestore);
}
export default EasyFirebase;
