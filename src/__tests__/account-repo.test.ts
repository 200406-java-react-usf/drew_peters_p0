import { AccountRepository } from '../repos/account-repo';
import * as mockIndex from '..';
import * as mockMapper from '../util/result-set-mapper';
import { Account } from '../models/account';

jest.mock('..', () => {
    return {
        connectionPool: {
            connect: jest.fn()
        }
    }
});

jest.mock('../util/result-set-mapper', () => {
    return {
        mapAccountResultSet: jest.fn()
    }
});

describe('accountRepo', () => {

    let sut = new AccountRepository();
    let mockConnect = mockIndex.connectionPool.connect;

    beforeEach(() => {

        (mockConnect as jest.Mock).mockClear().mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => {
                    return {
                        rows: [
                            {
                                id: 1,
                                balance: 14233,
                                type: 'Savings',
                                owner_id: 1
                            }
                        ]
                    }
                }), 
                release: jest.fn()
            }
        });
        (mockMapper.mapAccountResultSet as jest.Mock).mockClear();
    });

    test('should resolve to an array of Accounts when getAll retrieves records from data source', async () => {
        
        // Arrange
        expect.hasAssertions();

        let mockAccount = new Account(1, 14233, 'Savings', 1);
        (mockMapper.mapAccountResultSet as jest.Mock).mockReturnValue(mockAccount);

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

    test('should resolve to an Account object when getById retrieves a record from data source', async () => {

        // Arrange
        expect.hasAssertions();

        let mockAccount = new Account(1, 14233, 'Savings', 1);
        (mockMapper.mapAccountResultSet as jest.Mock).mockReturnValue(mockAccount);

        // Act
        let result = await sut.getById(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Account).toBe(true);

    });
    test('should resolve to a new Account object when save is called', async () => {
        
        //Arrange
        expect.hasAssertions();

        let mockAccount = new Account(1, 777, 'Checking', 1);
        (mockMapper.mapAccountResultSet as jest.Mock).mockReturnValue(mockAccount);

        //Act
        let result = await sut.save(mockAccount);

        //Assert
        expect(result).toBeTruthy();
        expect(result instanceof Account).toBe(true);
        expect(mockConnect).toBeCalledTimes(1);
    });

    test('should resolve to an Account object when getAccountByUniqueKey is called', async() => {
        
        //Arrange
        expect.hasAssertions();

        let mockAccount = new Account(1, 222, 'Savings', 1);
        (mockMapper.mapAccountResultSet as jest.Mock).mockReturnValue(mockAccount);

        //Act
        let result = await sut.getAccountByUniqueKey("accountId", "1");

        //Assert
        expect(result).toBeTruthy();
        expect(result instanceof Account).toBe(true);
        expect(mockConnect).toBeCalledTimes(1);
    });
});