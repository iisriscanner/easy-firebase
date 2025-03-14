import { Firestore } from "firebase-admin/firestore";
import Collection from "./collection.ts";
import Document from "./document.ts";

class EasyFirebase {
  readonly collection: Collection;
  readonly document: Document;
  constructor(private readonly db: Firestore) {
    this.collection = new Collection(this.db);
    this.document = new Document(this.db);
  }
}

export default EasyFirebase;
