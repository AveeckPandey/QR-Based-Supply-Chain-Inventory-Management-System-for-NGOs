import { LANGUAGE_OPTIONS } from '../src/contexts/LanguageContext.tsx';
import { strings as en } from '../src/i18n/strings';
import { merged as hi } from '../src/i18n/strings.hi';
import { merged as bn } from '../src/i18n/strings.bn';
import { merged as ne } from '../src/i18n/strings.ne';
import { merged as si } from '../src/i18n/strings.si';
import { merged as ar } from '../src/i18n/strings.ar';
import { merged as es } from '../src/i18n/strings.es';
import { merged as fr } from '../src/i18n/strings.fr';
import { merged as sw } from '../src/i18n/strings.sw';
import { merged as pt } from '../src/i18n/strings.pt';
import { merged as id } from '../src/i18n/strings.id';
import { merged as ms } from '../src/i18n/strings.ms';
import { merged as fil } from '../src/i18n/strings.fil';
import { merged as it } from '../src/i18n/strings.it';
import { merged as ts } from '../src/i18n/strings.tn';
import { merged as lg } from '../src/i18n/strings.lg';
import { merged as yo } from '../src/i18n/strings.yo';
import { merged as zu } from '../src/i18n/strings.zu';
import { merged as mg } from '../src/i18n/strings.mg';
import { merged as ny } from '../src/i18n/strings.ny';

describe('HopeBox Internationalization (i18n)', () => {
  const catalogs: Record<string, Record<string, any>> = {
    en, hi, bn, ne, si, ar, es, fr, sw, pt, id, ms, fil, it, ts, lg, yo, zu, mg, ny
  };

  test('All 20 languages are defined in LANGUAGE_OPTIONS', () => {
    expect(LANGUAGE_OPTIONS.length).toBe(20);
    const keys = LANGUAGE_OPTIONS.map((l) => l.key);
    expect(keys).toContain('en');
    expect(keys).toContain('hi');
    expect(keys).toContain('bn');
    expect(keys).toContain('ar');
    expect(keys).toContain('sw');
    expect(keys).toContain('es');
    expect(keys).toContain('fr');
  });

  test('Every language has a valid, non-empty translation catalog', () => {
    LANGUAGE_OPTIONS.forEach((opt) => {
      const cat = catalogs[opt.key];
      expect(cat).toBeDefined();
      expect(typeof cat).toBe('object');
      expect(cat.app).toBeDefined();
      expect(cat.auth).toBeDefined();
      expect(cat.dashboard).toBeDefined();
      expect(cat.common).toBeDefined();
    });
  });

  test('Core keys (app name, signIn, dashboard title, save) return localized strings', () => {
    expect(catalogs.en.app.name).toContain('HopeBox');
    expect(catalogs.hi.app.name).toBe('होपबॉक्स');
    expect(catalogs.bn.app.name).toContain('হোপবক্স');
    expect(catalogs.ar.dashboard.title).toBe('لوحة التحكم');
    expect(catalogs.es.dashboard.title).toBe('Panel de Control');
    expect(catalogs.fr.dashboard.title).toBe('Tableau de Bord');
    expect(catalogs.sw.dashboard.title).toBe('Dawati Kuu (Dashboard)');
  });

  test('Navigation bar labels return localized strings for bottom tab bar', () => {
    expect(catalogs.hi.nav.home).toBe('होम');
    expect(catalogs.hi.nav.boxes).toBe('बॉक्सेस');
    expect(catalogs.hi.nav.scan).toBe('स्कैन');
    expect(catalogs.bn.nav.home).toBe('হোম');
    expect(catalogs.es.nav.home).toBe('Inicio');
    expect(catalogs.fr.nav.home).toBe('Accueil');
    expect(catalogs.ar.nav.home).toBe('الرئيسية');
  });

  test('Commodity names, units, and audit actions map cleanly across catalogs', () => {
    expect(catalogs.hi.commodityNames.commodity_rice).toContain('चावल');
    expect(catalogs.hi.units.kg).toBe('किग्रा');
    expect(catalogs.hi.auditActions.export_csv).toBe('CSV निर्यात');
    expect(catalogs.bn.units.kg).toBe('কেজি');
    expect(catalogs.es.units.kg).toBe('kg');
    expect(catalogs.fr.units.kg).toBe('kg');
    expect(catalogs.ar.units.kg).toBe('كجم');
  });
});
