import data from '../data/transaction-db';
import { Transaction } from '../models/transaction';
import { CrudRepository } from './crud-repo';
import Validator from '../util/validator';
import {   
    BadRequestError, 
    NotImplementedError, 
    ResourceNotFoundError, 
    ResourcePersistenceError
} from '../errors/errors';

export class TransactionRepository implements CrudRepository<Transaction> {

    private static instance: TransactionRepository;

    private constructor() {}

    static getInstance() {
        return !TransactionRepository.instance ? TransactionRepository.instance = new TransactionRepository() : TransactionRepository.instance;
    }

    getAll(): Promise<Transaction[]> {

        return new Promise<Transaction[]>((resolve, reject) => {

            setTimeout(() => {
            
                let transactions = [];
    
                for (let transaction of data) {
                    transactions.push({...transaction});
                }
        
                if (transactions.length == 0) {
                    reject(new ResourceNotFoundError());
                    return;
                }
        
                resolve;
        
            }, 250);

        });
    
    }

    getById(id: number): Promise<Transaction> {
        return new Promise<Transaction>((resolve, reject) => {
            
            if (!Validator.isValidId(id)) {
                reject(new BadRequestError());
            }

            setTimeout(() => {
                
                const transaction = {...data.find(transaction => transaction.id === id)};

                if(Object.keys(transaction).length === 0) {
                    reject(new ResourceNotFoundError());
                    return;
                }

                resolve;

            }, 250);

        });
    }

    // getUserByUsername(un: string): Promise<Transaction> {

    //     return new Promise<User>((resolve, reject) => {

    //         if (!Validator.isValidStrings(un)) {
    //             reject(new BadRequestError());
    //             return;
    //         }
           
    //         setTimeout(() => {
        
    //             const user = {...data.filter(user => user.username === un)[0]};
                
    //             if (Object.keys(user).length == 0) {
    //                 reject(new ResourceNotFoundError());
    //                 return;
    //             }
        
    //             resolve(this.removePassword(user));
        
    //         }, 250);

    //     });
        
    
    // }

    // getUserByCredentials(un: string, pw: string) {
        
    //     return new Promise<User>((resolve, reject) => {

    //         if (!Validator.isValidStrings(un, pw)) {
    //             reject(new BadRequestError());
    //             return;
    //         }
        
    //         setTimeout(() => {
        
    //             const user = {...data.filter(user => user.username === un && user.password === pw).pop()!};
                
    //             if (Object.keys(user).length === 0) {
    //                 reject(new AuthenticationError('Bad credentials provided.'));
    //                 return;
    //             }
                
    //             resolve(this.removePassword(user));
        
    //         }, 250);

    //     });
    
    // }

    save(newTransaction: Transaction): Promise<Transaction> {
            
        return new Promise<Transaction>((resolve, reject) => {
        
            if (!Validator.isValidObject(newTransaction, 'id')) {
                reject(new BadRequestError('Invalid property values found in provided transaction.'));
                return;
            }
        
            setTimeout(() => {
        
                let conflict = data.filter(transaction => transaction.id == newTransaction.id).pop();
        
                if (conflict) {
                    reject(new ResourcePersistenceError('The provided transaction id is already taken.'));
                    return;
                }
        
        
                newTransaction.id = (data.length) + 1;
                data.push(newTransaction);
        
                resolve;
        
            });

        });
    
    }

    update(updatedTransaction: Transaction): Promise<boolean> {
        
        return new Promise<boolean>((resolve, reject) => {

            let validObj = Validator.isValidObject(updatedTransaction);
            let validId = Validator.isValidId(updatedTransaction.id);
            if (!validObj || !validId) {
                reject(new BadRequestError('Invalid transaction provided (invalid values found).'));
                return;
            }
        
            setTimeout(() => {
        
                let persistedTransaction = data.find(transaction => transaction.id === updatedTransaction.id);
        
                if (!persistedTransaction) {
                    reject(new ResourceNotFoundError('No transaction found with provided id.'));
                    return;
                }
                
                if (persistedTransaction.id != updatedTransaction.id) {
                    reject(new ResourcePersistenceError('Transactions cannot be updated.'));
                    return;
                }
    
                persistedTransaction = updatedTransaction;
    
                resolve(true);
        
            });

        });
    
    }

    deleteById(id: number): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {
            
            if (!Validator.isValidId(id)) {
                reject(new BadRequestError());
            }

            reject(new NotImplementedError());

            resolve;
        });
    }
}
