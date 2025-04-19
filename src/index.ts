import { Firestore } from "firebase-admin/firestore";
import Collection from "./collection";
import Document from "./document";

class EasyFirebase {
  readonly collection: Collection;
  readonly document: Document;
  constructor(public readonly db: Firestore) {
    this.collection = new Collection(this.db);
    this.document = new Document(this.db);
  }
}

export default EasyFirebase;
