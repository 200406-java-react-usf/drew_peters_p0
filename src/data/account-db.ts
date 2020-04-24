import { Account } from '../models/account';
let id = 1;

export default [
    new Account(id++, 14233, 'Savings', 1),
    new Account(id++, 1736, 'Checking', 1),
    new Account(id++, 6523, 'Checking', 2),
    new Account(id++, 1235, 'Savings', 3),
    new Account(id++, 45641, 'Savings', 5),
    new Account(id++, 526, 'Checking', 3),
    new Account(id++, 341, 'Checking', 5),
    new Account(id++, 57461, 'Savings', 2)
];