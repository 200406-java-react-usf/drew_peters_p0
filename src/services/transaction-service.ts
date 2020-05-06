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
    ResourcePersistenceError
} from "../errors/errors";


export class TransactionService {

    constructor(private transactionRepo: TransactionRepository) {
        this.transactionRepo = transactionRepo;
    }

    async getAllTransactions(): Promise<Transaction[]> {

        try {

            let transactions = await this.transactionRepo.getAll();


            if (transactions.length == 0) {
                throw new ResourceNotFoundError();
            }

            return transactions;

        } catch (e) {
            throw e;
        }

    }

    async getTransactionById(id: number): Promise<Transaction> {

        try {

            if (!isValidId(id)) {
                throw new BadRequestError();
            }

            let transaction = {...await this.transactionRepo.getById(id)};

            if (isEmptyObject(transaction)) {
                throw new ResourceNotFoundError();
            }

            return transaction;

        } catch (e) {
            throw e;
        }

    }

    async getTransactionByUniqueKey(queryObj: any): Promise<Transaction> {

        // we need to wrap this up in a try/catch in case errors are thrown for our awaits
        try {

            let queryKeys = Object.keys(queryObj);

            if(!queryKeys.every(key => isPropertyOf(key, Transaction))) {
                throw new BadRequestError();
            }

            // we will only support single param searches (for now)
            let key = queryKeys[0];
            let val = queryObj[key];

            // if they are searching for a transaction by id, reuse the logic we already have
            if (key === 'id') {
                return await this.getTransactionById(+val);
            }

            // ensure that the provided key value is valid
            if(!isValidStrings(val)) {
                throw new BadRequestError();
            }

            let transaction = await this.transactionRepo.getTransactionByUniqueKey(key, val);

            if (isEmptyObject(transaction)) {
                throw new ResourceNotFoundError();
            }

            return transaction;

        } catch (e) {
            throw e;
        }

    }

    async addNewTransaction(newTransaction: Transaction): Promise<Transaction> {
        
        try {

            if (!isValidObject(newTransaction, 'id')) {
                throw new BadRequestError('Invalid property values found in provided transaction.');
            }

            let conflict = this.getTransactionByUniqueKey({id: newTransaction.id});
        
            if (conflict) {
                throw new ResourcePersistenceError('The provided transaction id is already taken.');
            }

            const persistedTransaction = await this.transactionRepo.save(newTransaction);
            
            return persistedTransaction;
            } catch (e) {
                throw e;
            }

    }

    async updateTransaction(updatedTransaction: Transaction): Promise<boolean> {
        
        if (!isValidObject(updatedTransaction)) {
            throw new BadRequestError();
        }

        // will throw an error if no transaction is found with provided id
        await this.getTransactionById(updatedTransaction.id);

        await this.transactionRepo.update(updatedTransaction);

        return true;
    }

    async deleteTransaction(deletedTransaction: Transaction): Promise<boolean> {
        
        if (!isValidObject(deletedTransaction)) {
            throw new BadRequestError();
        }

        // will throw an error if no transaction is found with provided id
        await this.getTransactionById(deletedTransaction.id);

        await this.transactionRepo.delete(deletedTransaction);

        return true;

    }

}