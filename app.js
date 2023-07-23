import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { fileURLToPath } from "url";
import { dirname, join } from "path";

import { signup, login, protect } from './src/auth.js';
import user from "./src/user.router.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// static templates
app.set("view engine", "hbs");
app.set("views", join(dirname(fileURLToPath(import.meta.url)), "views"));

// serve public folder
app.use(
  "/public",
  express.static(join(dirname(fileURLToPath(import.meta.url)), "public"))
);


app.post('/signup', signup);
app.post('/login', login);

app.use('/api', protect);
app.use('/api/user', user);


app.use((req, res) => {
  res.status(400).json({"msg" : "Resource not found!"});
})

export default app;


