import express, { response } from 'express';
import { Transaction } from '../models/transaction';
import{ TransactionRepository } from '../repos/tranaction-repo';

export const TransactionRouter = express.Router();

const transactionRepo = TransactionRepository.getInstance();

TransactionRouter.get('/', async(req, resp) => {
    try{
        let payload = await transactionRepo.getAll();
        resp.status(200).json(payload).send();
    } catch (e) {
        resp.status(404).json(e).send();   //will create dto
    }
});

TransactionRouter.get('/:id', async (req, resp)=> {
    const id = +req.param.id; //the plus sign is to type coerce id into a number
    try {
        let payload = await transactionRepo.getById(id);
        response.status(200).json(payload).send();
    } catch (e) {
        resp.status(404).json(e).send();
    }
});