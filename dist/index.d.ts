import { Firestore } from "firebase-admin/firestore";
import Collection from "./collection";
import Document from "./document";
declare class EasyFirebase {
    private readonly db;
    readonly collection: Collection;
    readonly document: Document;
    constructor(db: Firestore);
}
export default EasyFirebase;
