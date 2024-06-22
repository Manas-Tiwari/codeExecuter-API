import { exec } from "child_process";

import User from "./user.schema.js";


/**
 * Get all registered Users.
 * @param  {Object}  req  Express request Object.
 * @param  {Object}  res  Express response Object.
 * @return {Object}       All Usernames.
 * 
 */
export const getAllUsers = async (req, res) => {
  const users = await User.find({ });
  const usernames_list = [];
  for (let {username, email, results, createdAt} of users) {
    usernames_list.push({username, email, results, createdAt});
  }
  res.send({ Users: usernames_list });
};

/**
 * Get User information.
 * @param  {Object}  req  Express request Object.
 * @param  {Object}  res  Express response Object.
 * @return {Object}       User account info.
 * 
 */
export const getUser = async (req, res) => {
  if (req.params.username != req.user.username) {
    res.sendStatus(401);
  }
  const user = await User.findOne({ username: req.params.username });
  res.send({ user, req_user: req.user });
};


/**
 * Submit and Execute user submitted code.
 * @param  {Object}  req  Express request Object.
 * @param  {Object}  res  Express response Object.
 * @param  {Object}  req.body  Should contain the `language` and `code` in the request body.
 * @return {Object}       code output and/or result.
 * 
 */
export const submitCodeAndExecute = async (req, res) => {
  let { language, code } = req.body;

  let command;
  switch (language) {
    case "python":
      command = "python -c ";
      break;
    case "javascript":
      command = "node -e ";
      break;
    case "java":
      command = "java ";
      code = code; // java has additional complication due to the class name and file name, so it's kept as it is
      break;
    default:
      return res.status(400).send({
        msg: "Language not supported, only supports python, javascript and java. Support for C/C++ will be added soon!",
      });
  }
  exec(
    `${command} "${code}"`,
    { timeout: 500 },
    async (err, stdout, stderr) => {
      let e = null;
      if (err) {
        // Some error occurred
        console.error({ err });
        e = stderr;
      }
      const user = await User.findOne({ email: req.user.email });
      user.results.push({ language, code, stdout, stderr: e });
      await user.save();
      res.send({ stdout, e });
    }
  );
};


/**
 * Get user submission history.
 * @param  {Object}  req  Express request Object.
 * @param  {Object}  res  Express response Object.
 * @return {Object}       users submission history w/ statuscode 200 if there is node error.
 * 
 */
export const getSubmissions = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    res.status(200).send({ submissions: user.results });
  } catch (e) {
    console.log("Error retreiving requested details.", e);
    res.status(500).send({ error: e });
  }
};


/**
 * Get all registered Users.
 * @param  {Object}  req  Express request Object.
 * @param  {Object}  res  Express response Object.
 * @return {Object}       Deletes given user.
 * 
 */
export const deleteUser = async (req, res) => {
  if (req.params.username != req.user.username) {
    res.sendStatus(401);
  }
  const user = await User.deleteOne({ username: req.params.username });
  res.send({ user, req_user: req.user, msg: "User deleted successfully" });
};