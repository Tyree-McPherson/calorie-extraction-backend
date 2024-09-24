/**
 * Validates an email address to make sure it is in the correct format and does
 * not exceed the maximum length of 40 characters.
 * @param {string} email The email address to be validated.
 * @return {Object} An object with the following properties: valid, value, and
 * errorMessage. The valid property will be true or false,
 * depending on whether the email is valid or not. The value property will be
 * the email address that was passed in. The errorMessage property
 * will be a string that describes the error with the email address, or an empty
 * string if the email is valid.
 */
export default function validateEmail(email: string) {
  // eslint-disable-next-line max-len
  const symbolsEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const emailLengthMaximum = 40;

  const emailLength: number = email.length;
  let emailIsValid: boolean;
  let errorMessage = "";

  if (emailLength === 0) {
    emailIsValid = false;
    errorMessage = "Email cannot be empty";
  } else if (emailLength > emailLengthMaximum) {
    emailIsValid = false;
    errorMessage = "Email cannot be greater than 40 characters";
  } else if (!symbolsEmail.test(email)) {
    emailIsValid = false;
    errorMessage = "Email is not in the correct format";
  } else {
    emailIsValid = true;
  }

  const emailValidationObject = {
    valid: emailIsValid,
    value: email,
    errorMessage: errorMessage,
  };

  return emailValidationObject;
}
