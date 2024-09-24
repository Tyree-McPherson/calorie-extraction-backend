import {onRequest} from "firebase-functions/v2/https";
import * as app from "firebase-admin";
import validateEmail from "./helper/validate-email";
import {response as responseType} from "./types/types";
import {getBoundary} from "parse-multipart";
import parseFormData from "./helper/parse-form-data";
import schema from "./schema/firestore.json";

export const signup = onRequest(async (request, response): Promise<any> => {
  const data: responseType = {
    status: 0,
    valid: false,
    message: "An error occurred",
    json: null,
  };

  response.set(
    "Access-Control-Allow-Origin",
    process.env.ORIGIN
  );

  const contentType = request.headers["content-type"] ?? "";

  // Check if the content type is multipart/form-data.
  if (!contentType || !contentType.startsWith("multipart/form-data")) {
    data.message = "Invalid request";

    return response.status(400).json(data);
  }

  const boundary = getBoundary(contentType);
  if (!boundary) {
    data.message = "Invalid request";

    return response.status(400).json(data);
  }

  // Parse form data.
  const newData = parseFormData(request.body, boundary);
  const email = newData.email;
  const password = newData.password;

  // Validate email.
  const isEmailValid = validateEmail(email);
  if (!isEmailValid.valid) {
    data.message = isEmailValid.errorMessage;

    return response.status(400).json(data);
  }

  try {
    // Create user.
    const userRecord = await app.auth()
      .createUser({email, password, displayName: email});
    const userId = userRecord.uid;

    // Prepare Firestore batch operation.
    const batch = app.firestore().batch();
    schema.forEach((col: any) => {
      col.docNames.forEach((doc: any) => {
        const docCopy = {...doc};
        delete docCopy.name;
        const docRef = app.firestore().collection("users")
          .doc(userId).collection(col.colName).doc(doc.name);
        batch.set(docRef, docCopy);
      });
    });

    // Commit batch.
    await batch.commit();

    // Respond with success.
    data.valid = true;
    data.status = 200;
    data.message = "User created successfully";

    return response.status(200).json(data);
  } catch (error: any) {
    // Handle errors.

    if (error.code === "auth/email-already-exists") {
      data.message = "Email already exists.";
    } else {
      data.message = error.message;
    }

    return response.status(400).json(data);
  }
});
