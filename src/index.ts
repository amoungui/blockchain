import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as helmet from "helmet";
import * as cors from "cors";
import {initP2PServer} from '../src/entity/blockchain/p2p';
import {initWallet} from '../src/entity/blockchain/wallet';
import routes from "./routes";

const httpPort: number = parseInt(process.env.HTTP_PORT) || 3000;
const p2pPort: number = parseInt(process.env.P2P_PORT) || 6001;

//Connects to the Database -> then starts the express
createConnection()
  .then(async connection => {

    // Create a new express application instance
    const app = express();

    //error message
    app.use((err, req, res, next) => {
      if (err) {
          res.status(400).send(err.message);
      }
    });
    
    // Call midlewares
    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.json());

    //Set all routes from routes folder
    app.use("/", routes);

    app.listen(httpPort, () => {
      console.log("Server started on port "+ httpPort);
    });
  })
  .catch(error => console.log(error));
  
  initP2PServer(p2pPort);
  initWallet();