/**
 * Extracts the boundary string from a multipart/form-data content type.
 *
 * @param {string} contentType The content type string.
 * @return {string} The boundary string, or null if not found.
 */
export default function getBoundary(contentType: string): string | null {
  const boundaryMatch = contentType.match(/boundary=(.*)$/);
  if (boundaryMatch && boundaryMatch[1]) {
    return boundaryMatch[1];
  }
  return null;
}
