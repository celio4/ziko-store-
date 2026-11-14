import { describe, expect, it } from '@jest/globals';

import { formaterPrix } from '../prix';

describe('formaterPrix', () => {
  it('sépare les milliers par une espace et ajoute « FC »', () => {
    expect(formaterPrix(35000)).toBe('35 000 FC');
    expect(formaterPrix(87500)).toBe('87 500 FC');
  });

  it('gère les montants de plus de six chiffres', () => {
    expect(formaterPrix(115000)).toBe('115 000 FC');
    expect(formaterPrix(1250000)).toBe('1 250 000 FC');
    expect(formaterPrix(1000000000)).toBe('1 000 000 000 FC');
  });

  it("n'ajoute pas d'espace sous 1 000", () => {
    expect(formaterPrix(0)).toBe('0 FC');
    expect(formaterPrix(5)).toBe('5 FC');
    expect(formaterPrix(999)).toBe('999 FC');
    expect(formaterPrix(1000)).toBe('1 000 FC');
  });

  it('arrondit les montants décimaux', () => {
    expect(formaterPrix(1999.6)).toBe('2 000 FC');
    expect(formaterPrix(1999.4)).toBe('1 999 FC');
  });

  it('conserve le signe des montants négatifs', () => {
    expect(formaterPrix(-45000)).toBe('-45 000 FC');
    expect(formaterPrix(-0.2)).toBe('0 FC');
  });

  it("utilise une espace simple (pas d'espace insécable de Intl)", () => {
    expect(formaterPrix(32000)).not.toMatch(/[  ]/);
  });
});
