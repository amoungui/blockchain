import { Request, Response } from "express";
import * as _ from 'lodash';
import {
    Block, generateNextBlock, generatenextBlockWithTransaction, generateRawNextBlock, getAccountBalance,
    getBlockchain, getMyUnspentTransactionOutputs, getUnspentTxOuts, sendTransaction
} from '../entity/blockchain/blockchain';
import {connectToPeers, getSockets} from '../entity/blockchain/p2p';
import {UnspentTxOut} from '../entity/blockchain/transaction';
import {getTransactionPool} from '../entity/blockchain/transactionPool';
import {getPublicFromWallet} from '../entity/blockchain/wallet';

class BlockchainController {

    static getBlockChain = async (req: Request, res: Response) => {
        res.send(getBlockchain());
    };

    static getBlockHash = async (req: Request, res: Response) => {
        const block = _.find(getBlockchain(), {'hash' : req.params.hash});
        res.send(block);        
    };

    static getTransaction = async (req: Request, res: Response) => {
        const tx = _(getBlockchain())
            .map((blocks) => blocks.data)
            .flatten()
            .find({'id': req.params.id});
        res.send(tx);       
    };

    static unspentTxOuts = async (req: Request, res: Response) => {
        const unspentTxOuts: UnspentTxOut[] =
            _.filter(getUnspentTxOuts(), (uTxO) => uTxO.address === req.params.address);
        res.send({'unspentTxOuts': unspentTxOuts});        
    }

    static getUnspentTxOuts = async (req: Request, res: Response) => {
        res.send(getUnspentTxOuts());
    }

    static getMyUnspentTxOutputs = async (req: Request, res: Response) => {
        res.send(getMyUnspentTransactionOutputs());        
    }

    static generateMineRawBlock = async (req: Request, res: Response) => {
        if (req.body.data == null) {
            res.send('data parameter is missing');
            return;
        }
        const newBlock: Block = generateRawNextBlock(req.body.data);
        if (newBlock === null) {
            res.status(400).send('could not generate block');
        } else {
            res.send(newBlock);
        }        
    }

    static generateNextBlock = async (req: Request, res: Response) => {
        const newBlock: Block = generateNextBlock();
        if (newBlock === null) {
            res.status(400).send('could not generate block');
        } else {
            res.send(newBlock);
        }        
    }

    static getBalance = async (req: Request, res: Response) => {
        const balance: number = getAccountBalance();
        res.send({'balance': balance});        
    }

    static getAdressFromWallet = async (req: Request, res: Response) => {
        const address: string = getPublicFromWallet();
        res.send({'address': address});
    }

    static createMineTransaction = async (req: Request, res: Response) => {
        const address = req.body.address;
        const amount = req.body.amount;
        try {
            const resp = generatenextBlockWithTransaction(address, amount);
            res.send(resp);
        } catch (e) {
            console.log(e.message);
            res.status(400).send(e.message);
        }
    }

    static sendTransaction = async (req: Request, res: Response) => {
        try {
            const address = req.body.address;
            const amount = req.body.amount;

            if (address === undefined || amount === undefined) {
                throw Error('invalid address or amount');
            }
            const resp = sendTransaction(address, amount);
            res.send(resp);
        } catch (e) {
            console.log(e.message);
            res.status(400).send(e.message);
        }
    }

    static getTransactionPool = async (req: Request, res: Response) => {
        res.send(getTransactionPool());
    }

    static getPeers = async (req: Request, res: Response) => {
        res.send(getSockets().map((s: any) => s._socket.remoteAddress + ':' + s._socket.remotePort));
    }

    static storePeer = async (req: Request, res: Response) => {
        connectToPeers(req.body.peer);
        res.send();
    }

    static stopServer = async (req: Request, res: Response) => {
        res.send({'msg' : 'stopping server'});
        process.exit();
    }

}
export default BlockchainController;
