import { walk } from "@std/fs";

export async function findMarkdownFilesInFolder(
    folder: string,
): Promise<string[]> {
    const paths = [];
    for await (const entry of walk(folder)) {
        if (!entry.isFile) {
            continue;
        }

        // Ignore files that are not markdown files
        if (!entry.path.endsWith(".md")) {
            continue;
        }

        paths.push(entry.path);
    }

    return paths;
}
