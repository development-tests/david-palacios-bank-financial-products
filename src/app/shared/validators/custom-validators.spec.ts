import { AbstractControl } from '@angular/forms';
import { urlValidator, futureOrTodayDateValidator, oneYearAfterValidator } from './custom-validators';

describe('Custom Validators', () => {
  describe('urlValidator', () => {
    it('should return null for valid URL', () => {
      const control = { value: 'https://example.com' } as AbstractControl;
      expect(urlValidator(control)).toBeNull();
    });
    it('should return invalidUrl for invalid URL', () => {
      const control = { value: 'not a url' } as AbstractControl;
      expect(urlValidator(control)).toEqual({ invalidUrl: true });
    });
  });

  describe('futureOrTodayDateValidator', () => {
    it('should accept today or future date', () => {
      const today = new Date().toISOString().split('T')[0];
      const control = { value: today } as AbstractControl;
      expect(futureOrTodayDateValidator(control)).toBeNull();
    });
    it('should reject past date', () => {
      const control = { value: '2000-01-01' } as AbstractControl;
      expect(futureOrTodayDateValidator(control)).toEqual({ pastDate: true });
    });
  });

  describe('oneYearAfterValidator', () => {
    it('should return null if revision is exactly one year after release', () => {
      const group = {
        get: (field: string) => ({ value: field === 'date_release' ? '2025-01-01' : '2026-01-01' })
      } as AbstractControl;
      expect(oneYearAfterValidator(group)).toBeNull();
    });
    it('should return invalidRevision if not exactly one year', () => {
      const group = {
        get: (field: string) => ({ value: field === 'date_release' ? '2025-01-01' : '2025-12-31' })
      } as AbstractControl;
      expect(oneYearAfterValidator(group)).toEqual({ invalidRevision: true });
    });
  });
});
