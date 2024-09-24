import {getCollection} from "./get-collection";
import {signup} from "./signup";
import {initializeApp} from "firebase-admin/app";
import {updateCollection} from "./update-collection";

initializeApp();

exports.signup = signup;
exports.getCollection = getCollection;
exports.updateCollection = updateCollection;
