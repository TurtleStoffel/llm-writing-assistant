/**
 * Split the file content into chunks split by lines starting with a hashtag
 */
export function parseChunks(content: string): string[] {
    const fileContentLines = content.split("\n");

    // Split the file content into chunks split by lines starting with a hashtag
    const chunks = [];
    let chunkStart = 0;
    for (let i = 0; i < fileContentLines.length; i++) {
        if (fileContentLines[i].startsWith("#")) {
            if (i > chunkStart) {
                chunks.push(fileContentLines.slice(chunkStart, i).join("\n"));
            }
            chunkStart = i;
        }
    }

    // Add the last chunk
    if (chunkStart < fileContentLines.length) {
        chunks.push(fileContentLines.slice(chunkStart).join("\n"));
    }

    return chunks;
}

export function parseChunksByDelimiter(
    content: string,
    delimiter: string,
): string[] {
    const fileContentLines = content.split("\n");

    // Split the file content into chunks split by lines starting with a hashtag
    const chunks = [];
    let chunkStart = 0;
    for (let i = 0; i < fileContentLines.length; i++) {
        if (fileContentLines[i].startsWith(delimiter)) {
            if (i > chunkStart) {
                chunks.push(fileContentLines.slice(chunkStart, i).join("\n"));
            }
            chunkStart = i;
        }
    }

    // Add the last chunk
    if (chunkStart < fileContentLines.length) {
        chunks.push(fileContentLines.slice(chunkStart).join("\n"));
    }

    return chunks;
}

export interface Node {
    content: string;
    children: Node[];
    depth: number;
}

export function parseRoot(content: string): Node {
    const strippedContent = stripPreContent(content);
    const root = parseNestedChunks(strippedContent, 0);

    return root;
}

/**
 * Remove the content before the first Markdown H1 header
 */
export function stripPreContent(content: string): string {
    const lines = content.split("\n");

    let result = "";

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith("# ")) {
            result = lines.slice(i).join("\n");
        }
    }

    return result;
}

export function parseNestedChunks(content: string, depth: number): Node {
    const childContent = getChildContent(content);

    if (childContent === "") {
        return {
            content,
            children: [],
            depth: depth,
        };
    }

    const delimiter = "#".repeat(depth + 2) + " ";
    const chunks = parseChunksByDelimiter(childContent, delimiter);

    const children = chunks.map((chunk) => parseNestedChunks(chunk, depth + 1));

    return {
        content,
        children: children,
        depth: depth,
    };
}

export function getChildContent(content: string): string {
    const lines = content.split("\n");

    const childContentDelimiter = "# ";
    let childContent = "";

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith(childContentDelimiter)) {
            childContent = lines.slice(i + 1).join("\n");
            break;
        }
    }

    return childContent;
}
