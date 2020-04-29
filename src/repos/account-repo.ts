import data from '../data/account-db';
import { Account } from '../models/account';
import { CrudRepository } from './crud-repo';
import {
    NotImplementedError, 
    ResourceNotFoundError
} from '../errors/errors';

export class AccountRepository implements CrudRepository<Account> {

    getAll(): Promise<Account[]> {

        return new Promise<Account[]>((resolve) => {

            setTimeout(() => {
                let accounts: Account[] = data;
                resolve(accounts);
            }, 250);

        });
    
    }

    getById(id: number): Promise<Account> {

        return new Promise<Account>((resolve) => {

            setTimeout(() => {
                const account = {...data.find(account => account.id === id)};
                resolve(account);
            }, 250);

        });
    }

    getAccountByUniqueKey(key: string, val: string): Promise<Account> {

        return new Promise<Account>((resolve, reject) => {
           
            setTimeout(() => {
                const account = {...data.find(account => account[key] === val)};
                resolve(account);
            }, 250);

        });
        
    
    }

    getAccountByType(type: string, oid: number) {
        
        return new Promise<Account>((resolve, reject) => {
        
            setTimeout(() => {
                const account = {...data.find(account => account.type === type && account.ownerId === oid)};
                resolve(account);  
            }, 250);

        });
    
    }

    save(newAccount: Account): Promise<Account> {
            
        return new Promise<Account>((resolve, reject) => {
        
            setTimeout(() => { 
                newAccount.id = (data.length) + 1;
                data.push(newAccount);
                resolve(newAccount);
            });

        });
    
    }

    update(updatedAccount: Account): Promise<boolean> {
        
        return new Promise<boolean>((resolve, reject) => {
        
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
    
    }

    deleteById(id: number): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {
            reject(new NotImplementedError());
        });
    }

}