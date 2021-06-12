export function parseFilename(filename) {
  const periodPos = filename.lastIndexOf('.');
  const extension = filename.substring(periodPos + 1, filename.length);
  const basename = filename.substring(0, Math.min(30, periodPos));
  return { basename, extension };
}

export function abbreviateFilename(filename, maxSize) {
  if (filename.length <= maxSize) {
    return filename;
  }
  const parsed = parseFilename(filename);
  return `${parsed.basename.substring(0, maxSize)}...${parsed.extension}`;
}
