import { Transaction } from '../models/transaction';
import { CrudRepository } from './crud-repo';
import { InternalServerError } from '../errors/errors';
import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { mapTransactionResultSet } from '../util/result-set-mapper';

export class TransactionRepository implements CrudRepository<Transaction> {

    baseQuery =`
        select
            t.id,
            t.amount,
            t.description,
            t.account_id
        from transactions t
        join accounts a
        on t.account_id = a.id
    `;

    async getAll(): Promise<Transaction[]> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} order by t.id`;
            let rs = await client.query(sql);
            return rs.rows.map(mapTransactionResultSet);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }

    async getById(id: number): Promise<Transaction> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where t.id = $1`;
            let rs = await client.query(sql, [id]);
            return mapTransactionResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }

    }

    async getTransactionByUniqueKey(key: string, val: string): Promise<Transaction> {

        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where t.${key} = $1`;
            let rs = await client.query(sql, [val]);
            return mapTransactionResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
        
    }

    async save(newTransaction: Transaction): Promise<Transaction> {
            
        let client: PoolClient;

        try {
            client = await connectionPool.connect();

            let accountId = (await client.query('select id from accounts where name = $1', [newTransaction.accountId])).rows[0].id;

            let sql = `
                insert into transactions (amount, description, account_id)
                values ($1, $2, $3) returning id
            `;
            let rs = await client.query(sql, [newTransaction.amount, newTransaction.description, accountId]);

            newTransaction.id = rs.rows[0].id;
            
            return newTransaction;

        } catch (e) {
            console.log(e);
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }

    async update(updatedTransaction: Transaction): Promise<boolean> {
        
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `
            update transactions
            set
                amount = $2,
                description = $3
            where id = $1
        `;
        await client.query(sql, [updatedTransaction.id, updatedTransaction.amount, updatedTransaction.description]);
            return true;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }

    async delete(deletedTransaction: Transaction): Promise<boolean> {
        let client: PoolClient;
            try { 
                client = await connectionPool.connect();
                let sql = `
                    delete from transactions
                    where id = $1
                `;
                await client.query(sql, [deletedTransaction.id]);
                return true;
            } catch (e) {
                console.log(e);
                throw new InternalServerError();
            } finally {
                client && client.release();
            }
    }
}