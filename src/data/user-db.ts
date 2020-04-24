import { User } from '../models/user';
let id = 1;

export default [
    new User(id++, 'aanderson', 'password', 'Alice', 'Anderson', 'client'),
    new User(id++, 'bbailey', 'password', 'Bob', 'Bailey', 'client'),
    new User(id++, 'ccountryman', 'password', 'Charlie', 'Countryman', 'client'),
    new User(id++, 'ddavis', 'password', 'Daniel', 'Davis', 'admin'),
    new User(id++, 'eeinstein', 'password', 'Emily', 'Einstein', 'client')
];