/* eslint-disable @typescript-eslint/no-explicit-any */
import http from "http";
import app from "./app";
import dbCoonect from "@/utils/dbConnect";
import dns from "node:dns/promises";
import config from "@/config";

dns.setServers(["1.1.1.1"]);

const server = http.createServer(app);

const port = config.port || 5050;

async function main() {
  try {
    await dbCoonect();
    server.listen(port, () => {
      console.log(`Example app listening on port http://localhost:${port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();

//asynchronous code error
process.on("unhandledRejection", (err) => {
  console.log(`❤❤ unahandledRejection is detected , shutting down ...`, err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

//synchronous code error--process immediately off
process.on("uncaughtException", (err) => {
  console.log(`😛😛 uncaughtException is detected , shutting down ...`, err);
  process.exit(1);
});
