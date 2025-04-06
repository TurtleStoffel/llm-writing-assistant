/**
 * Split the file content into chunks split by lines starting with a hashtag
 */
export function parseChunks(content: string): string[] {
  const fileContentLines = content.split("\n");

  // Split the file content into chunks split by lines starting with a hashtag
  const chunks = [];
  let chunkStart = 0;
  for (let i = 0; i < fileContentLines.length; i++) {
    if (fileContentLines[i].startsWith("#")) {
      console.log(fileContentLines[i]);
      if (i > chunkStart) {
        chunks.push(fileContentLines.slice(chunkStart, i).join("\n"));
      }
      chunkStart = i;
    }
  }

  // Add the last chunk
  if (chunkStart < fileContentLines.length) {
    chunks.push(fileContentLines.slice(chunkStart).join("\n"));
  }

  return chunks;
}
