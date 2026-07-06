import { getNavSections } from './nav-items';

describe('getNavSections', () => {
  it('hides demo pages in production', () => {
    const devSections = getNavSections({ production: false, hasFeature: () => true });
    const prodSections = getNavSections({ production: true, hasFeature: () => true });

    const devLabels = devSections.flatMap((s) => s.items.map((i) => i.label));
    const prodLabels = prodSections.flatMap((s) => s.items.map((i) => i.label));

    expect(devLabels).toEqual(expect.arrayContaining(['Dashboard', 'Charts', 'UI Elements', 'Maps']));
    expect(prodLabels).not.toEqual(expect.arrayContaining(['Dashboard', 'Charts', 'UI Elements', 'Maps']));
  });

  it('keeps non-demo items regardless of environment', () => {
    const prodSections = getNavSections({ production: true, hasFeature: () => true });
    const prodLabels = prodSections.flatMap((s) => s.items.map((i) => i.label));

    expect(prodLabels).toEqual(expect.arrayContaining(['Configurações']));
  });

  it('hides items whose required feature the user does not have', () => {
    const sections = getNavSections({ production: false, hasFeature: () => false });
    const labels = sections.flatMap((s) => s.items.map((i) => i.label));

    expect(labels).toEqual(expect.arrayContaining(['Dashboard', 'Charts', 'UI Elements', 'Maps']));
    expect(labels).not.toEqual(expect.arrayContaining(['Portos']));
  });

  it('hides child items whose required feature the user does not have', () => {
    const sections = getNavSections({ production: false, hasFeature: () => false });
    const settings = sections.flatMap((s) => s.items).find((i) => i.label === 'Configurações');

    expect(settings).toBeUndefined();
  });

  it('shows only the child items whose feature the user has, keeping the parent group visible', () => {
    const sections = getNavSections({
      production: false,
      hasFeature: (feature) => feature === 'CONFIGURACAO_PORTO',
    });
    const settings = sections.flatMap((s) => s.items).find((i) => i.label === 'Configurações');

    expect(settings?.children?.map((c) => c.label)).toEqual(['Portos']);
  });

  it('shows all Configurações children when the user has every feature', () => {
    const sections = getNavSections({ production: false, hasFeature: () => true });
    const settings = sections.flatMap((s) => s.items).find((i) => i.label === 'Configurações');

    expect(settings?.children?.map((c) => c.label)).toEqual(['Portos', 'Terminais', 'Berços']);
  });
});
