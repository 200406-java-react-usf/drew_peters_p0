import { AccountService } from '../services/account-service';
import { AccountRepository } from '../repos/account-repo';
import { Account } from '../models/account';
import Validator from '../util/validator';
import { ResourceNotFoundError, BadRequestError } from '../errors/errors';

describe('accountService', () => {

    let sut: AccountService;
    let mockRepo: AccountRepository = new AccountRepository();

    let mockAccounts = [
        new Account(1, 14233, 'Savings', 1),
        new Account(2, 1736, 'Checking', 1),
        new Account(3, 6523, 'Checking', 2),
        new Account(4, 1235, 'Savings', 3),
        new Account(5, 45641, 'Savings', 5),
        new Account(6, 526, 'Checking', 3),
        new Account(7, 341, 'Checking', 5),
        new Account(8, 57461, 'Savings', 2)
    ];

    beforeEach(() => {

        sut = new AccountService(mockRepo);

        // Reset all external methods
        for (let method in AccountRepository.prototype) {
            AccountRepository.prototype[method] = jest.fn().mockImplementation(() => {
                throw new Error(`Failed to mock external method: AccountRepository.${method}!`);
            });
        }
    
    });

    test('should resolve to Account[] when getAllAccounts() successfully retrieves accounts from the data source', async () => {

        // Arrange
        expect.hasAssertions();
        AccountRepository.prototype.getAll = jest.fn().mockReturnValue(mockAccounts);

        // Act
        let result = await sut.getAllAccounts();

        // Assert
        expect(result).toBeTruthy();
        expect(result.length).toBe(8);

    });

    test('should reject with ResourceNotFoundError when getAllAccounts fails to get any accounts from the data source', async () => {

        // Arrange
        expect.assertions(1);
        AccountRepository.prototype.getAll = jest.fn().mockReturnValue([]);

        // Act
        try {
            await sut.getAllAccounts();
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });

    test('should resolve to Account when getAccountById is given a valid and known id', async () => {

        // Arrange
        expect.assertions(2);
        
        Validator.isValidId = jest.fn().mockReturnValue(true);

        AccountRepository.prototype.getById = jest.fn().mockImplementation((id: number) => {
            return new Promise<Account>((resolve) => resolve(mockAccounts[id - 1]));
        });


        // Act
        let result = await sut.getAccountById(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result.id).toBe(1);

    });

    test('should reject with BadRequestError when getAccountById is given a invalid value as an id (decimal)', async () => {

        // Arrange
        expect.hasAssertions();
        AccountRepository.prototype.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getAccountById(3.14);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getAccountById is given a invalid value as an id (zero)', async () => {

        // Arrange
        expect.hasAssertions();
        AccountRepository.prototype.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getAccountById(0);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getAccountById is given a invalid value as an id (NaN)', async () => {

        // Arrange
        expect.hasAssertions();
        AccountRepository.prototype.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getAccountById(NaN);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getAccountById is given a invalid value as an id (negative)', async () => {

        // Arrange
        expect.hasAssertions();
        AccountRepository.prototype.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getAccountById(-2);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with ResourceNotFoundError if getByid is given an unknown id', async () => {

        // Arrange
        expect.hasAssertions();
        AccountRepository.prototype.getById = jest.fn().mockReturnValue(true);

        // Act
        try {
            await sut.getAccountById(9999);
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });

});