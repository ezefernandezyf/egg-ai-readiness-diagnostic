import { describe, it, expect } from 'vitest';
import { leadSchema } from '../lead-schema';

describe('leadSchema', () => {
  it('accepts valid email and company', () => {
    const result = leadSchema.safeParse({
      email: 'test@example.com',
      company: 'Acme Inc',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email format', () => {
    const result = leadSchema.safeParse({
      email: 'not-an-email',
      company: 'Acme Inc',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toContain('email');
    }
  });

  it('rejects empty email', () => {
    const result = leadSchema.safeParse({
      email: '',
      company: 'Acme Inc',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty company', () => {
    const result = leadSchema.safeParse({
      email: 'test@example.com',
      company: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects whitespace-only email', () => {
    const result = leadSchema.safeParse({
      email: '   ',
      company: 'Acme Inc',
    });
    expect(result.success).toBe(false);
  });

  it('rejects whitespace-only company', () => {
    const result = leadSchema.safeParse({
      email: 'test@example.com',
      company: '   ',
    });
    expect(result.success).toBe(false);
  });

  it('trims valid data with extra spaces', () => {
    const result = leadSchema.safeParse({
      email: '  test@example.com  ',
      company: '  Acme Inc  ',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('test@example.com');
      expect(result.data.company).toBe('Acme Inc');
    }
  });
});
