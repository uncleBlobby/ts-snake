import { Socket } from "dgram";
import express, { Request, Response, NextFunction } from "express"

import { WebSocketServer } from "ws";
import { GameState } from "./types";

let data: GameState;
export interface BattlesnakeHandlers {
  info: Function;
  start: Function;
  move: Function;
  end: Function;
}

export default function runServer(handlers: BattlesnakeHandlers) {
  const app = express();

  const wsServer = new WebSocketServer({ noServer: true });
  wsServer.on('connection', socket => {
    socket.on('message', message => console.log(`wsServer message: ${message}`));
    socket.send(`here's some shit for the browser: ${JSON.stringify(data)}`);
  })
  app.use(express.json());



  app.get("/", (req: Request, res: Response) => {
    res.send(handlers.info());
  });

  app.post("/start", (req: Request, res: Response) => {
    handlers.start(req.body);
    res.send("ok");
  });

  app.post("/move", (req: Request, res: Response) => {
    data = req.body;
    wsServer.on('connection', socket => {
      socket.send(`${Date.now()}: ${JSON.stringify(req.body.turn)}`);
    })
    //req.get({url: `http://${host}:${port}/browserView`, headers: req.headers})
    res.send(handlers.move(req.body));
    //res.redirect('/browserView');
  });

  app.post("/end", (req: Request, res: Response) => {
    handlers.end(req.body);
    res.send("ok");
  });

  app.get("/browserView", (req: Request, res: Response) => {
    res.send(data);
    //res.send("Hello, browserView!")
  })

  app.use(function(req: Request, res: Response, next: NextFunction) {
    res.set("Server", "battlesnake/github/starter-snake-typescript");
    next();
  });

  const host = '0.0.0.0';
  const port = parseInt(process.env.PORT || '8000');

  const server = app.listen(port, host, () => {
    console.log(`Running Battlesnake at http://${host}:${port}...`);
  });

  server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => {
      wsServer.emit('connection', socket, request);
    })
  })
}
