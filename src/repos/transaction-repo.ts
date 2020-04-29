import data from '../data/transaction-db';
import { Transaction } from '../models/transaction';
import { CrudRepository } from './crud-repo';
import {
    NotImplementedError, 
    ResourceNotFoundError, 
    ResourcePersistenceError
} from '../errors/errors';

export class TransactionRepository implements CrudRepository<Transaction> {

    getAll(): Promise<Transaction[]> {

        return new Promise<Transaction[]>((resolve) => {

            setTimeout(() => {
                let transactions: Transaction[] = data;
                resolve(transactions);
            }, 250);

        });
    
    }

    getById(id: number): Promise<Transaction> {

        return new Promise<Transaction>((resolve) => {

            setTimeout(() => {
                const transaction = {...data.find(transaction => transaction.id === id)};
                resolve(transaction);
            }, 250);

        });
    }

    getTransactionByUniqueKey(key: string, val: string): Promise<Transaction> {

        return new Promise<Transaction>((resolve, reject) => {
           
            setTimeout(() => {
                const transaction = {...data.find(transaction => transaction[key] === val)};
                resolve(transaction);
            }, 250);

        });
        
    
    }

    save(newTransaction: Transaction): Promise<Transaction> {
            
        return new Promise<Transaction>((resolve, reject) => {
        
            setTimeout(() => { 
                newTransaction.id = (data.length) + 1;
                data.push(newTransaction);
                resolve(newTransaction);
            });

        });
    
    }

    update(updatedTransaction: Transaction): Promise<boolean> {
        
        return new Promise<boolean>((resolve, reject) => {
        
            setTimeout(() => {
        
                let persistedTransaction = data.find(transaction => transaction.id === updatedTransaction.id);
        
                if (!persistedTransaction) {
                    reject(new ResourceNotFoundError('No transaction found with provided id.'));
                    return;
                }
        
                const conflict = data.find(transaction => {
                    if (transaction.id == updatedTransaction.id) return false;
                    return transaction.id == updatedTransaction.id; 
                });
        
                if (conflict) {
                    reject(new ResourcePersistenceError('Provided id is used by another transaction.'));
                    return;
                }
    
                persistedTransaction = updatedTransaction;
    
                resolve(true);
        
            });

        });
    
    }

    deleteById(id: number): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {
            reject(new NotImplementedError());
        });
    }

}