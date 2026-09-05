import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TextInput } from 'react-native-paper';
import * as Haptics from 'expo-haptics';

import { useAppTheme } from '../../theme/AppThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { REGIONAL_RATION_PRESETS, type RegionPreset } from '../../services/rationPresets';
import {
  calculateCookedOutputKg,
  calculateFoodRequiredKg,
  calculateMeatProteinOffsetKg,
  calculatePeopleServedFromStock,
} from '../../services/rationMath';
import { exportToCSV, exportToPDF } from '../../services/export';
import { snackbar } from '../../hooks/useSnackbar';
import { useWarehouse } from '../../contexts/WarehouseContext';

import ScreenHeader from '../../components/ScreenHeader';
import SurfaceCard from '../../components/SurfaceCard';
import MetricTile from '../../components/MetricTile';
import FadeInUp from '../../components/FadeInUp';
import AmbientGlow from '../../components/AmbientGlow';
import { layout, radius, spacing, type } from '../../theme/tokens';

export default function RationCalculator({ navigation }) {
  const { theme } = useAppTheme();
  const { currentWarehouse } = useWarehouse();
  const { t: tAll } = useLanguage();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // Mode: 'dry_ration' (Boxes/Kits) vs 'hot_kitchen' (Cooked Cauldrons)
  const [calcMode, setCalcMode] = useState<'dry_ration' | 'hot_kitchen'>('dry_ration');
  const [selectedRegionId, setSelectedRegionId] = useState<string>('south_asia');
  const [peopleCountText, setPeopleCountText] = useState<string>('1000');
  const [durationDaysText, setDurationDaysText] = useState<string>('7');
  const [wasteMarginPctText, setWasteMarginPctText] = useState<string>('5');
  const [freshMeatDonationKgText, setFreshMeatDonationKgText] = useState<string>('');

  const region = useMemo<RegionPreset>(
    () => REGIONAL_RATION_PRESETS.find((r) => r.id === selectedRegionId) || REGIONAL_RATION_PRESETS[0],
    [selectedRegionId]
  );

  const peopleCount = Number(peopleCountText) || 0;
  const durationDays = Number(durationDaysText) || 0;
  const wasteMargin = (Number(wasteMarginPctText) || 0) / 100;
  const freshMeatKg = Number(freshMeatDonationKgText) || 0;

  // Calculate meat offset
  const meatProteinOffsetKg = useMemo(() => calculateMeatProteinOffsetKg(freshMeatKg), [freshMeatKg]);

  // Perform Calculations across items
  const calculations = useMemo(() => {
    return region.staples.map((staple) => {
      const gramPerServing = calcMode === 'dry_ration' ? staple.fullReliefGramPerDay : staple.singleMealGram;
      const requiredKg = calculateFoodRequiredKg(peopleCount, gramPerServing, durationDays, wasteMargin);

      // Apply protein offset if dal/beans/staple is pulse
      const isPulse = staple.id.includes('dal') || staple.id.includes('bean') || staple.id.includes('csb');
      const netRequiredKg = isPulse ? Math.max(0, Number((requiredKg - meatProteinOffsetKg).toFixed(2))) : requiredKg;

      const cookedOutputKg = calculateCookedOutputKg(netRequiredKg, staple.yieldKey);
      const capacityPeople = calculatePeopleServedFromStock(netRequiredKg, gramPerServing, durationDays, wasteMargin);

      return {
        ...staple,
        gramPerServing,
        requiredKg,
        netRequiredKg,
        cookedOutputKg,
        capacityPeople,
      };
    });
  }, [region, calcMode, peopleCount, durationDays, wasteMargin, meatProteinOffsetKg]);

  const handleExportPO = async (format: 'csv' | 'pdf') => {
    if (calculations.length === 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const poRows = calculations.map((c) => ({
      Region: region.name,
      Mode: calcMode === 'dry_ration' ? 'Dry Ration' : 'Hot Kitchen',
      Commodity: c.name,
      Beneficiaries: peopleCount,
      Days: durationDays,
      GramPerServing: `${c.gramPerServing}g`,
      GrossRequiredKg: c.requiredKg,
      NetProcurementKg: c.netRequiredKg,
      CookedYieldKg: c.cookedOutputKg,
      WasteMargin: `${wasteMargin * 100}%`,
      DonorMeatOffsetKg: meatProteinOffsetKg,
    }));

    try {
      if (format === 'csv') {
        await exportToCSV(poRows, `Procurement-Order-${region.id}-${Date.now()}`);
        snackbar.success('Procurement Order CSV Exported');
      } else {
        await exportToPDF(poRows, `Ration Procurement Order (${region.name})`, `procurement-order-${Date.now()}`);
        snackbar.success('Procurement Order PDF Exported');
      }
    } catch (_err) {
      snackbar.error('Could not export procurement order');
    }
  };

  return (
    <View style={styles.screen}>
      <AmbientGlow variant="dual" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.contentWrap}>
          <FadeInUp delay={0}>
            <ScreenHeader
              eyebrow="HUMANITARIAN LOGISTICS"
              title="Ration & Supplier Calculator"
              subtitle="WFP / Sphere Standard formulas with yield multipliers and donor inflow offsets."
            />
          </FadeInUp>

          {/* Mode Switcher */}
          <FadeInUp delay={40}>
            <View style={styles.modeRow}>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setCalcMode('dry_ration');
                }}
                style={[
                  styles.modeBtn,
                  calcMode === 'dry_ration' && { backgroundColor: theme.primary, borderColor: theme.primary },
                  calcMode !== 'dry_ration' && { backgroundColor: theme.surfaceRaised, borderColor: theme.border },
                ]}
              >
                <MaterialCommunityIcons
                  name="package-variant-closed"
                  size={18}
                  color={calcMode === 'dry_ration' ? theme.primaryText : theme.text}
                />
                <Text
                  style={[
                    styles.modeBtnText,
                    { color: calcMode === 'dry_ration' ? theme.primaryText : theme.text },
                  ]}
                >
                  Dry Rations (2,100 kcal)
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setCalcMode('hot_kitchen');
                }}
                style={[
                  styles.modeBtn,
                  calcMode === 'hot_kitchen' && { backgroundColor: theme.primary, borderColor: theme.primary },
                  calcMode !== 'hot_kitchen' && { backgroundColor: theme.surfaceRaised, borderColor: theme.border },
                ]}
              >
                <MaterialCommunityIcons
                  name="pot-steam-outline"
                  size={18}
                  color={calcMode === 'hot_kitchen' ? theme.primaryText : theme.text}
                />
                <Text
                  style={[
                    styles.modeBtnText,
                    { color: calcMode === 'hot_kitchen' ? theme.primaryText : theme.text },
                  ]}
                >
                  Hot Kitchen (700 kcal)
                </Text>
              </Pressable>
            </View>
          </FadeInUp>

          {/* Region Preset Selector */}
          <FadeInUp delay={80}>
            <SurfaceCard padding={spacing.lg}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>1. Select Target Region & Meals</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.regionScroll}>
                {REGIONAL_RATION_PRESETS.map((r) => {
                  const selected = r.id === selectedRegionId;
                  return (
                    <Pressable
                      key={r.id}
                      onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        setSelectedRegionId(r.id);
                      }}
                      style={[
                        styles.regionChip,
                        {
                          borderColor: selected ? theme.primary : theme.border,
                          backgroundColor: selected ? theme.primarySoft : theme.backgroundAlt,
                        },
                      ]}
                    >
                      <Text style={[styles.regionChipName, { color: selected ? theme.primary : theme.text }]}>{r.name}</Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

              <View style={[styles.regionInfoBox, { backgroundColor: theme.backgroundAlt, borderColor: theme.border }]}>
                <Text style={[styles.regionSubtext, { color: theme.muted }]}>{region.subregionText}</Text>
                <Text style={[styles.typicalMealsLabel, { color: theme.text }]}>Typical NGO Meals Served:</Text>
                <Text style={[styles.typicalMealsText, { color: theme.primary }]}>{region.typicalMeals.join(' · ')}</Text>
              </View>
            </SurfaceCard>
          </FadeInUp>

          {/* Campaign Input Variables */}
          <FadeInUp delay={120}>
            <SurfaceCard padding={spacing.lg}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>2. Campaign Parameters</Text>
              <View style={styles.inputsGrid}>
                <View style={styles.inputWrap}>
                  <Text style={[styles.fieldLabel, { color: theme.muted }]}>People / Beneficiaries (N)</Text>
                  <TextInput
                    mode="outlined"
                    value={peopleCountText}
                    onChangeText={(t) => setPeopleCountText(t.replace(/[^0-9]/g, ''))}
                    keyboardType="numeric"
                    style={styles.textInput}
                    outlineColor={theme.border}
                    activeOutlineColor={theme.primary}
                    textColor={theme.text}
                  />
                </View>

                <View style={styles.inputWrap}>
                  <Text style={[styles.fieldLabel, { color: theme.muted }]}>Duration (Days / Meals)</Text>
                  <TextInput
                    mode="outlined"
                    value={durationDaysText}
                    onChangeText={(t) => setDurationDaysText(t.replace(/[^0-9]/g, ''))}
                    keyboardType="numeric"
                    style={styles.textInput}
                    outlineColor={theme.border}
                    activeOutlineColor={theme.primary}
                    textColor={theme.text}
                  />
                </View>

                <View style={styles.inputWrapFull}>
                  <Text style={[styles.fieldLabel, { color: theme.muted }]}>Waste & Spoilage Margin (%)</Text>
                  <TextInput
                    mode="outlined"
                    value={wasteMarginPctText}
                    onChangeText={(t) => setWasteMarginPctText(t.replace(/[^0-9.]/g, ''))}
                    keyboardType="numeric"
                    style={styles.textInput}
                    outlineColor={theme.border}
                    activeOutlineColor={theme.primary}
                    textColor={theme.text}
                  />
                </View>
              </View>
            </SurfaceCard>
          </FadeInUp>

          {/* Custom Donor Inflow (Fresh Meat / Unplanned Donated Items) */}
          <FadeInUp delay={160}>
            <SurfaceCard padding={spacing.lg}>
              <View style={styles.cardHeaderRow}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>3. Donated Inflow (+) (Fresh Meat / Surplus)</Text>
                <MaterialCommunityIcons name="food-drumstick" size={20} color={theme.warning} />
              </View>
              <Text style={[styles.fieldHelper, { color: theme.muted }]}>
                Enter unexpected donor items (e.g. Fresh Chicken / Mutton). The calculator automatically offsets pulse procurement and flags perishable dispatch priority.
              </Text>
              <TextInput
                mode="outlined"
                label="Fresh Chicken / Mutton Donation (kg)"
                value={freshMeatDonationKgText}
                onChangeText={(t) => setFreshMeatDonationKgText(t.replace(/[^0-9.]/g, ''))}
                keyboardType="numeric"
                style={styles.textInput}
                outlineColor={theme.border}
                activeOutlineColor={theme.primary}
                textColor={theme.text}
              />
              {freshMeatKg > 0 ? (
                <View style={[styles.perishableAlert, { backgroundColor: theme.warningSoft || 'rgba(251,191,36,0.14)', borderColor: theme.warning }]}>
                  <MaterialCommunityIcons name="clock-alert-outline" size={20} color={theme.warning} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.alertTitle, { color: theme.warning }]}>🚨 48-Hour Dispatch Priority</Text>
                    <Text style={[styles.alertText, { color: theme.text }]}>
                      {freshMeatKg} kg Fresh Meat offsets {meatProteinOffsetKg} kg of dry pulse procurement! Dispatch within 48 hours to prevent spoilage.
                    </Text>
                  </View>
                </View>
              ) : null}
            </SurfaceCard>
          </FadeInUp>

          {/* Calculated Procurement Requirements */}
          <FadeInUp delay={200}>
            <SurfaceCard padding={spacing.lg}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>4. Required Procurement Summary</Text>
              <View style={styles.calcGrid}>
                {calculations.map((c) => (
                  <View key={c.id} style={[styles.calcCard, { backgroundColor: theme.backgroundAlt, borderColor: theme.border }]}>
                    <View style={styles.calcHeader}>
                      <Text style={[styles.calcName, { color: theme.text }]}>{c.name}</Text>
                      <Text style={[styles.calcRate, { color: theme.muted }]}>{c.gramPerServing}g / serving</Text>
                    </View>

                    <View style={styles.calcMetricsRow}>
                      <View style={styles.calcMetric}>
                        <Text style={[styles.metricSubLabel, { color: theme.muted }]}>Net Procurement</Text>
                        <Text style={[styles.metricVal, { color: theme.primary }]}>{c.netRequiredKg.toLocaleString()} {c.unit}</Text>
                      </View>
                      <View style={styles.calcMetric}>
                        <Text style={[styles.metricSubLabel, { color: theme.muted }]}>Cooked Yield (Y)</Text>
                        <Text style={[styles.metricVal, { color: theme.success }]}>{c.cookedOutputKg.toLocaleString()} {c.unit}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </SurfaceCard>
          </FadeInUp>

          {/* Exporter Actions */}
          <FadeInUp delay={240}>
            <SurfaceCard padding={spacing.lg}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>5. Export Purchase Order (PO)</Text>
              <View style={styles.exportRow}>
                <Pressable
                  onPress={() => handleExportPO('csv')}
                  style={({ pressed }) => [styles.exportBtn, { backgroundColor: theme.primary }, pressed && { opacity: 0.85 }]}
                >
                  <MaterialCommunityIcons name="file-document-outline" size={18} color={theme.primaryText} />
                  <Text style={[styles.exportBtnText, { color: theme.primaryText }]}>Export Purchase Order (CSV)</Text>
                </Pressable>

                <Pressable
                  onPress={() => handleExportPO('pdf')}
                  style={({ pressed }) => [styles.exportBtn, { backgroundColor: theme.surfaceRaised, borderColor: theme.border, borderWidth: 1 }, pressed && { opacity: 0.85 }]}
                >
                  <MaterialCommunityIcons name="file-pdf-box" size={18} color={theme.text} />
                  <Text style={[styles.exportBtnText, { color: theme.text }]}>Export PO (PDF)</Text>
                </Pressable>
              </View>
            </SurfaceCard>
          </FadeInUp>
        </View>
      </ScrollView>
    </View>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    screen: { flex: 1, backgroundColor: theme.background },
    scroll: { paddingBottom: spacing.xxl },
    contentWrap: {
      width: '100%',
      maxWidth: layout.maxContentWidth,
      alignSelf: 'center',
      padding: spacing.md,
      gap: spacing.md,
    },
    modeRow: { flexDirection: 'row', gap: spacing.md },
    modeBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.sm,
      borderRadius: radius.md,
      borderWidth: 1,
      minHeight: 48,
    },
    modeBtnText: { ...type.bodyStrong, fontSize: 13 },
    cardTitle: { ...type.subtitle, fontSize: 16, marginBottom: spacing.md },
    cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    regionScroll: { gap: spacing.sm, paddingBottom: spacing.xs },
    regionChip: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.pill,
      borderWidth: 1,
    },
    regionChipName: { ...type.bodyStrong, fontSize: 13 },
    regionInfoBox: {
      marginTop: spacing.md,
      padding: spacing.md,
      borderRadius: radius.md,
      borderWidth: 1,
    },
    regionSubtext: { ...type.caption, fontSize: 12, marginBottom: 4 },
    typicalMealsLabel: { ...type.bodyStrong, fontSize: 12, marginTop: 2 },
    typicalMealsText: { ...type.bodyStrong, fontSize: 13, marginTop: 2 },
    inputsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
    inputWrap: { width: '47.5%' },
    inputWrapFull: { width: '100%' },
    fieldLabel: { ...type.caption, fontSize: 12, marginBottom: 4 },
    fieldHelper: { ...type.caption, fontSize: 12, marginBottom: spacing.md },
    textInput: { backgroundColor: theme.surfaceRaised },
    perishableAlert: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: spacing.sm,
      padding: spacing.md,
      borderRadius: radius.md,
      borderWidth: 1,
      marginTop: spacing.md,
    },
    alertTitle: { ...type.bodyStrong, fontSize: 13, marginBottom: 2 },
    alertText: { ...type.caption, fontSize: 12, lineHeight: 16 },
    calcGrid: { gap: spacing.md },
    calcCard: { padding: spacing.md, borderRadius: radius.md, borderWidth: 1 },
    calcHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: spacing.sm },
    calcName: { ...type.bodyStrong, fontSize: 15 },
    calcRate: { ...type.caption, fontSize: 12 },
    calcMetricsRow: { flexDirection: 'row', justifyContent: 'space-between' },
    calcMetric: { flex: 1 },
    metricSubLabel: { ...type.caption, fontSize: 11, marginBottom: 2 },
    metricVal: { fontSize: 18, fontWeight: '800' },
    exportRow: { gap: spacing.md },
    exportBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.md,
      borderRadius: radius.md,
      minHeight: 48,
    },
    exportBtnText: { ...type.bodyStrong, fontSize: 14 },
  });
}
