import { createContentList, parseRoot } from "./src/parse-hierarchical.ts";
import { generateResponse, prependWithPrompt } from "./src/llm.ts";
import { findMarkdownFilesInFolder } from "./src/file-system.ts";

const CONTENT_FOLDER = "/Users/stefan.wauters/coding/personal/blog/content/";

const paths = await findMarkdownFilesInFolder(CONTENT_FOLDER);

// Continuously select a random new file to create suggestions for
while (true) {
    const filename = paths[Math.floor(Math.random() * paths.length)];

    console.log(`---Generating suggestions for ${filename}---`);

    const fileContent = await Deno.readTextFile(filename);

    const root = parseRoot(fileContent);
    const chunks = createContentList(root);

    // Add the prompt to each chunk
    const chunksWithPrompt = chunks.map(prependWithPrompt);

    const randomChunkIndex = Math.floor(
        Math.random() * chunksWithPrompt.length,
    );

    //for (let i = 0; i < chunksWithPrompt.length; i++) {
    const chunkWithPrompt = chunksWithPrompt[randomChunkIndex];
    //const result = generateResponse(chunkWithPrompt);
    await generateResponse(chunkWithPrompt);

    /*
    // replace the chunk in the original file with the new chunk
    const chunk = chunks[randomChunkIndex];
    const chunkWithSuggestion = `${chunk}

<!--SUGGESTION
${result}
-->`;
    const newFileContent = fileContent.replace(chunk, chunkWithSuggestion);
    await Deno.writeTextFile(filename, newFileContent);
    */

    /*
        const continueOrSkip = prompt(
            "Continue to next chunk (Enter) or to next file (n):",
        );
        if (continueOrSkip === "n") {
            break;
        }
        */
    //}

    console.log(`---Moving on to next file---\n\n\n`);
}
