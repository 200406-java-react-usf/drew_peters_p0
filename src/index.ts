import express from 'express';
import bodyparser from 'body-parser';

import { UserRouter } from './router/user-router';
import { AccountRouter } from './router/account-router';

const app = express();

app.use('/', bodyparser.json());

app.use('/users', UserRouter);
app.use('/accounts', AccountRouter);
// app.use('/transactions', TransactionRouter);


app.listen(8080, () => {
    console.log(`Application runnign and listenting at http://localhost:8080/`)
});