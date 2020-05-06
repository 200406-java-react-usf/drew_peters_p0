import url from 'url';
import express from 'express';
import AppConfig from '../config/app';
import { isEmptyObject } from '../util/validator';
import { ParsedUrlQuery } from 'querystring';
import { adminGuard } from '../middleware/auth-middleware';

export const TransactionRouter = express.Router();

const transactionService = AppConfig.transactionService;

TransactionRouter.get('', adminGuard, async (req, resp) => {

    try {

        let reqURL = url.parse(req.url, true);

        if(!isEmptyObject<ParsedUrlQuery>(reqURL.query)) {
            let payload = await transactionService.getTransactionByUniqueKey({...reqURL.query});
            resp.status(200).json(payload);
        } else {
            let payload = await transactionService.getAllTransactions();
            resp.status(200).json(payload);
        }

    } catch (e) {
        resp.status(e.statusCode).json(e);
    }

});

TransactionRouter.get('/:id', adminGuard, async (req, resp) => {
    const id = +req.params.id;
    try {
        let payload = await transactionService.getTransactionById(id);
        return resp.status(200).json(payload);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});

TransactionRouter.post('', async (req, resp) => {

    console.log('POST REQUEST RECEIVED AT /transactions');
    console.log(req.body);
    try {
        let newTransaction = await transactionService.addNewTransaction(req.body);
        return resp.status(201).json(newTransaction);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }

});

TransactionRouter.put('', async (req,resp) => {
    
    console.log('PUT REQUEST RECEIVED AT /transactions');
    console.log(req.body);
    try {
        let updatedTransaction = await transactionService.updateTransaction(req.body);
        return resp.status(202).json(updatedTransaction);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});

TransactionRouter.delete('', adminGuard, async (req,resp) => {
    try {
        let deletedTransaction = await transactionService.deleteTransaction(req.body);
        return resp.status(202).json(deletedTransaction);
    } catch (e) {
        return resp.status(e.statusCode || 500).json(e);
    }
});