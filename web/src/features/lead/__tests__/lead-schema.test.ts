import { describe, it, expect } from 'vitest';
import { leadSchema } from '../lead-schema';

describe('leadSchema', () => {
  const validData = {
    email: 'test@example.com',
    firstName: 'Juan',
    lastName: 'Perez',
    phoneCountryCode: '+54',
    phoneNumber: '11 1234-5678',
    country: 'Argentina',
    company: 'Acme Inc',
  };

  it('accepts valid lead data', () => {
    const result = leadSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejects invalid email format', () => {
    const result = leadSchema.safeParse({
      ...validData,
      email: 'not-an-email',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toContain('email');
    }
  });

  it('rejects empty email', () => {
    const result = leadSchema.safeParse({
      ...validData,
      email: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty firstName', () => {
    const result = leadSchema.safeParse({
      ...validData,
      firstName: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty lastName', () => {
    const result = leadSchema.safeParse({
      ...validData,
      lastName: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty phoneNumber', () => {
    const result = leadSchema.safeParse({
      ...validData,
      phoneNumber: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty country', () => {
    const result = leadSchema.safeParse({
      ...validData,
      country: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty company', () => {
    const result = leadSchema.safeParse({
      ...validData,
      company: '',
    });
    expect(result.success).toBe(false);
  });

  it('trims valid data with extra spaces', () => {
    const result = leadSchema.safeParse({
      ...validData,
      email: '  test@example.com  ',
      firstName: '  Juan  ',
      lastName: '  Perez  ',
      phoneNumber: '  11 1234-5678  ',
      country: '  Argentina  ',
      company: '  Acme Inc  ',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('test@example.com');
      expect(result.data.firstName).toBe('Juan');
      expect(result.data.lastName).toBe('Perez');
      expect(result.data.phoneNumber).toBe('11 1234-5678');
      expect(result.data.country).toBe('Argentina');
      expect(result.data.company).toBe('Acme Inc');
    }
  });
});
