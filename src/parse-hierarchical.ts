import { assert } from "@std/assert/assert";

export interface Node {
    content: string;
    children: Node[];
    depth: number;
}

export function parseRoot(content: string): Node {
    const { strippedContent, depth } = stripPreContent(content);

    const children = parseNestedChunks(strippedContent, depth);

    return {
        content: content,
        children: children,
        depth: 0,
    };
}

/**
 * Remove the content before the first H1 Header (if present) or before the first H2 Header.
 *
 * Content is required to contain at least one H1 or H2 header.
 */
export function stripPreContent(content: string): {
    strippedContent: string;
    depth: number;
} {
    const H1_PREFIX = "# ";
    const H2_PREFIX = "## ";
    const lines = content.split("\n");
    const containsH1 = lines.some((line) => line.startsWith(H1_PREFIX));
    const containsH2 = lines.some((line) => line.startsWith(H2_PREFIX));

    assert(
        containsH1 || containsH2,
        "Content needs to at least contain an H1 or H2 header",
    );

    const prefix = containsH1 ? H1_PREFIX : H2_PREFIX;
    const depth = containsH1 ? 1 : 2;

    return {
        strippedContent: stripToPrefix(content, prefix),
        depth,
    };
}

/**
 * Remove the content before `headerPrefix`
 */
export function stripToPrefix(content: string, headerPrefix: string): string {
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
        const childContent = stripToPrefix(chunk, childHeaderPrefix);
        return {
            content: chunk,
            depth: depth,
            children: parseNestedChunks(childContent, depth + 1),
        };
    });
}

/**
 * Put the content of the hierarchical structure into a list. The first elements are the smallest root-level elements. The last element is the root element.
 */
export function createContentList(node: Node): string[] {
    if (node.children.length === 0) {
        return [node.content];
    }

    const childContent = node.children.flatMap((child) => {
        return createContentList(child);
    });

    return [...childContent, node.content];
}
