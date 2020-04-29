import { TransactionService } from '../services/transaction-service';
import { TransactionRepository } from '../repos/transaction-repo';
import { Transaction } from '../models/transaction';
import Validator from '../util/validator';
import { ResourceNotFoundError, BadRequestError } from '../errors/errors';

describe('transactionService', () => {

    let sut: TransactionService;
    let mockRepo: TransactionRepository = new TransactionRepository();

    let mockTransactions = [
        new Transaction(1, 825, 'Rent Bill', 1),
        new Transaction(2, 216.12, 'Electric Bill', 1),
        new Transaction(3, 64.45, 'Debit Transaction', 1),
        new Transaction(4, 1250, 'Rent Bill', 2),
        new Transaction(5, 415.12, 'Electric Bill', 2),
        new Transaction(6, 561.10, 'Debit Transaction', 2),
        new Transaction(7, 975, 'Rent Bill', 3),
        new Transaction(8, 323.56, 'Electric Bill', 3),
        new Transaction(9, 112.48, 'Debit Transaction', 3),
        new Transaction(10, 700, 'Rent Bill', 5),
        new Transaction(11, 113.57, 'Electric Bill', 5),
        new Transaction(12, 84.25, 'Debit Transaction', 5),
    ];

    beforeEach(() => {

        sut = new TransactionService(mockRepo);

        // Reset all external methods
        for (let method in TransactionRepository.prototype) {
            TransactionRepository.prototype[method] = jest.fn().mockImplementation(() => {
                throw new Error(`Failed to mock external method: TransactionRepository.${method}!`);
            });
        }
    
    });

    test('should resolve to Transaction[] when getAllTransactions() successfully retrieves transactions from the data source', async () => {

        // Arrange
        expect.hasAssertions();
        TransactionRepository.prototype.getAll = jest.fn().mockReturnValue(mockTransactions);

        // Act
        let result = await sut.getAllTransactions();

        // Assert
        expect(result).toBeTruthy();
        expect(result.length).toBe(12);

    });

    test('should reject with ResourceNotFoundError when getAllTransactions fails to get any transactions from the data source', async () => {

        // Arrange
        expect.assertions(1);
        TransactionRepository.prototype.getAll = jest.fn().mockReturnValue([]);

        // Act
        try {
            await sut.getAllTransactions();
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });

    test('should resolve to Transaction when getTransactionById is given a valid an known id', async () => {

        // Arrange
        expect.assertions(2);
        
        Validator.isValidId = jest.fn().mockReturnValue(true);

        TransactionRepository.prototype.getById = jest.fn().mockImplementation((id: number) => {
            return new Promise<Transaction>((resolve) => resolve(mockTransactions[id - 1]));
        });


        // Act
        let result = await sut.getTransactionById(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result.id).toBe(1);

    });

    test('should reject with BadRequestError when getTransactionById is given a invalid value as an id (decimal)', async () => {

        // Arrange
        expect.hasAssertions();
        TransactionRepository.prototype.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getTransactionById(3.14);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getTransactionById is given a invalid value as an id (zero)', async () => {

        // Arrange
        expect.hasAssertions();
        TransactionRepository.prototype.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getTransactionById(0);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getTransactionById is given a invalid value as an id (NaN)', async () => {

        // Arrange
        expect.hasAssertions();
        TransactionRepository.prototype.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getTransactionById(NaN);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getTransactionById is given a invalid value as an id (negative)', async () => {

        // Arrange
        expect.hasAssertions();
        TransactionRepository.prototype.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getTransactionById(-2);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with ResourceNotFoundError if getByid is given an unknown id', async () => {

        // Arrange
        expect.hasAssertions();
        TransactionRepository.prototype.getById = jest.fn().mockReturnValue(true);

        // Act
        try {
            await sut.getTransactionById(9999);
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });

});