import { useMemo, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Switch, TextInput } from 'react-native-paper';
import { signOut } from 'firebase/auth';
import * as Haptics from 'expo-haptics';
import { auth } from '../../services/firebase';
import { useAppTheme, type BrandPreset } from '../../theme/AppThemeContext';
import { useUser } from '../../contexts/UserContext';
import { useSimpleMode } from '../../contexts/SimpleModeContext';
import ScreenHeader from '../../components/ScreenHeader';
import SurfaceCard from '../../components/SurfaceCard';
import { LANGUAGE_OPTIONS, useLanguage } from '../../contexts/LanguageContext';
import { CURRENCY_OPTIONS, FALLBACK_RATES, useCurrency } from '../../contexts/CurrencyContext';
import { snackbar } from '../../hooks/useSnackbar';
import { layout, radius, spacing, type } from '../../theme/tokens';

export default function Settings({ navigation }: { navigation: any }) {
  const { theme, themeName, brandPreset, toggleTheme, setBrandPreset } = useAppTheme();
  const { userData, isAdmin, canEdit } = useUser();
  const { t: tAll, tf, language, setLanguage } = useLanguage();
  const {
    currency,
    setCurrencyCode,
    rates,
    customRates,
    useCustomRates,
    setUseCustomRates,
    setCustomRate,
    getEffectiveRate,
    isLiveRates,
  } = useCurrency();
  const { simpleMode, setSimpleMode } = useSimpleMode();
  const t = tAll('settings');
  const tCommon = tAll('common');
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
  const [customRatesModalOpen, setCustomRatesModalOpen] = useState(false);
  const [customRateInputs, setCustomRateInputs] = useState<Record<string, string>>({});

  const showInventory = canEdit;
  const showCommodities = isAdmin;
  const showAuditLog = isAdmin;

  const handleLanguageChange = (next: (typeof LANGUAGE_OPTIONS)[number]['key']) => {
    if (next === language) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLanguage(next);
    setLanguageMenuOpen(false);
  };

  const handleCurrencyChange = (code: string) => {
    if (code === currency.code) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    void setCurrencyCode(code);
    setCurrencyMenuOpen(false);
  };

  const selectedLanguageLabel = LANGUAGE_OPTIONS.find((option) => option.key === language)?.label || 'English';

  const handleSimpleModeToggle = (next: boolean) => {
    if (next === simpleMode) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSimpleMode(next);
  };

  const handleSignOut = () => {
    Alert.alert(
      t.signOut,
      tCommon.signOutConfirm,
      [
        { text: tCommon.cancel, style: 'cancel' },
        {
          text: t.signOut,
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              snackbar.info(tCommon.signedOut);
            } catch (_e) {
              snackbar.error(tCommon.signOutFailed);
            }
          },
        },
      ]
    );
  };

  const brandOptions: { key: BrandPreset; label: string; color: string }[] = [
    { key: 'orange', label: (t as any).brandOrange || 'Burnt Orange', color: '#EA580C' },
    { key: 'emerald', label: (t as any).brandEmerald || 'Emerald Green', color: '#10B981' },
    { key: 'cobalt', label: (t as any).brandCobalt || 'Cobalt Blue', color: '#2563EB' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.contentWrap}>
        <ScreenHeader title={t.title} />

        <SurfaceCard style={styles.section}>
          <Text style={styles.sectionLabel}>{t.appearance}</Text>
          <SettingRow
            theme={theme}
            icon={themeName === 'dark' ? 'weather-night' : 'white-balance-sunny'}
            label={t.themeLabel}
            value={themeName === 'dark' ? t.themeDark : t.themeLight}
            onPress={toggleTheme}
            accessibilityLabel={tf('settings.themeAccessibility', {
              label: t.themeLabel,
              value: themeName === 'dark' ? t.themeDark : t.themeLight,
            })}
          />
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>{(t as any).brandLabel || 'Accent Color'}</Text>
            <View style={styles.brandRow}>
              {brandOptions.map((opt) => (
                <Pressable
                  key={opt.key}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    setBrandPreset(opt.key);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={opt.label}
                  style={({ pressed }) => [
                    styles.brandChip,
                    {
                      borderColor: brandPreset === opt.key ? theme.primary : theme.border,
                      backgroundColor: brandPreset === opt.key ? theme.primarySoft : theme.surface,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <View style={[styles.colorDot, { backgroundColor: opt.color }]} />
                  <Text
                    style={[
                      styles.brandChipText,
                      { color: brandPreset === opt.key ? theme.primary : theme.text, fontWeight: brandPreset === opt.key ? '700' : '500' },
                    ]}
                  >
                    {opt.label}
                  </Text>
                  {brandPreset === opt.key ? (
                    <MaterialCommunityIcons name="check" size={16} color={theme.primary} />
                  ) : null}
                </Pressable>
              ))}
            </View>
          </View>
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>{t.language}</Text>
            <Pressable
              onPress={() => setLanguageMenuOpen(true)}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.languagePicker,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text style={[styles.languagePickerText, { color: theme.text }]}>{selectedLanguageLabel}</Text>
              <MaterialCommunityIcons name="chevron-down" size={18} color={theme.muted} />
            </Pressable>
            <Modal visible={languageMenuOpen} transparent animationType="fade" onRequestClose={() => setLanguageMenuOpen(false)}>
              <Pressable style={styles.languageModalOverlay} onPress={() => setLanguageMenuOpen(false)}>
                <Pressable style={[styles.languageModalSheet, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  <View style={styles.modalHeader}>
                    <Text style={[styles.languageModalTitle, { color: theme.text }]}>{t.language}</Text>
                    <Pressable onPress={() => setLanguageMenuOpen(false)} hitSlop={8}>
                      <MaterialCommunityIcons name="close" size={20} color={theme.muted} />
                    </Pressable>
                  </View>
                  <ScrollView style={styles.languageList}>
                    {LANGUAGE_OPTIONS.map((option) => (
                      <Pressable
                        key={option.key}
                        onPress={() => handleLanguageChange(option.key)}
                        style={({ pressed }) => [
                          styles.languageOption,
                          {
                            backgroundColor: language === option.key ? theme.primary + '22' : 'transparent',
                            borderColor: language === option.key ? theme.primary : theme.border,
                            opacity: pressed ? 0.8 : 1,
                          },
                        ]}
                      >
                        <Text style={[styles.languageOptionText, { color: theme.text }]}>{option.label}</Text>
                        {language === option.key ? (
                          <MaterialCommunityIcons name="check" size={18} color={theme.primary} />
                        ) : null}
                      </Pressable>
                    ))}
                  </ScrollView>
                </Pressable>
              </Pressable>
            </Modal>
          </View>
          <View style={styles.field}>
            <View style={styles.currencyHeaderRow}>
              <Text style={styles.fieldLabel}>{t.currency || 'Currency'}</Text>
              <View style={styles.liveRateBadgeRow}>
                <MaterialCommunityIcons
                  name={useCustomRates ? 'pencil' : isLiveRates ? 'wifi' : 'wifi-off'}
                  size={13}
                  color={useCustomRates ? theme.primary : isLiveRates ? '#10B981' : theme.muted}
                />
                <Text
                  style={[
                    styles.liveRateText,
                    { color: useCustomRates ? theme.primary : isLiveRates ? '#10B981' : theme.muted },
                  ]}
                >
                  {useCustomRates
                    ? t.customRatesActive || 'Custom Rates Mode'
                    : isLiveRates
                    ? t.liveRatesActive || 'Live Rates'
                    : t.offlineRatesActive || 'Offline Rates'}
                </Text>
              </View>
            </View>
            <Pressable
              onPress={() => setCurrencyMenuOpen(true)}
              accessibilityRole="button"
              accessibilityLabel={`${t.currency || 'Currency'}: ${currency.label}`}
              style={({ pressed }) => [
                styles.languagePicker,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <View style={styles.currencyBadgeRow}>
                <View style={[styles.currencySymbolBadge, { backgroundColor: theme.primary + '22' }]}>
                  <Text style={[styles.currencySymbolText, { color: theme.primary }]}>{currency.symbol}</Text>
                </View>
                <Text style={[styles.languagePickerText, { color: theme.text }]}>{currency.label}</Text>
              </View>
              <MaterialCommunityIcons name="chevron-down" size={18} color={theme.muted} />
            </Pressable>
            <Modal visible={currencyMenuOpen} transparent animationType="fade" onRequestClose={() => setCurrencyMenuOpen(false)}>
              <Pressable style={styles.languageModalOverlay} onPress={() => setCurrencyMenuOpen(false)}>
                <Pressable style={[styles.languageModalSheet, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                  <View style={styles.modalHeader}>
                    <Text style={[styles.languageModalTitle, { color: theme.text }]}>{t.selectCurrency || t.currency || 'Currency'}</Text>
                    <Pressable onPress={() => setCurrencyMenuOpen(false)} hitSlop={8}>
                      <MaterialCommunityIcons name="close" size={20} color={theme.muted} />
                    </Pressable>
                  </View>
                  <ScrollView style={styles.languageList}>
                    {CURRENCY_OPTIONS.map((option) => {
                      const effRate = getEffectiveRate(option.code);
                      const isCustom = useCustomRates && customRates[option.code] && customRates[option.code] > 0;
                      return (
                        <Pressable
                          key={option.code}
                          onPress={() => handleCurrencyChange(option.code)}
                          style={({ pressed }) => [
                            styles.languageOption,
                            {
                              backgroundColor: currency.code === option.code ? theme.primary + '22' : 'transparent',
                              borderColor: currency.code === option.code ? theme.primary : theme.border,
                              opacity: pressed ? 0.8 : 1,
                            },
                          ]}
                        >
                          <View style={styles.currencyOptionBadgeRow}>
                            <View style={[styles.currencySymbolBadge, { backgroundColor: currency.code === option.code ? theme.primary : theme.border + '40' }]}>
                              <Text style={[styles.currencySymbolText, { color: currency.code === option.code ? '#FFFFFF' : theme.text }]}>{option.symbol}</Text>
                            </View>
                            <View style={styles.currencyOptionTextWrap}>
                              <Text style={[styles.languageOptionText, { color: theme.text, fontWeight: currency.code === option.code ? '700' : '400' }]}>{option.label}</Text>
                              <Text style={[styles.currencyRatePreviewText, { color: isCustom ? theme.primary : theme.muted }]}>
                                {`1 USD = ${effRate.toFixed(2)} ${option.code}${isCustom ? ' (Custom)' : ''}`}
                              </Text>
                            </View>
                          </View>
                          {currency.code === option.code ? (
                            <MaterialCommunityIcons name="check-circle" size={20} color={theme.primary} />
                          ) : null}
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </Pressable>
              </Pressable>
            </Modal>
          </View>

          <View style={[styles.simpleRow, { borderTopColor: theme.border }]}>
            <View style={styles.simpleText}>
              <Text style={[styles.simpleLabel, { color: theme.text }]}>{t.useCustomRates || 'Custom Rates Mode'}</Text>
              <Text style={[styles.simpleHelper, { color: theme.muted }]}>{t.useCustomRatesHelper || 'Enable manual override for currency exchange rates'}</Text>
            </View>
            <Switch
              value={useCustomRates}
              onValueChange={(val) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                void setUseCustomRates(val);
              }}
              color={theme.primary}
              accessibilityLabel={t.useCustomRates}
            />
          </View>

          {useCustomRates ? (
            <View style={{ marginTop: spacing.md }}>
              <Pressable
                onPress={() => setCustomRatesModalOpen(true)}
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.manageCustomBtn,
                  {
                    borderColor: theme.primary,
                    backgroundColor: theme.primary + '12',
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <MaterialCommunityIcons name="currency-usd" size={18} color={theme.primary} />
                <Text style={[styles.manageCustomBtnText, { color: theme.primary }]}>
                  {t.manageCustomRates || 'Manage Custom Exchange Rates'}
                </Text>
              </Pressable>
            </View>
          ) : null}

          <Modal visible={customRatesModalOpen} transparent animationType="fade" onRequestClose={() => setCustomRatesModalOpen(false)}>
            <Pressable style={styles.languageModalOverlay} onPress={() => setCustomRatesModalOpen(false)}>
              <Pressable style={[styles.languageModalSheet, { backgroundColor: theme.surface, borderColor: theme.border, maxHeight: '80%' }]}>
                <View style={styles.modalHeader}>
                  <View>
                    <Text style={[styles.languageModalTitle, { color: theme.text }]}>{t.customRateTitle || 'Set Custom Rates'}</Text>
                    <Text style={[{ fontSize: 12, color: theme.muted, marginTop: 2 }]}>{t.customRateSubtitle || 'Override 1 USD exchange rate'}</Text>
                  </View>
                  <Pressable onPress={() => setCustomRatesModalOpen(false)} hitSlop={8}>
                    <MaterialCommunityIcons name="close" size={20} color={theme.muted} />
                  </Pressable>
                </View>
                <ScrollView style={styles.languageList}>
                  {CURRENCY_OPTIONS.filter((c) => c.code !== 'USD').map((option) => {
                    const currentCustom = customRates[option.code] ? String(customRates[option.code]) : '';
                    return (
                      <View key={option.code} style={[styles.customRateInputRow, { borderColor: theme.border }]}>
                        <View style={styles.customRateLabelWrap}>
                          <Text style={[styles.customRateCodeText, { color: theme.text }]}>{option.code} ({option.symbol})</Text>
                          <Text style={[{ fontSize: 11, color: theme.muted }]}>{option.label}</Text>
                        </View>
                        <View style={styles.customRateInputWrap}>
                          <Text style={[{ fontSize: 12, color: theme.muted }]}>1 USD =</Text>
                          <TextInput
                            dense
                            mode="outlined"
                            keyboardType="numeric"
                            placeholder={String(rates[option.code] || FALLBACK_RATES[option.code] || '')}
                            value={customRateInputs[option.code] ?? currentCustom}
                            onChangeText={(text) => {
                              setCustomRateInputs((prev) => ({ ...prev, [option.code]: text }));
                            }}
                            onBlur={() => {
                              const val = parseFloat(customRateInputs[option.code] ?? '');
                              if (!isNaN(val) && val > 0) {
                                void setCustomRate(option.code, val);
                                snackbar.info(`Set ${option.code} rate: 1 USD = ${val}`);
                              } else if (customRateInputs[option.code] === '') {
                                void setCustomRate(option.code, null);
                              }
                            }}
                            style={styles.customRateTextInput}
                          />
                        </View>
                      </View>
                    );
                  })}
                </ScrollView>
                <Pressable
                  onPress={() => setCustomRatesModalOpen(false)}
                  style={({ pressed }) => [styles.doneBtn, { backgroundColor: theme.primary, opacity: pressed ? 0.9 : 1 }]}
                >
                  <Text style={styles.doneBtnText}>{tCommon.confirm || 'Done'}</Text>
                </Pressable>
              </Pressable>
            </Pressable>
          </Modal>
          <View style={[styles.simpleRow, { borderTopColor: theme.border }]}>
            <View style={styles.simpleText}>
              <Text style={[styles.simpleLabel, { color: theme.text }]}>{t.simpleMode}</Text>
              <Text style={[styles.simpleHelper, { color: theme.muted }]}>{t.simpleModeHelper}</Text>
            </View>
            <Switch
              value={simpleMode}
              onValueChange={handleSimpleModeToggle}
              color={theme.primary}
              accessibilityLabel={t.simpleMode}
            />
          </View>
        </SurfaceCard>

        <SurfaceCard style={styles.section}>
          <Text style={styles.sectionLabel}>{t.account}</Text>
          <SettingRow
            theme={theme}
            icon="account-circle-outline"
            label={t.signedInAs}
            value={userData?.name || userData?.email || t.emptyValue}
          />
          <SettingRow
            theme={theme}
            icon="shield-account-outline"
            label={t.role}
            value={
              userData?.role === 'admin' ? t.admin :
              userData?.role === 'staff' ? t.staff :
              t.viewer
            }
          />
        </SurfaceCard>

        <SurfaceCard style={styles.section}>
          <Text style={styles.sectionLabel}>{t.actions}</Text>
          {showInventory ? (
            <SettingRow
              theme={theme}
              icon="warehouse"
              label={t.adminInventory}
              onPress={() => navigation.navigate('AdminInventory')}
              showChevron
            />
          ) : null}
          {showCommodities ? (
            <SettingRow
              theme={theme}
              icon="package-variant-closed"
              label={t.commodities}
              onPress={() => navigation.navigate('Commodities')}
              showChevron
            />
          ) : null}
          {showCommodities ? (
            <SettingRow
              theme={theme}
              icon="file-document-outline"
              label={t.templates}
              onPress={() => navigation.navigate('Templates')}
              showChevron
            />
          ) : null}
          {showAuditLog ? (
            <SettingRow
              theme={theme}
              icon="history"
              label={t.auditLog}
              onPress={() => navigation.navigate('AuditLog')}
              showChevron
            />
          ) : null}
        </SurfaceCard>

        <Pressable
          onPress={handleSignOut}
          accessibilityRole="button"
          accessibilityLabel={t.signOut}
          style={({ pressed }) => [styles.signOutBtn, pressed && { opacity: 0.85 }]}
        >
          <MaterialCommunityIcons name="logout" size={20} color={theme.danger} />
          <Text style={styles.signOutText}>{t.signOut}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function SettingRow({
  theme,
  icon,
  label,
  value,
  onPress,
  showChevron,
  accessibilityLabel,
}: {
  theme: any;
  icon: any;
  label: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
  accessibilityLabel?: string;
}) {
  const interactive = !!onPress;
  const Wrap = interactive ? Pressable : View;
  return (
    <Wrap
      onPress={onPress as any}
      accessibilityRole={interactive ? 'button' : 'text'}
      accessibilityLabel={accessibilityLabel || (value ? `${label}: ${value}` : label)}
      style={({ pressed }: { pressed: boolean }): StyleProp<ViewStyle> => [
        rowStyles.row,
        pressed && { opacity: 0.7 },
      ]}
    >
      <MaterialCommunityIcons name={icon as any} size={22} color={theme.primary} />
      <View style={rowStyles.textWrap}>
        <Text style={[rowStyles.label, { color: theme.muted }]}>{label}</Text>
        {value ? <Text style={[rowStyles.value, { color: theme.text }]}>{value}</Text> : null}
      </View>
      {showChevron ? (
        <MaterialCommunityIcons name="chevron-right" size={20} color={theme.muted} />
      ) : null}
    </Wrap>
  );
}

const rowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  textWrap: { flex: 1 },
  label: { ...type.caption, marginBottom: 2 },
  value: { ...type.bodyStrong },
});

function createStyles(theme) {
  return StyleSheet.create({
    screen: { flexGrow: 1, backgroundColor: theme.background, paddingBottom: spacing.xxl },
    contentWrap: { width: '100%', maxWidth: layout.maxContentWidth, alignSelf: 'center', padding: spacing.md },
    section: { marginBottom: spacing.lg, padding: spacing.lg },
    sectionLabel: {
      ...type.eyebrow,
      color: theme.primary,
      marginBottom: spacing.sm,
    },
    field: { marginTop: spacing.md },
    fieldLabel: {
      ...type.eyebrow,
      color: theme.muted,
      marginBottom: spacing.sm,
    },
    brandRow: {
      flexDirection: 'row',
      gap: spacing.sm,
      flexWrap: 'wrap',
    },
    brandChip: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.md,
      borderWidth: 1,
      minHeight: 40,
    },
    colorDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    brandChipText: {
      ...type.caption,
      fontSize: 13,
    },
    languagePicker: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      minHeight: 48,
    },
    languagePickerText: {
      ...type.bodyStrong,
      flex: 1,
    },
    languageModalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.45)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.lg,
    },
    languageModalSheet: {
      width: '100%',
      maxWidth: 420,
      borderWidth: 1,
      borderRadius: radius.lg,
      padding: spacing.md,
      maxHeight: '70%',
    },
    languageModalTitle: {
      ...type.eyebrow,
      marginBottom: 0,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.md,
      paddingBottom: spacing.xs,
    },
    currencyHeaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.xs,
    },
    liveRateBadgeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    liveRateText: {
      ...type.caption,
      fontSize: 11,
      fontWeight: '600',
    },
    currencyBadgeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      flex: 1,
    },
    currencyOptionBadgeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      flex: 1,
    },
    currencyOptionTextWrap: {
      flex: 1,
    },
    currencyRatePreviewText: {
      ...type.caption,
      fontSize: 11,
      marginTop: 1,
    },
    currencySymbolBadge: {
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    currencySymbolText: {
      fontSize: 13,
      fontWeight: '700',
    },
    languageList: {
      maxHeight: 420,
    },
    languageOption: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderRadius: radius.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      marginBottom: spacing.sm,
    },
    languageOptionText: {
      ...type.body,
      flex: 1,
    },
    // P32: simple-mode toggle row. A horizontal flex with the
    // label + helper on the left and the Switch on the right.
    // A 1px top border separates it visually from the language
    // picker above.
    manageCustomBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: radius.md,
      borderWidth: 1,
      minHeight: 40,
    },
    manageCustomBtnText: {
      ...type.bodyStrong,
      fontSize: 13,
    },
    customRateInputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      gap: spacing.sm,
    },
    customRateLabelWrap: {
      flex: 1,
    },
    customRateCodeText: {
      ...type.bodyStrong,
      fontSize: 14,
    },
    customRateInputWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    customRateTextInput: {
      width: 90,
      height: 40,
      fontSize: 13,
    },
    doneBtn: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.md,
      borderRadius: radius.md,
      marginTop: spacing.md,
    },
    doneBtnText: {
      ...type.bodyStrong,
      color: '#FFFFFF',
    },
    simpleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: spacing.md,
      paddingTop: spacing.md,
      marginTop: spacing.md,
      borderTopWidth: 1,
    },
    simpleText: { flex: 1 },
    simpleLabel: { ...type.bodyStrong },
    simpleHelper: { ...type.caption, marginTop: 2 },
    signOutBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.md,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: theme.danger,
      backgroundColor: theme.dangerSoft,
      minHeight: 48,
    },
    signOutText: {
      ...type.bodyStrong,
      color: theme.danger,
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
  });
}
