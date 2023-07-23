import { Router } from "express";
import {
  getUser,
  submitCodeAndExecute,
  getSubmissions
} from "./user.controller.js";

const user = Router();

user.get('/submissions', getSubmissions);
user.get("/:username", getUser);
user.post("/code", submitCodeAndExecute);

export default user;
