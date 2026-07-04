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

    // nenhum item hoje declara `feature`, então nada deve ser removido por essa regra
    expect(labels).toEqual(expect.arrayContaining(['Dashboard', 'Charts', 'UI Elements', 'Maps']));
  });
});
