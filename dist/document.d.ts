declare class Document {
    private db;
    constructor(db: FirebaseFirestore.Firestore);
    add(path: string, data: object): Promise<{
        error: Error | null;
        data: object | null | undefined;
    }>;
    update(path: string, data: object): Promise<{
        error: Error | null;
        data: object | null | undefined;
    }>;
    addToArray(path: string, fieldName: string, item: any): Promise<{
        error: Error | null;
        data: object | null | undefined;
    }>;
    removeFromArray(path: string, fieldName: string, item: any): Promise<{
        error: Error | null;
        data: object | null | undefined;
    }>;
}
export default Document;
