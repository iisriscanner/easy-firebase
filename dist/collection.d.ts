declare class Collection {
    private db;
    constructor(db: FirebaseFirestore.Firestore);
    getAll(path: string, orderBy: string): Promise<{
        error: Error | null;
        data: any[] | null | undefined;
    }>;
    /**
     * Get documents data from a collection
     * @param path collection path Eg. users or data/1234/tasks
     * @param orderBy the key to order the documents and must be present in all documents at first level
     *
     */
    getMany(path: string, orderBy: string, limit?: number, offset?: number): Promise<{
        error: Error | null;
        data: any[] | null | undefined;
    }>;
    get(path: string, id: string): Promise<{
        error: Error | null;
        data: any | null;
    }>;
    add(path: string, data: any, id?: string): Promise<{
        error: Error | null;
        data: any | null;
    }>;
    overwrite(path: string, data: any, id: string): Promise<{
        error: Error | null;
        data: any | null;
    }>;
    delete(path: string, id: string): Promise<{
        error: Error | null;
        data: any | null;
    }>;
}
export default Collection;
