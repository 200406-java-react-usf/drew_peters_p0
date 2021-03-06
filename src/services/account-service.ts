import { Account } from "../models/account";
import { AccountRepository } from "../repos/account-repo";
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


export class AccountService {

    constructor(private accountRepo: AccountRepository) {
        this.accountRepo = accountRepo;
    }

    async getAllAccounts(): Promise<Account[]> {

        try {

            let accounts = await this.accountRepo.getAll();

            if (accounts.length == 0) {
                throw new ResourceNotFoundError();
            }

            return accounts;

        } catch (e) {
            throw e;
        }

    }

    async getAccountById(id: number): Promise<Account> {

        try {

            if (!isValidId(id)) {
                throw new BadRequestError();
            }

            let account = await this.accountRepo.getById(id);

            if (isEmptyObject(account)) {
                throw new ResourceNotFoundError();
            }

            return account;

        } catch (e) {
            throw e;
        }

    }

    async getAccountByUniqueKey(queryObj: any): Promise<Account> {

        try {

            let queryKeys = Object.keys(queryObj);

            if(!queryKeys.every(key => isPropertyOf(key, Account))) {
                throw new BadRequestError();
            }

            let key = queryKeys[0];
            let val = queryObj[key];

            if (key === 'id') {
                return await this.getAccountById(+val);
            }

            // ensure that the provided key value is valid
            if(!isValidStrings(val)) {
                throw new BadRequestError();
            }

            let account = await this.accountRepo.getAccountByUniqueKey(key, val);

            if (isEmptyObject(account)) {
                throw new ResourceNotFoundError();
            }

            return account;

        } catch (e) {
            throw e;
        }
    }

    async addNewAccount(newAccount: Account): Promise<Account> {
        
        try {

            if (!isValidObject(newAccount, 'id')) {
                throw new BadRequestError('Invalid property values found in provided account.');
            }

            let conflict = this.getAccountByUniqueKey({id: newAccount.id});
        
            if (conflict) {
                throw new ResourcePersistenceError('The provided account id is already taken.');
            }

            const persistedAccount = await this.accountRepo.save(newAccount);
                
            return persistedAccount;
            
        } catch (e) {
            throw e;
        }

    }

    async updateAccount(updatedAccount: Account): Promise<boolean> {
        
        if (!isValidObject(updatedAccount)) {
            throw new BadRequestError();
        }

        // will throw an error if no transaction is found with provided id
        await this.getAccountById(updatedAccount.id);

        await this.accountRepo.update(updatedAccount);

        return true;
    }

    async deleteAccount(deletedAccount: Account): Promise<boolean> {
        
        if (!isValidObject(deletedAccount)) {
            throw new BadRequestError();
        }

        // will throw an error if no user is found with provided id
        await this.getAccountById(deletedAccount.id);

        await this.accountRepo.delete(deletedAccount);

        return true;

    }

}