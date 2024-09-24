import {onRequest} from "firebase-functions/v2/https";
import * as app from "firebase-admin";
import {response} from "./types/types";
import collections from "./json/collections.json";
import {DocumentData} from "firebase-admin/firestore";
import {getBoundary} from "parse-multipart";
import parseFormData from "./helper/parse-form-data";

export const updateCollection = onRequest(async (request, response):
Promise<any> => {
  const data: response = {
    status: 0,
    valid: false,
    message: "An error occurred",
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
  const userId: string = newData.userId;
  const collection: string = newData.collection;
  const documentData = JSON.parse(newData.documentData);

  // Validate the collection name.
  if (collections.includes(collection) === false) {
    data.valid = false;
    data.message = "Invalid query request";
    data.status = 400;
    response.status(data.status).json(data);
    return;
  }

  const batch = app.firestore().batch();
  const docRef = app.firestore().collection("users").doc(userId)
    .collection(collection);
  const querySnapshot = await docRef.get();
  const documentSnapshot = querySnapshot.docs;

  // Loop through all documents and the desired data to update.
  documentSnapshot.forEach((doc: DocumentData) => {
    if (documentData[doc.id] === undefined) return;

    const docRef = doc.ref;
    batch.set(docRef, documentData[doc.id]);
  });

  await batch.commit()
    .then(() => {
      data.valid = true;
      data.message = "Data updated successfully";
      data.status = 200;
      response.status(data.status).json(data);
    })
    .catch(() => {
      data.valid = false;
      data.message = "An error occurred";
      data.status = 400;
      response.status(data.status).json(data);
    });
});
