export const Pattern = {
  // Minimum eight characters, at least one uppercase letter, one lowercase letter and one number
  // PASSWORD: /(?=^.{8,}$)(?=.*\d)(?=.*\W+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
  PASSWORD: /(?=^.{8,}$)(?=.*\d)(?=.*\W+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
  // Minimum 10 characters
  PHONE_NUM: /[0-9]{10,}/,
  //only lowercase and uppercase letters
  FULL_NAME: /^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF ]+$/,
  //get email address from url
  GET_EMAIL: /([a-zA-Z0-9._-]+@([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+)(?=\?secret)(.*?)/g,
  //start with a word only
  USERNAME: /^[a-zA-Z]+[a-zA-Z0-9\-_.]*$/g,
  //only 6 numbers
  OTP: /^[0-9]{6}$/g
};
