import { assertEquals } from "@std/assert/equals";
import { createContentList, parseRoot } from "./parse-hierarchical.ts";

Deno.test(function parseRootParsesHierarchyStartingWithH1() {
    const content = `pre-content
# Title 1
Content 1
## Title 1.1
Content 1.1
### Title 1.1.1
Content 1.1.1
## Title 1.2
Content 1.2
# Title 2
Content 2
## Title 2.1
Content 2.1`;

    const root = parseRoot(content);

    assertEquals(root.content, content);
    assertEquals(root.children.length, 2);
    assertEquals(root.depth, 0);

    const node1 = root.children[0];
    assertEquals(
        node1.content,
        `# Title 1
Content 1
## Title 1.1
Content 1.1
### Title 1.1.1
Content 1.1.1
## Title 1.2
Content 1.2`,
    );
    assertEquals(node1.children.length, 2);
    assertEquals(node1.depth, 1);

    const node2 = root.children[1];
    assertEquals(
        node2.content,
        `# Title 2
Content 2
## Title 2.1
Content 2.1`,
    );
    assertEquals(node2.children.length, 1);
    assertEquals(node2.depth, 1);
});

Deno.test(function parseRootParsesHierarchyStartingWithH2() {
    // Some files define the main header in Front-matter instead of H1
    const content = `---
title: Random Title
---
Content 1
## Title 1.1
Content 1.1
## Title 1.2
Content 1.2`;

    const root = parseRoot(content);

    assertEquals(root.content, content);
    assertEquals(root.children.length, 2);
    assertEquals(root.depth, 0);

    const node1 = root.children[0];
    assertEquals(
        node1.content,
        `## Title 1.1
Content 1.1`,
    );
    assertEquals(node1.children.length, 0);
    assertEquals(node1.depth, 2);

    const node2 = root.children[1];
    assertEquals(
        node2.content,
        `## Title 1.2
Content 1.2`,
    );
    assertEquals(node2.children.length, 0);
    assertEquals(node2.depth, 2);
});

Deno.test(function createContentListReturnsFlatListFromHierarchy() {
    const content = `pre-content
# Title 1
Content 1
## Title 1.1
Content 1.1
### Title 1.1.1
Content 1.1.1
## Title 1.2
Content 1.2
# Title 2
Content 2
## Title 2.1
Content 2.1`;

    const root = parseRoot(content);
    const contentList = createContentList(root);

    assertEquals(contentList.length, 7);
    assertEquals(contentList[contentList.length - 1], content);
    assertEquals(contentList[0], "### Title 1.1.1\nContent 1.1.1");
});
