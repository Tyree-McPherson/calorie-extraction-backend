import {getCollection} from "./get-collection";
import {signup} from "./signup";
import {initializeApp} from "firebase-admin/app";
import {updateCollection} from "./update-collection";
import "dotenv/config";
import {config} from "dotenv";

const env = process.env.NODE_ENV || "development";
config({path: `.env.${env}`});

initializeApp();

exports.signup = signup;
exports.getCollection = getCollection;
exports.updateCollection = updateCollection;
