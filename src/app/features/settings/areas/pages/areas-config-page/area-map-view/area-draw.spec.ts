import { closePolygonCoordinates, isCloseEnoughToClose } from './area-draw';

describe('area-draw', () => {
  describe('isCloseEnoughToClose', () => {
    it('is false when fewer than 3 points have been placed, even right on top of the first point', () => {
      expect(isCloseEnoughToClose({ x: 100, y: 100 }, { x: 100, y: 100 }, 2)).toBe(false);
    });

    it('is true when within tolerance and at least 3 points exist', () => {
      expect(isCloseEnoughToClose({ x: 104, y: 100 }, { x: 100, y: 100 }, 3)).toBe(true);
    });

    it('is false when outside tolerance', () => {
      expect(isCloseEnoughToClose({ x: 200, y: 200 }, { x: 100, y: 100 }, 3)).toBe(false);
    });

    it('respects a custom tolerance', () => {
      expect(isCloseEnoughToClose({ x: 130, y: 100 }, { x: 100, y: 100 }, 3, 40)).toBe(true);
      expect(isCloseEnoughToClose({ x: 130, y: 100 }, { x: 100, y: 100 }, 3, 10)).toBe(false);
    });
  });

  describe('closePolygonCoordinates', () => {
    it('appends the first coordinate as the last one', () => {
      const points = [
        { lat: -23.952, lon: -46.33 },
        { lat: -23.949, lon: -46.328 },
        { lat: -23.9505, lon: -46.325 },
      ];

      expect(closePolygonCoordinates(points)).toEqual([...points, points[0]]);
    });

    it('returns an empty array unchanged', () => {
      expect(closePolygonCoordinates([])).toEqual([]);
    });
  });
});
