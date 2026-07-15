import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { studentService, resetStudentDB } from '../../services/studentService';

describe('studentService', () => {
  beforeEach(() => {
    (globalThis as any).__clearIDBMock();
    resetStudentDB();
    localStorage.clear();
  });

  afterEach(() => {
    (globalThis as any).__clearIDBMock();
    resetStudentDB();
    localStorage.clear();
  });

  it('registers a new account', async () => {
    const account = await studentService.register('Alice', 'alice@test.com', 'Class 10', 'A', 'password123');
    expect(account.name).toBe('Alice');
    expect(account.email).toBe('alice@test.com');
    expect(account.classLevel).toBe('Class 10');
    expect(account.section).toBe('A');
    expect(account.id).toBeTruthy();
    expect(account.passwordHash).not.toBe('password123');
  });

  it('rejects duplicate email registration', async () => {
    await studentService.register('Alice', 'alice@test.com', 'Class 10', 'A', 'password123');
    await expect(
      studentService.register('Bob', 'alice@test.com', 'Class 9', 'B', 'password456')
    ).rejects.toThrow('already exists');
  });

  it('trims and lowercases email on registration', async () => {
    const account = await studentService.register('Bob', '  Bob@TEST.com  ', 'Class 9', 'B', 'pass');
    expect(account.email).toBe('bob@test.com');
  });

  it('logs in with correct credentials', async () => {
    await studentService.register('Alice', 'alice@test.com', 'Class 10', 'A', 'password123');
    const account = await studentService.login('alice@test.com', 'password123');
    expect(account.name).toBe('Alice');
  });

  it('rejects login with wrong password', async () => {
    await studentService.register('Alice', 'alice@test.com', 'Class 10', 'A', 'password123');
    await expect(
      studentService.login('alice@test.com', 'wrongpassword')
    ).rejects.toThrow('Incorrect password');
  });

  it('rejects login for non-existent email', async () => {
    await expect(
      studentService.login('nobody@test.com', 'password123')
    ).rejects.toThrow('No account found');
  });

  it('retrieves an account by ID', async () => {
    const registered = await studentService.register('Alice', 'alice@test.com', 'Class 10', 'A', 'pass');
    const fetched = await studentService.getAccount(registered.id);
    expect(fetched).not.toBeNull();
    expect(fetched!.name).toBe('Alice');
  });

  it('returns null for non-existent ID', async () => {
    const fetched = await studentService.getAccount('nonexistent_id');
    expect(fetched).toBeNull();
  });

  it('updates profile fields', async () => {
    const account = await studentService.register('Alice', 'alice@test.com', 'Class 10', 'A', 'pass');
    await studentService.updateProfile(account.id, { name: 'Alice Updated', section: 'B' });
    const updated = await studentService.getAccount(account.id);
    expect(updated!.name).toBe('Alice Updated');
    expect(updated!.section).toBe('B');
    expect(updated!.email).toBe('alice@test.com');
  });

  it('changes password correctly', async () => {
    const account = await studentService.register('Alice', 'alice@test.com', 'Class 10', 'A', 'oldpassword');
    await studentService.changePassword(account.id, 'oldpassword', 'newpassword');
    await expect(
      studentService.login('alice@test.com', 'newpassword')
    ).resolves.toBeTruthy();
    await expect(
      studentService.login('alice@test.com', 'oldpassword')
    ).rejects.toThrow('Incorrect password');
  });

  it('rejects password change with wrong current password', async () => {
    const account = await studentService.register('Alice', 'alice@test.com', 'Class 10', 'A', 'pass');
    await expect(
      studentService.changePassword(account.id, 'wrongpass', 'newpass')
    ).rejects.toThrow('Current password is incorrect');
  });

  it('deletes an account', async () => {
    const account = await studentService.register('Alice', 'alice@test.com', 'Class 10', 'A', 'pass');
    await studentService.deleteAccount(account.id, 'pass');
    const fetched = await studentService.getAccount(account.id);
    expect(fetched).toBeNull();
  });

  it('rejects account deletion with wrong password', async () => {
    const account = await studentService.register('Alice', 'alice@test.com', 'Class 10', 'A', 'pass');
    await expect(
      studentService.deleteAccount(account.id, 'wrongpass')
    ).rejects.toThrow('Incorrect password');
  });
});
