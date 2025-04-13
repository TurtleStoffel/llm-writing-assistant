const MODEL = "llama3.2";

export async function generateResponse(prompt: string): Promise<string> {
    const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        body: JSON.stringify({
            model: MODEL,
            prompt,
            stream: false,
        }),
    });

    const content = await response.text();
    const parsedContent = JSON.parse(content);

    console.log("---CHUNK RESULT---");
    console.log("---ORIGINAL TEXT---");
    console.log(prompt);

    console.log("---RESPONSE---");
    console.log(parsedContent.response);
    console.log("---CHUNK RESULT END---\n\n");

    return parsedContent.response;
}
