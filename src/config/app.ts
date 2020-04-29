import { UserRepository } from "../repos/user-repo";
import { UserService } from "../services/user-service";
import { AccountRepository } from "../repos/account-repo";
import { AccountService } from "../services/account-service";
import { TransactionRepository } from "../repos/transaction-repo";
import { TransactionService } from "../services/transaction-service";

const userRepo = new UserRepository();
const userService = new UserService(userRepo);

const accountRepo = new AccountRepository();
const accountService = new AccountService(accountRepo);

const transactionRepo = new TransactionRepository();
const transactionService = new TransactionService(transactionRepo);

export default {
    userService,
    accountService,
    transactionService
}