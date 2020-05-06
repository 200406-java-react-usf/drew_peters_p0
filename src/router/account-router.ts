import url from 'url';
import express from 'express';
import AppConfig from '../config/app';
import { isEmptyObject } from '../util/validator';
import { ParsedUrlQuery } from 'querystring';
import { adminGuard } from '../middleware/auth-middleware';

export const AccountRouter = express.Router();

const accountService = AppConfig.accountService;

AccountRouter.get('', adminGuard, async (req, resp) => {

    try {

        let reqURL = url.parse(req.url, true);

        if(!isEmptyObject<ParsedUrlQuery>(reqURL.query)) {
            let payload = await accountService.getAccountByUniqueKey({...reqURL.query});
            resp.status(200).json(payload);
        } else {
            let payload = await accountService.getAllAccounts();
            resp.status(200).json(payload);
        }

    } catch (e) {
        resp.status(e.statusCode).json(e);
    }

    resp.send();

});

AccountRouter.get('/:id', async (req, resp) => {
    const id = +req.params.id;
    try {
        let payload = await accountService.getAccountById(id);
        resp.status(200).json(payload);
    } catch (e) {
        resp.status(e.statusCode).json(e);
    }
});

AccountRouter.post('', async (req, resp) => {

    console.log('POST REQUEST RECEIVED AT /accounts');
    console.log(req.body);
    try {
        let newAccount = await accountService.addNewAccount(req.body);
        resp.status(201).json(newAccount);
    } catch (e) {
        resp.status(e.statusCode).json(e);
    }

});

AccountRouter.put('', async (req,resp) => {
    
    console.log('PUT REQUEST RECEIVED AT /accounts');
    console.log(req.body);
    try {
        let updatedAccount = await accountService.updateAccount(req.body);
        return resp.status(202).json(updatedAccount);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});

AccountRouter.delete('', adminGuard, async (req,resp) => {
    try {
        let deletedAccount = await accountService.deleteAccount(req.body);
        return resp.status(202).json(deletedAccount);
    } catch (e) {
        return resp.status(e.statusCode || 500).json(e);
    }
});