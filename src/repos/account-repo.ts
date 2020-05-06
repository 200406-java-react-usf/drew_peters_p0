import { Account } from '../models/account';
import { CrudRepository } from './crud-repo';
import {InternalServerError } from '../errors/errors';
import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { mapAccountResultSet } from '../util/result-set-mapper';

export class AccountRepository implements CrudRepository<Account> {

    baseQuery = `
        select
            a.id,
            a.balance,
            a.type,
            a.owner_id
        from accounts a
        join app_users au
        on a.owner_id = au.id
    `;

    async getAll(): Promise<Account[]> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} order by a.id`;
            let rs = await client.query(sql);
            return rs.rows.map(mapAccountResultSet);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }

    async getById(id: number): Promise<Account> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where a.id = $1`;
            let rs = await client.query(sql, [id]);
            return mapAccountResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }

    }

    async getAccountByUniqueKey(key: string, val: string): Promise<Account> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where a.${key} = $1`;
            let rs = await client.query(sql, [val]);
            return mapAccountResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
        
    }

    async getAccountByType(type: string, oid: number) {
        
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where a.type = $1 and a.oid = $2`;
            let rs = await client.query(sql, [type, oid]);
            return mapAccountResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }

    async save(newAccount: Account): Promise<Account> {
            
        let client: PoolClient;

        try {
            client = await connectionPool.connect();

            let ownerId = (await client.query('select id from app_users where name = $1', [newAccount.ownerId])).rows[0].id;

            let sql = `
                insert into accounts (balance, type, owner_id)
                values ($1, $2, $3) returning id
            `;
            let rs = await client.query(sql, [newAccount.balance, newAccount.type, ownerId]);
            
            newAccount.id = rs.rows[0].id;
            
            return newAccount;
            
        } catch (e) {
            console.log(e);
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }

    async update(updatedAccount: Account): Promise<boolean> {
        
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `
            update accounts
            set
                balance = $2,
                type = $3
            where id = $1
        `;
        await client.query(sql, [updatedAccount.id, updatedAccount.balance, updatedAccount.type]);
            return true;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }

    async delete(deletedAccount: Account): Promise<boolean> {
        let client: PoolClient;
            try { 
                client = await connectionPool.connect();
                let sql = `
                    delete from accounts
                    where id = $1
                `;
                await client.query(sql, [deletedAccount.id]);
                return true;
            } catch (e) {
                console.log(e);
                throw new InternalServerError();
            } finally {
                client && client.release();
            }
    }

}