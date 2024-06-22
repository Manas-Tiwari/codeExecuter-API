import { Router } from "express";
import {
  getUser,
  submitCodeAndExecute,
  getSubmissions,
  deleteUser
} from "./user.controller.js";

const user = Router();

user.get('/submissions', getSubmissions);
user.get("/:username", getUser);
user.delete("/:username", deleteUser);
user.post("/code", submitCodeAndExecute);

export default user;
