import {onRequest} from "firebase-functions/v2/https";
import * as app from "firebase-admin";
import {response} from "./types/types";
import collections from "./json/collections.json";
import {QuerySnapshot} from "firebase-admin/firestore";
import parseFormData from "./helper/parse-form-data";
import {getBoundary} from "parse-multipart";

export const getCollection = onRequest(async (request, response):
Promise<any> => {
  const data: response = {
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
  const userId: string = newData.userId;
  const collection: string = newData.collection;

  // Validate the collection name.
  if (collections.includes(collection) === false) {
    data.valid = false;
    data.message = "Invalid query request";
    data.status = 400;
    response.status(data.status).json(data);
    return;
  }

  const docRef = app.firestore().collection("users").doc(userId)
    .collection(collection);

  await docRef.get()
    .then((doc: QuerySnapshot) => {
      if (!doc.empty) {
        // Get the data from all documents.
        const docData: any = {};

        // Iterate over each document and add it to the docData object.
        doc.docs.forEach((doc: any) => docData[doc.id] = doc.data());
        data.valid = true;
        data.message = "Data retrieved successfully";
        data.status = 200;
        data.json = docData;
        response.status(data.status).json(data);
      }
    })
    .catch(() => {
      data.valid = false;
      data.message = "An error occurred";
      data.status = 400;
      data.json = null;
      response.status(data.status).json(data);
    });
});
