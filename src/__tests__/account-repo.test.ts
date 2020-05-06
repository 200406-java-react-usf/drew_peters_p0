import { AccountRepository } from '../repos/account-repo';
import * as mockIndex from '..';
import * as mockMapper from '../util/result-set-mapper';
import { Account } from '../models/account';

/*
    We need to mock the connectionPool exported from the main module
    of our application. At this time, we only use one exposed method
    of the pg Pool API: connect. So we will provide a mock function 
    in its place so that we can mock it in our tests.
*/
jest.mock('..', () => {
    return {
        connectionPool: {
            connect: jest.fn()
        }
    }
});

// The result-set-mapper module also needs to be mocked
jest.mock('../util/result-set-mapper', () => {
    return {
        mapAccountResultSet: jest.fn()
    }
});

describe('accountRepo', () => {

    let sut = new AccountRepository();
    let mockConnect = mockIndex.connectionPool.connect;

    beforeEach(() => {

        /*
            We can provide a successful retrieval as the default mock implementation
            since it is very verbose. We can provide alternative implementations for
            the query and release methods in specific tests if needed.
        */
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

});