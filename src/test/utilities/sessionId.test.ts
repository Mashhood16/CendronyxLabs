import { describe, it, expect, beforeEach } from 'vitest';
import { getAnonymousId } from '../../utils/sessionId';

describe('getAnonymousId', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('generates a new anonymous ID if none exists', () => {
    const id = getAnonymousId();
    expect(id).toBeTruthy();
    expect(id).toMatch(/^anon_/);
  });

  it('stores the ID in localStorage', () => {
    const id = getAnonymousId();
    const stored = localStorage.getItem('virtuallab_anon_id');
    expect(stored).toBe(id);
  });

  it('returns the same ID on subsequent calls', () => {
    const id1 = getAnonymousId();
    const id2 = getAnonymousId();
    expect(id1).toBe(id2);
  });

  it('generates different IDs for different sessions', () => {
    const id1 = getAnonymousId();
    localStorage.removeItem('virtuallab_anon_id');
    const id2 = getAnonymousId();
    expect(id1).not.toBe(id2);
  });
});
