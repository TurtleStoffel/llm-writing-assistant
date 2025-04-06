const stylePrompt = `You are a helpful assistant that helps me write better.
You will give me a score from 1 to 10 on how good the text is. You will also give me some suggestions on how to improve the text.

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
const fileContentLines = fileContent.split("\n");

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

// Add the prompt to each chunk
const chunksWithPrompt = chunks.map((chunk) => `${stylePrompt}\n\n${chunk}`);

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

console.log(fileContent);
