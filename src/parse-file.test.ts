import { assertEquals } from "@std/assert/equals";
import {
    getChildContent,
    parseChunks,
    parseNestedChunks,
    stripPreContent,
} from "./parse-file.ts";

Deno.test(function chunksAreCorrectlyParsed() {
    const content = `# Title 1
## Subtitle 1
This is some content.
## Subtitle 2
This is some more content.`;

    const result = parseChunks(content);
    assertEquals(result, [
        "# Title 1",
        "## Subtitle 1\nThis is some content.",
        "## Subtitle 2\nThis is some more content.",
    ]);
});

Deno.test(function parseNestedChunksReturnsNestedChunks() {
    const content = `# Title 1
## Subtitle 1
This is some content.
## Subtitle 2
This is some more content.`;

    const result = parseNestedChunks(content, 0);
    assertEquals(result.content, content);
    assertEquals(result.children.length, 2);
    assertEquals(result.depth, 0);

    const firstChild = result.children[0];
    assertEquals(
        firstChild.content,
        "## Subtitle 1\nThis is some content.",
    );
    assertEquals(firstChild.children.length, 0);
    assertEquals(firstChild.depth, 1);

    const secondChild = result.children[1];
    assertEquals(
        secondChild.content,
        "## Subtitle 2\nThis is some more content.",
    );
    assertEquals(secondChild.children.length, 0);
    assertEquals(secondChild.depth, 1);
});

Deno.test(function getChildContentReturnsCorrectChildContent() {
    const content = `# Title 1
## Subtitle 1
This is some content.
## Subtitle 2
This is some more content.`;

    const result = getChildContent(content);

    assertEquals(
        result,
        "## Subtitle 1\nThis is some content.\n## Subtitle 2\nThis is some more content.",
    );
});

Deno.test(function getChildContentReturnsCorrectChildContent() {
    const content = `some pre-content content
# Title 1
## Subtitle 1
This is some content.
## Subtitle 2
This is some more content.`;

    const result = getChildContent(content);

    assertEquals(
        result,
        "## Subtitle 1\nThis is some content.\n## Subtitle 2\nThis is some more content.",
    );
});

Deno.test(function stripPreContentRemovesContentBeforeFirstTitle() {
    const content = `some pre-content content
# Title 1
## Subtitle 1
This is some content.
## Subtitle 2
This is some more content.`;

    const result = stripPreContent(content);

    assertEquals(
        result,
        "# Title 1\n## Subtitle 1\nThis is some content.\n## Subtitle 2\nThis is some more content.",
    );
});
