import data from '../data/account-db';
import { Account } from '../models/account';
import { CrudRepository } from './crud-repo';
import Validator from '../util/validator';
import {   
    BadRequestError, 
    NotImplementedError, 
    ResourceNotFoundError, 
} from '../errors/errors';

export class AccountRepository implements CrudRepository<Account> {

    private static instance: AccountRepository;

    private constructor() {}

    static getInstance() {
        return !AccountRepository.instance ? AccountRepository.instance = new AccountRepository() : AccountRepository.instance;
    }

    getAll(): Promise<Account[]> {

        return new Promise<Account[]>((resolve, reject) => {

            setTimeout(() => {
            
                let accounts = [];
    
                for (let account of data) {
                    accounts.push({...account});
                }
        
                if (accounts.length == 0) {
                    reject(new ResourceNotFoundError());
                    return;
                }
        
                resolve;
        
            }, 250);

        });
    };

    getById(id: number): Promise<Account> {
        return new Promise<Account>((resolve, reject) => {
            
            if (!Validator.isValidId(id)) {
                reject(new BadRequestError());
            }

            setTimeout(() => {
                
                const account = {...data.find(account => account.id === id)};

                if(Object.keys(account).length === 0) {
                    reject(new ResourceNotFoundError());
                    return;
                }

                resolve;

            }, 250);

        });
    };

    getAccountByType(type: string): Promise<Account> {

        return new Promise<Account>((resolve, reject) => {

            if (!Validator.isValidStrings(type)) {
                reject(new BadRequestError());
                return;
            }
           
            setTimeout(() => {
        
                const account = {...data.filter(account => account.type === type)[0]};
                
                if (Object.keys(account).length == 0) {
                    reject(new ResourceNotFoundError());
                    return;
                }
        
                resolve;
        
            }, 250);

        });
        
    };
    
    save(newAccount: Account): Promise<Account> {
            
        return new Promise<Account>((resolve, reject) => {
        
            if (!Validator.isValidObject(newAccount, 'id')) {
                reject(new BadRequestError('Invalid property values found in provided account.'));
                return;
            }
        
            setTimeout(() => {
                newAccount.id = (data.length) + 1;
                data.push(newAccount);
                
                resolve;
        
            });

        });
    
    };

    update(updatedAccount: Account): Promise<boolean> {
        
        return new Promise<boolean>((resolve, reject) => {

            let validObj = Validator.isValidObject(updatedAccount);
            let validId = Validator.isValidId(updatedAccount.id);
            if (!validObj || !validId) {
                reject(new BadRequestError('Invalid account provided (invalid values found).'));
                return;
            }
        
            setTimeout(() => {
        
                let persistedAccount = data.find(account => account.id === updatedAccount.id);
        
                if (!persistedAccount) {
                    reject(new ResourceNotFoundError('No account found with provided id.'));
                    return;
                }
    
                persistedAccount = updatedAccount;
    
                resolve(true);
        
            });

        });
    
    };

    deleteById(id: number): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {
            
            if (!Validator.isValidId(id)) {
                reject(new BadRequestError());
            }

            reject(new NotImplementedError());

            resolve;
        });
    }};