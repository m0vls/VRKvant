import { describe, it, expect, vi } from 'vitest';
import { calculateNextOrder, getUniqueModules } from '../js/ui.js';

// Мокаем зависимости ui.js, которые не нужны для чистой логики
vi.mock('../js/api.js', () => ({}));
vi.mock('../js/progress.js', () => ({}));
vi.mock('../js/store.js', () => ({ store: {} }));

describe('Editor Automation Logic', () => {
  
  describe('calculateNextOrder()', () => {
    it('should return 10 for empty lessons list', () => {
      const lessons = [];
      const nextOrder = calculateNextOrder(lessons);
      expect(nextOrder).toBe(10);
    });

    it('should return max order + 10', () => {
      const lessons = [
        { order: 10 },
        { order: 25 },
        { order: 5 }
      ];
      const nextOrder = calculateNextOrder(lessons);
      expect(nextOrder).toBe(35);
    });

    it('should handle string orders and still return a number', () => {
      const lessons = [{ order: "20" }];
      const nextOrder = calculateNextOrder(lessons);
      expect(nextOrder).toBe(30);
    });
  });

  describe('getUniqueModules()', () => {
    it('should extract unique modules from lessons list', () => {
      const lessons = [
        { module: 'Основы' },
        { module: 'Моделирование' },
        { module: 'Основы' },
        { module: '' },
        { module: '  ' },
        { module: undefined },
        { module: null }
      ];
      const modules = getUniqueModules(lessons);
      expect(modules).toContain('Основы');
      expect(modules).toContain('Моделирование');
      expect(modules).toHaveLength(2);
    });
  });
});
