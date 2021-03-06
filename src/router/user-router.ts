import url from 'url';
import express from 'express';
import AppConfig from '../config/app';
import { isEmptyObject } from '../util/validator';
import { ParsedUrlQuery } from 'querystring';
import { adminGuard } from '../middleware/auth-middleware';

export const UserRouter = express.Router();

const userService = AppConfig.userService;

UserRouter.get('', adminGuard, async (req, resp) => {

    try {

        let reqURL = url.parse(req.url, true);

        if(!isEmptyObject<ParsedUrlQuery>(reqURL.query)) {
            let payload = await userService.getUserByUniqueKey({...reqURL.query});
            resp.status(200).json(payload);
        } else {
            let payload = await userService.getAllUsers();
            resp.status(200).json(payload);
        }

    } catch (e) {
        resp.status(e.statusCode).json(e);
    }

});

UserRouter.get('/:id', adminGuard, async (req, resp) => {
    const id = +req.params.id;
    try {
        let payload = await userService.getUserById(id);
        return resp.status(200).json(payload);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});

UserRouter.post('', async (req, resp) => {

    console.log('POST REQUEST RECEIVED AT /users');
    console.log(req.body);
    try {
        let newUser = await userService.addNewUser(req.body);
        return resp.status(201).json(newUser);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }

});

UserRouter.put('', async (req,resp) => {
    
    console.log('PUT REQUEST RECEIVED AT /users');
    console.log(req.body);
    try {
        let updatedUser = await userService.updateUser(req.body);
        return resp.status(202).json(updatedUser);
    } catch (e) {
        return resp.status(e.statusCode).json(e);
    }
});

UserRouter.delete('', adminGuard, async (req,resp) => {
    try {
        let deletedUser = await userService.deleteUser(req.body);
        return resp.status(202).json(deletedUser);
    } catch (e) {
        return resp.status(e.statusCode || 500).json(e);
    }
});