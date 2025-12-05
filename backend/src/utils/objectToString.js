export function objectToString(obj, indent = 0) {
    const indentation = "  ".repeat(indent);

    return Object.entries(obj)
        .map(([key, value]) => {
            if (Array.isArray(value)) {
                // Join array values
                return `${indentation}${key} : ${value.join(", ")}`;
            }
            if (value === null || value === undefined) {
                return `${indentation}${key} : -`;
            }
            if (typeof value === 'object') {
                // Recursive call for nested objects
                return `${indentation}${key} : {\n${objectToString(value, indent + 1)}\n${indentation}}`;
            }
            return `${indentation}${key} : ${value}`;
        })
        .join("\n");
}
