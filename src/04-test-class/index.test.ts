import {
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';
import { random } from 'lodash';

jest.mock('lodash');

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const bankAccount = getBankAccount(100);
    expect(bankAccount.getBalance()).toBe(100);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const bankAccount = getBankAccount(100);
    expect(() => bankAccount.withdraw(101)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const bankAccountA = getBankAccount(100);
    const bankAccountB = getBankAccount(100);
    expect(() => bankAccountA.transfer(101, bankAccountB)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const bankAccount = getBankAccount(100);
    expect(() => bankAccount.transfer(100, bankAccount)).toThrow(
      TransferFailedError,
    );
  });

  test('should deposit money', () => {
    const bankAccount = getBankAccount(100);
    bankAccount.deposit(10);
    expect(bankAccount.getBalance()).toBe(110);
  });

  test('should withdraw money', () => {
    const bankAccount = getBankAccount(100);
    bankAccount.withdraw(10);
    expect(bankAccount.getBalance()).toBe(90);
  });

  test('should transfer money', () => {
    const bankAccountA = getBankAccount(100);
    const bankAccountB = getBankAccount(100);
    bankAccountA.transfer(10, bankAccountB);
    expect(bankAccountA.getBalance()).toBe(90);
    expect(bankAccountB.getBalance()).toBe(110);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const fetchedBalance = 55;
    (random as jest.Mock)
      .mockReturnValueOnce(fetchedBalance)
      .mockReturnValueOnce(1);

    const bankAccount = getBankAccount(100);
    await expect(bankAccount.fetchBalance()).resolves.toEqual(fetchedBalance);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const fetchedBalance = 55;
    (random as jest.Mock)
      .mockReturnValueOnce(fetchedBalance)
      .mockReturnValueOnce(1);

    const bankAccount = getBankAccount(100);
    await bankAccount.synchronizeBalance();
    expect(bankAccount.getBalance()).toEqual(fetchedBalance);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    (random as jest.Mock).mockReturnValue(0);
    const bankAccount = getBankAccount(100);
    await expect(bankAccount.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
