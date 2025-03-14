function hasSameSchemaRecursive(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length)
        return false;
    // Iterate through the keys and check if they match
    for (let key of keys1) {
        if (!keys2.includes(key))
            return false;
        // If values are objects, recursively compare them
        if (typeof obj1[key] === "object" && obj1[key] !== null && typeof obj2[key] === "object" && obj2[key] !== null) {
            if (!hasSameSchemaRecursive(obj1[key], obj2[key]))
                return false;
        }
        else {
            // Check if the types are the same
            if (typeof obj1[key] !== typeof obj2[key])
                return false;
        }
    }
    return true;
}
const objA = { id: "123", name: "Alice" };
const objB = { id: "456", name: "Bob", address: { city: {}, zip: "10001" } };
console.log(Object.keys(objA).every((item) => Object.keys(objB).includes(item)));
console.log(hasSameSchemaRecursive(objA, objB));
export {};
