import { parseChunks } from "./src/parse-file.ts";
import { createContentList, parseRoot } from "./src/parse-hierarchical.ts";

const stylePrompt = `You are a helpful assistant that helps me write better.
You will give me a score from 1 to 10 on how good the text is. You will also give me some suggestions on how to improve the text.

Respond in the following format:
## Score
<score from 1 to 10>

## Feedback
<feedback on how to improve the text>

## Proposal
<example of the text with the improvements applied>

Use the following guidelines for the written text:
Use clear, direct language and avoid complex terminology.
Aim for a Flesch reading score of 80 or higher.
Use the active voice.
Avoid adverbs.
Avoid buzzwords and instead use plain English.
Use jargon where relevant.
Avoid being salesy or overly enthusiastic and instead express calm confidence.
Prefer full sentences over bullet points unless explicitly requested.
Avoid overusing "I" or "we".
Use singular form when writing about yourself.
Don't use em dashes, hyphens and semicolons.`;

const model = "llama3.2";

const filename =
    "/Users/stefan.wauters/coding/personal/blog/content/private/Writing - Private Notes.md";

const fileContent = await Deno.readTextFile(filename);

const root = parseRoot(fileContent);
const chunks = createContentList(root);
// const chunks = parseChunks(fileContent);

// Add the prompt to each chunk
const chunksWithPrompt = chunks.map((chunk) => `${stylePrompt}\n\n${chunk}`);

for (let i = 0; i < chunksWithPrompt.length; i++) {
    const chunk = chunksWithPrompt[i];
    const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        body: JSON.stringify({
            model,
            prompt: chunk,
            stream: false,
        }),
    });

    const content = await response.text();
    const parsedContent = JSON.parse(content);

    console.log("---CHUNK RESULT---");
    console.log("---ORIGINAL TEXT---");
    console.log(chunk);

    console.log("---RESPONSE---");
    console.log(parsedContent.response);
    console.log("---CHUNK RESULT END---\n\n\n");

    alert("Press enter to continue to next chunk...");
}

/*
chunksWithPrompt.forEach(async (chunk) => {
    const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        body: JSON.stringify({
            model,
            prompt: chunk,
            stream: false,
        }),
    });

    const content = await response.text();
    const parsedContent = JSON.parse(content);

    console.log("---CHUNK RESULT---");
    console.log("---ORIGINAL TEXT---");
    console.log(chunk);

    console.log("---RESPONSE---");
    console.log(parsedContent.response);
    console.log("---CHUNK RESULT END---");
});
*/

console.log(fileContent);
