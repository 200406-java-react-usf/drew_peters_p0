import { TransactionRepository } from '../repos/transaction-repo';
import * as mockIndex from '..';
import * as mockMapper from '../util/result-set-mapper';
import { Transaction } from '../models/transaction';

jest.mock('..', () => {
    return {
        connectionPool: {
            connect: jest.fn()
        }
    }
});

jest.mock('../util/result-set-mapper', () => {
    return {
        mapTransactionResultSet: jest.fn()
    }
});

describe('transactionRepo', () => {

    let sut = new TransactionRepository();
    let mockConnect = mockIndex.connectionPool.connect;

    beforeEach(() => {

        (mockConnect as jest.Mock).mockClear().mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => {
                    return {
                        rows: [
                            {
                                id: 1,
                                amount: 825,
                                description: 'Rent Bill',
                                account_id: 1
                            }
                        ]
                    }
                }), 
                release: jest.fn()
            }
        });
        (mockMapper.mapTransactionResultSet as jest.Mock).mockClear();
    });

    test('should resolve to an array of Transactions when getAll retrieves records from data source', async () => {
        
        // Arrange
        expect.hasAssertions();

        let mockTransaction = new Transaction(1, 99999, 'desc', 1);
        (mockMapper.mapTransactionResultSet as jest.Mock).mockReturnValue(mockTransaction);

        // Act
        let result = await sut.getAll();

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);
        expect(result.length).toBe(1);
        expect(mockConnect).toBeCalledTimes(1);

    });

    test('should resolve to an empty array when getAll retrieves no records from data source', async () => {
        
        // Arrange
        expect.hasAssertions();
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { return { rows: [] } }), 
                release: jest.fn()
            }
        });

        // Act
        let result = await sut.getAll();

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);
        expect(result.length).toBe(0);
        expect(mockConnect).toBeCalledTimes(1);

    });

    test('should resolve to a Transaction object when getById retrieves a record from data source', async () => {

        // Arrange
        expect.hasAssertions();

        let mockTransaction = new Transaction(1, 99999, 'desc', 1);
        (mockMapper.mapTransactionResultSet as jest.Mock).mockReturnValue(mockTransaction);

        // Act
        let result = await sut.getById(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Transaction).toBe(true);

    });
    test('should resolve to a new transaction object when save is called', async () => {
        
        //Arrange
        expect.hasAssertions();

        let mockTransaction = new Transaction(1, 20, 'test', 1);
        (mockMapper.mapTransactionResultSet as jest.Mock).mockReturnValue(mockTransaction);

        //Act
        let result = await sut.save(mockTransaction);

        //Assert
        expect(result).toBeTruthy();
        expect(result instanceof Transaction).toBe(true);
        expect(mockConnect).toBeCalledTimes(1);
    });

    test('should resolve to an transaction object when getTransactionByUniqueKey is called', async() => {
        
        //Arrange
        expect.hasAssertions();

        let mockTransaction = new Transaction(1, 20, 'test', 1);
        (mockMapper.mapTransactionResultSet as jest.Mock).mockReturnValue(mockTransaction);

        //Act
        let result = await sut.getTransactionByUniqueKey("accountId", "1");

        //Assert
        expect(result).toBeTruthy();
        expect(result instanceof Transaction).toBe(true);
        expect(mockConnect).toBeCalledTimes(1);
    });
});