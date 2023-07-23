import http from 'http';
import 'dotenv/config';

import app from './app.js'
import "./src/db.connection.js";

const PORT = process.env.PORT;

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`[+] listning on port: ${PORT}...`);
});