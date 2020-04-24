import { Transaction } from '../models/transaction';
let id = 1;

export default [
    new Transaction(id++, 825, 'Rent Bill', 1),
    new Transaction(id++, 216.12, 'Electric Bill', 1),
    new Transaction(id++, 64.45, 'Debit Transaction', 1),
    new Transaction(id++, 1250, 'Rent Bill', 2),
    new Transaction(id++, 415.12, 'Electric Bill', 2),
    new Transaction(id++, 561.10, 'Debit Transaction', 2),
    new Transaction(id++, 975, 'Rent Bill', 3),
    new Transaction(id++, 323.56, 'Electric Bill', 3),
    new Transaction(id++, 112.48, 'Debit Transaction', 3),
    new Transaction(id++, 700, 'Rent Bill', 5),
    new Transaction(id++, 113.57, 'Electric Bill', 5),
    new Transaction(id++, 84.25, 'Debit Transaction', 5),
];