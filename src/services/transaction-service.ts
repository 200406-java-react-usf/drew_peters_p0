import { Transaction } from "../models/transaction";
import { TransactionRepository } from "../repos/transaction-repo";
import { 
    isValidId, 
    isValidStrings, 
    isValidObject, 
    isPropertyOf, 
    isEmptyObject 
} from "../util/validator";
import { 
    BadRequestError, 
    ResourceNotFoundError, 
    NotImplementedError, 
    ResourcePersistenceError
} from "../errors/errors";


export class TransactionService {

    constructor(private transactionRepo: TransactionRepository) {
        this.transactionRepo = transactionRepo;
    }

    getAllTransactions(): Promise<Transaction[]> {

        return new Promise<Transaction[]>(async (resolve, reject) => {

            let transactions: Transaction[] = [];
            let result = await this.transactionRepo.getAll();

            for (let transaction of result) {
                transactions.push({...transaction});
            }

            if (transactions.length == 0) {
                reject(new ResourceNotFoundError());
                return;
            }

            resolve(transactions);

        });

    }

    getTransactionById(id: number): Promise<Transaction> {

        return new Promise<Transaction>(async (resolve, reject) => {

            if (!isValidId(id)) {
                return reject(new BadRequestError());
            }

            let transaction = {...await this.transactionRepo.getById(id)};

            if (isEmptyObject(transaction)) {
                return reject(new ResourceNotFoundError());
            }

            resolve(transaction);

        });

    }

    getTransactionByUniqueKey(queryObj: any): Promise<Transaction> {

        return new Promise<Transaction>(async (resolve, reject) => {

            // we need to wrap this up in a try/catch in case errors are thrown for our awaits
            try {

                let queryKeys = Object.keys(queryObj);

                if(!queryKeys.every(key => isPropertyOf(key, Transaction))) {
                    return reject(new BadRequestError());
                }

                // we will only support single param searches (for now)
                let key = queryKeys[0];
                let val = queryObj[key];

                // if they are searching for a transaction by id, reuse the logic we already have
                if (key === 'id') {
                    return resolve(await this.getTransactionById(+val));
                }

                // ensure that the provided key value is valid
                if(!isValidStrings(val)) {
                    return reject(new BadRequestError());
                }

                let transaction = {...await this.transactionRepo.getTransactionByUniqueKey(key, val)};

                if (isEmptyObject(transaction)) {
                    return reject(new ResourceNotFoundError());
                }

                resolve(transaction);

            } catch (e) {
                reject(e);
            }

        });
    }

    addNewTransaction(newTransaction: Transaction): Promise<Transaction> {
        
        return new Promise<Transaction>(async (resolve, reject) => {

            if (!isValidObject(newTransaction, 'id')) {
                reject(new BadRequestError('Invalid property values found in provided transaction.'));
                return;
            }

            let conflict = this.getTransactionByUniqueKey({id: newTransaction.id});
        
            if (conflict) {
                reject(new ResourcePersistenceError('The provided transaction id is already taken.'));
                return;
            }

            try {
                const persistedTransaction = await this.transactionRepo.save(newTransaction);
                resolve(persistedTransaction);
            } catch (e) {
                reject(e);
            }

        });

    }

    updateTransaction(updatedTransaction: Transaction): Promise<boolean> {
        
        return new Promise<boolean>(async (resolve, reject) => {

            if (!isValidObject(updatedTransaction)) {
                reject(new BadRequestError('Invalid transaction provided (invalid values found).'));
                return;
            }

            try {
                // let repo handle some of the other checking since we are still mocking db
                resolve(await this.transactionRepo.update(updatedTransaction));
            } catch (e) {
                reject(e);
            }

        });

    }

    deleteById(id: number): Promise<boolean> {
        
        return new Promise<boolean>(async (resolve, reject) => {
            reject(new NotImplementedError());
        });

    }

}