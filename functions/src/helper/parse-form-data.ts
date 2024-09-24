
/**
 * Converts a multipart/form-data buffer to an object of key-value pairs.
 *
 * @param {Buffer} buffer The Buffer object of the multipart/form-data request
 *   body.
 * @param {string} boundary The boundary string used in the multipart/form-data
 *   request body.
 * @return {Record<string, string>} Record<string, string> An object of
 * key-value pairs, where each key is a form field name,
 * and each value is the value of that form field.
 */
export default function parseFormData(
  buffer: Buffer,
  boundary: string
): Record<string, string> {
  const formData: Record<string, string> = {};

  // Convert the buffer to a string
  const rawData = buffer.toString();

  // Split the string by the boundary
  const parts = rawData.split(`--${boundary}`)
    .filter((part) => part.trim() !== "");

  // Loop through each part and extract the form data
  parts.forEach((part) => {
    const trimmedPart = part.trim();
    if (trimmedPart.includes("Content-Disposition: form-data")) {
      // Extract the key from the Content-Disposition header
      const keyMatch = trimmedPart.match(/name="([^"]+)"/);

      if (keyMatch && keyMatch[1]) {
        const key = keyMatch[1];

        // Extract the value (after the headers)
        const value = trimmedPart.split("\r\n\r\n")[1]?.trim();

        // Store the key-value pair in the formData object
        if (value) {
          formData[key] = value;
        }
      }
    }
  });

  return formData;
}
