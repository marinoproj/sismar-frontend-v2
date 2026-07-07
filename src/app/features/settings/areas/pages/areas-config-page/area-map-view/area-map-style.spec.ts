import { areaLabelHtml, areaPolygonStyle } from './area-map-style';

describe('area-map-style', () => {
  describe('areaPolygonStyle', () => {
    it('returns solid green for active areas', () => {
      expect(areaPolygonStyle(true)).toEqual({ color: '#22c55e' });
    });

    it('returns dashed gray for inactive areas', () => {
      expect(areaPolygonStyle(false)).toEqual({ color: '#9ca3af', dashArray: '6 4' });
    });
  });

  describe('areaLabelHtml', () => {
    it('renders just the escaped name for active areas, without a badge', () => {
      const html = areaLabelHtml('Fundeio <Norte>', true);
      expect(html).toContain('Fundeio &lt;Norte&gt;');
      expect(html).not.toContain('Inativo');
    });

    it('appends an "Inativo" badge for inactive areas', () => {
      const html = areaLabelHtml('Canal de Acesso', false);
      expect(html).toContain('Canal de Acesso');
      expect(html).toContain('Inativo');
    });
  });
});
