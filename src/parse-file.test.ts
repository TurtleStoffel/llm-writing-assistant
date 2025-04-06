import { assertEquals } from "@std/assert/equals";
import { parseChunks } from "./parse-file.ts";

Deno.test(function chunksAreCorrectlyParsed() {
    const content = `# Title 1
## Subtitle 1
This is some content.
## Subtitle 2
This is some more content.`;

    const result = parseChunks(content);
    console.log(result);
    assertEquals(result, [
        "# Title 1",
        "## Subtitle 1\nThis is some content.",
        "## Subtitle 2\nThis is some more content.",
    ]);
});
