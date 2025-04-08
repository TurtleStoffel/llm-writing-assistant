import { assert } from "@std/assert/assert";

export interface Node {
    content: string;
    children: Node[];
    depth: number;
}

export function parseRoot(content: string): Node {
    const strippedContent = stripPreContent(content, "# ");
    const children = parseNestedChunks(strippedContent, 1);

    return {
        content: content,
        children: children,
        depth: 0,
    };
}

/**
 * Remove the content before the first Markdown H1 header
 */
export function stripPreContent(content: string, headerPrefix: string): string {
    const lines = content.split("\n");

    let result = "";

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith(headerPrefix)) {
            result = lines.slice(i).join("\n");
            break;
        }
    }

    return result;
}

export function parseNestedChunks(content: string, depth: number): Node[] {
    const headerPrefix = "#".repeat(depth) + " ";
    const lines = content.split("\n");

    if (lines.length === 0) {
        return [];
    }

    const containsHeader = lines.some((line) => line.startsWith(headerPrefix));
    if (!containsHeader) {
        return [];
    }

    assert(
        lines[0].startsWith(headerPrefix),
        `First line must start with ${headerPrefix}`,
    );

    const indices = lines.map((line, index) => {
        if (line.startsWith(headerPrefix)) {
            return index;
        }
        return -1;
    }).filter((index) => index !== -1);

    const contentChunks = indices.map((headerIndex, i) => {
        if (i === indices.length - 1) {
            return lines.slice(headerIndex).join("\n");
        }
        return lines.slice(headerIndex, indices[i + 1]).join("\n");
    });

    return contentChunks.map((chunk) => {
        const childHeaderPrefix = "#".repeat(depth + 1) + " ";
        const childContent = stripPreContent(chunk, childHeaderPrefix);
        return {
            content: chunk,
            depth: depth,
            children: parseNestedChunks(childContent, depth + 1),
        };
    });
}
