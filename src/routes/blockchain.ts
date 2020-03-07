import { Router } from "express";
import BlockchainController from "../controllers/BlockchainController";

    const router = Router();

    //getBlockChain/
    router.get("/blocks", BlockchainController.getBlockChain);
    //getBlockHash/
    router.get("/block/:hash", BlockchainController.getBlockHash);
    //getTransaction/ 
    router.get("/transaction/:id", BlockchainController.getTransaction);
    //unspentTxOuts/
    router.get("/address/:address", BlockchainController.unspentTxOuts);
    //getUnspentTxOuts/
    router.get("/unspentTransactionOutputs", BlockchainController.getUnspentTxOuts);
    //getMyUnspentTxOutputs/
    router.get("/myUnspentTransactionOutputs", BlockchainController.getMyUnspentTxOutputs);
    //generateMineRawBlock/
    router.post("/mineRawBlock", BlockchainController.generateMineRawBlock);
    //generateNextBlock/
    router.post("/mineBlock", BlockchainController.generateNextBlock);
    //getBalance/
    router.get("/balance", BlockchainController.getBalance);
    //getAdressFromWallet/
    router.get("/address", BlockchainController.getAdressFromWallet);
    //createMineTransaction/
    router.post("/mineTransaction", BlockchainController.createMineTransaction);
    //sendTransaction
    router.post("/sendTransaction", BlockchainController.sendTransaction);
    //getTransactionPool
    router.get("/transactionPool", BlockchainController.getTransactionPool);
    //getPeers
    router.get("/peers", BlockchainController.getPeers);
    //storePeer
    router.post("/addPeer", BlockchainController.storePeer);
    //stopServer
    router.post("/stop", BlockchainController.storePeer);

    export default router;
