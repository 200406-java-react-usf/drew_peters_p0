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
    NotImplementedError, 
    ResourcePersistenceError
} from "../errors/errors";


export class AccountService {

    constructor(private accountRepo: AccountRepository) {
        this.accountRepo = accountRepo;
    }

    getAllAccounts(): Promise<Account[]> {

        return new Promise<Account[]>(async (resolve, reject) => {

            let accounts: Account[] = [];
            let result = await this.accountRepo.getAll();

            for (let account of result) {
                accounts.push({...account});
            }

            if (accounts.length == 0) {
                reject(new ResourceNotFoundError());
                return;
            }
            resolve(accounts);

        });

    }

    getAccountById(id: number): Promise<Account> {

        return new Promise<Account>(async (resolve, reject) => {

            if (!isValidId(id)) {
                return reject(new BadRequestError());
            }

            let account = {...await this.accountRepo.getById(id)};

            if (isEmptyObject(account)) {
                return reject(new ResourceNotFoundError());
            }
            resolve(account);

        });

    }

    getAccountByUniqueKey(queryObj: any): Promise<Account> {

        return new Promise<Account>(async (resolve, reject) => {

            // we need to wrap this up in a try/catch in case errors are thrown for our awaits
            try {

                let queryKeys = Object.keys(queryObj);

                if(!queryKeys.every(key => isPropertyOf(key, Account))) {
                    return reject(new BadRequestError());
                }

                // we will only support single param searches (for now)
                let key = queryKeys[0];
                let val = queryObj[key];

                // if they are searching for a user by id, reuse the logic we already have
                if (key === 'id') {
                    return resolve(await this.getAccountById(+val));
                }

                // ensure that the provided key value is valid
                if(!isValidStrings(val)) {
                    return reject(new BadRequestError());
                }

                let account = {...await this.accountRepo.getAccountByUniqueKey(key, val)};

                if (isEmptyObject(account)) {
                    return reject(new ResourceNotFoundError());
                }
                resolve(account);

            } catch (e) {
                reject(e);
            }

        });
    }

    addNewAccount(newAccount: Account): Promise<Account> {
        
        return new Promise<Account>(async (resolve, reject) => {

            if (!isValidObject(newAccount, 'id')) {
                reject(new BadRequestError('Invalid property values found in provided account.'));
                return;
            }

            let conflict = this.getAccountByUniqueKey({id: newAccount.id});
        
            if (conflict) {
                reject(new ResourcePersistenceError('The provided account id is already taken.'));
                return;
            }

            try {
                const persistedAccount = await this.accountRepo.save(newAccount);
                resolve (persistedAccount);
            } catch (e) {
                reject(e);
            }

        });

    }

    updateAccount(updatedAccount: Account): Promise<boolean> {
        
        return new Promise<boolean>(async (resolve, reject) => {

            if (!isValidObject(updatedAccount)) {
                reject(new BadRequestError('Invalid account provided (invalid values found).'));
                return;
            }

            try {
                // let repo handle some of the other checking since we are still mocking db
                resolve(await this.accountRepo.update(updatedAccount));
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