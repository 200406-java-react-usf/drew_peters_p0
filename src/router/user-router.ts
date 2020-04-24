// import express, { response } from 'express';
// import { User } from '../models/user';
// import{ UserRespository } from '../repos/user-repo';

// export const UserRouter = express.Router();

// const userRepo = UserRespository.getInstance();

// UserRouter.get('/', async(req, resp) => {
//     try{
//         let payload = await userRepo.getAll();
//         resp.status(200).json(payload).send();
//     } catch (e) {
//         resp.status(404).json(e).send();   //will create dto
//     }
// });

// UserRouter.get('/:id', async (req, resp)=> {
//     const id = +req.param.id; //the plus sign is to type coerce id into a number
//     try {
//         let payload = await userRepo.getById(id);
//         response.status(200).json(payload).send();
//     } catch (e) {
//         resp.status(404).json(e).send();
//     }
// });