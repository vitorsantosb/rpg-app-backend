import app from "./app";
import * as http from "node:http";
import dotenv from 'dotenv';
dotenv.config();

import {DebugLogMessage} from "@configs/logs/logMessages";
import {SetupWebSocket} from '@socket/websocket';
import {sdk} from '@configs/metrics/opentelemetry/instrumentation';

async function StartHTTPServer(): Promise<void> {
  const port: number = parseInt(process.env.APP_PORT as string, 10) || 5000;
  const server: http.Server = http.createServer(app);

  const io = SetupWebSocket(server);

  return new Promise((resolve) => {
    server.listen(port, () => {
      DebugLogMessage('[SERVER]', 'routes is now enabled on port: ' + port);
      resolve();
    });
  });
}


async function init() {
  try {
    //sdk.start();
    await StartHTTPServer();
  } catch (error) {
    console.error("Error during initialization", error);
    process.exit(1);
  }
}

init().catch(err => console.error(err));
