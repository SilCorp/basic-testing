import {
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';
import lodash from 'lodash';

jest.mock('lodash');
const mockLodash = lodash as jest.Mocked<typeof lodash>;
const { random: mockRandom } = mockLodash;

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const balance = 100;
    const bankAccount = getBankAccount(balance);
    expect(bankAccount.getBalance()).toBe(balance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const balance = 100;
    const bankAccount = getBankAccount(balance);
    const withdraw = () => bankAccount.withdraw(balance + 10);

    expect(withdraw).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const balanceA = 100;
    const bankAccountA = getBankAccount(balanceA);
    const bankAccountB = getBankAccount(100);
    const transfer = () => bankAccountA.transfer(balanceA + 10, bankAccountB);

    expect(transfer).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
    const bankAccount = getBankAccount(100);
    const transfer = () => bankAccount.transfer(1, bankAccount);

    expect(transfer).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    const balance = 100;
    const deposit = 10;
    const bankAccount = getBankAccount(balance).deposit(deposit);

    expect(bankAccount.getBalance()).toBe(balance + deposit);
  });

  test('should withdraw money', () => {
    const balance = 100;
    const withdraw = 10;
    const bankAccount = getBankAccount(balance).withdraw(withdraw);

    expect(bankAccount.getBalance()).toBe(balance - withdraw);
  });

  test('should transfer money', () => {
    const balanceA = 100;
    const balanceB = 100;
    const transfer = 10;
    const bankAccountA = getBankAccount(balanceA);
    const bankAccountB = getBankAccount(balanceB);
    bankAccountA.transfer(transfer, bankAccountB);

    expect(bankAccountA.getBalance()).toBe(balanceA - transfer);
    expect(bankAccountB.getBalance()).toBe(balanceB + transfer);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const fetchedBalance = 55;
    const requestIsSuccessful = 1;
    mockRandom
      .mockReturnValueOnce(fetchedBalance)
      .mockReturnValueOnce(requestIsSuccessful);

    const bankAccount = getBankAccount(100);
    await expect(bankAccount.fetchBalance()).resolves.toEqual(fetchedBalance);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const fetchedBalance = 55;
    const requestIsSuccessful = 1;
    mockRandom
      .mockReturnValueOnce(fetchedBalance)
      .mockReturnValueOnce(requestIsSuccessful);

    const bankAccount = getBankAccount(100);
    await bankAccount.synchronizeBalance();
    expect(bankAccount.getBalance()).toEqual(fetchedBalance);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const requestIsNotSuccessful = 0;
    mockRandom.mockReturnValue(requestIsNotSuccessful);
    const bankAccount = getBankAccount(100);

    await expect(bankAccount.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
