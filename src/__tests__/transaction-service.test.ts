import { TransactionService } from '../services/transaction-service';
import { TransactionRepository } from '../repos/transaction-repo';
import { Transaction } from '../models/transaction';
import Validator from '../util/validator';
import { 
    ResourceNotFoundError, 
    BadRequestError 
} from '../errors/errors';

jest.mock('../repos/transaction-repo', () => {
    
    return new class TransactionRepository {
            getAll = jest.fn();
            getById = jest.fn();
            getTransactionByUniqueKey = jest.fn();
            save = jest.fn();
            update = jest.fn();
            delete = jest.fn();
    }

});

describe('transactionService', () => {

    let sut: TransactionService;
    let mockRepo;

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

        mockRepo = jest.fn(() => {
            return {
                getAll: jest.fn(),
                getById: jest.fn(),
                getTransactionByUniqueKey: jest.fn(),
                save: jest.fn(),
                update: jest.fn(),
                delete: jest.fn()
            }
        });

        sut = new TransactionService(mockRepo);

    });

    test('should resolve to Transaction[] when getAllTransactions() successfully retrieves transactions from the data source', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getAll = jest.fn().mockReturnValue(mockTransactions);

        // Act
        let result = await sut.getAllTransactions();

        // Assert
        expect(result).toBeTruthy();
        expect(result.length).toBe(12);

    });

    test('should reject with ResourceNotFoundError when getAllTransactions fails to get any transactions from the data source', async () => {

        // Arrange
        expect.assertions(1);
        mockRepo.getAll = jest.fn().mockReturnValue([]);

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

        mockRepo.getById = jest.fn().mockImplementation((id: number) => {
            return new Promise<Transaction>((resolve) => resolve(mockTransactions[id-1]));
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
        mockRepo.getById = jest.fn().mockReturnValue(false);

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
        mockRepo.getById = jest.fn().mockReturnValue(false);

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
        mockRepo.getById = jest.fn().mockReturnValue(false);

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
        mockRepo.getById = jest.fn().mockReturnValue(false);

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
        mockRepo.getById = jest.fn().mockReturnValue(true);

        // Act
        try {
            await sut.getTransactionById(9999);
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });

    test('should resolve to adding a new transaction when given the correct information to addNewTransaction', async () => {
        
        //Arrange
        expect.hasAssertions();

        mockRepo.save = jest.fn().mockReturnValue(mockTransactions[0]);

        //Act
        let result = await sut.addNewTransaction(mockTransactions[0]);

        //Asssert
        expect(result).toBeTruthy();
        expect(result.id).toBe(1);
        expect(result.description).toBeInstanceOf(String);
    });
    
    test('should throw BadRequestError when sending a bad value to addNewTransaction', async () => {
        
        //Arrange
        expect.hasAssertions();

        //Act
        try {
            await sut.addNewTransaction(null);
        } catch (e) {

            //Assert
            expect(e instanceof BadRequestError).toBe(true);
        }
    });

    test('should resolve to updating a transaction given the correct information', async () => {

        //Arrange
        expect.hasAssertions();
        sut.getTransactionById = jest.fn().mockReturnValue({});
        mockRepo.update = jest.fn().mockReturnValue({})

        //Act
        let result = sut.updateTransaction(new Transaction(1, 132, 'description', 1));

        //Assert
        expect(result).toBeTruthy();
    });

    test('should throw BadRequestError when sending a bad value to updateTransaction', async () => {
        
        //Arrange
        expect.hasAssertions();

        //Act
        try {
            await sut.updateTransaction(null);
        } catch (e) {

            //Assert
            expect(e instanceof BadRequestError).toBe(true);
        }
    });

    test('should resolve to deleting a transaction given the correct information to delete', async () => {

        //Arrange
        expect.hasAssertions();
        sut.getTransactionById = jest.fn().mockReturnValue({});
        mockRepo.delete = jest.fn().mockReturnValue({})

        //Act
        let result = sut.deleteTransaction(new Transaction(1, 132, 'description', 1));

        //Assert
        expect(result).toBeTruthy();
    });

    test('should throw BadRequestError when sending a bad value to deleteTransaction', async () => {
        
        //Arrange
        expect.hasAssertions();

        //Act
        try {
            await sut.deleteTransaction(null);
        } catch (e) {

            //Assert
            expect(e instanceof BadRequestError).toBe(true);
        }
    });

});