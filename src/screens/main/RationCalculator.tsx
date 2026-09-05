import { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TextInput } from 'react-native-paper';
import * as Haptics from 'expo-haptics';

import { useAppTheme } from '../../theme/AppThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { REGIONAL_RATION_PRESETS, type RegionPreset } from '../../services/rationPresets';
import {
  calculateCookedOutputKg,
  calculateCostPerMeal,
  calculateFoodRequiredKg,
  calculateItemCost,
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

export type CustomDonorItem = {
  id: string;
  name: string;
  category: 'meat_poultry' | 'dairy_eggs' | 'vegetables_fruit' | 'custom_grain' | 'other';
  donatedKg: number;
  gramPerServing: number;
  isPerishable: boolean;
  estimatedCostPerUnit?: number;
};

export default function RationCalculator({ navigation }) {
  const { theme } = useAppTheme();
  const { currentWarehouse } = useWarehouse();
  const { t: tAll } = useLanguage();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // Mode: 'dry_ration' (Boxes/Kits) vs 'hot_kitchen' (Cooked Cauldrons)
  const [calcMode, setCalcMode] = useState<'dry_ration' | 'hot_kitchen'>('dry_ration');
  const [selectedRegionId, setSelectedRegionId] = useState<string>('south_asia');
  const [peopleCountText, setPeopleCountText] = useState<string>('1000');
  const [durationDaysText, setDurationDaysText] = useState<string>('1');
  const [wasteMarginPctText, setWasteMarginPctText] = useState<string>('5');
  const [freshMeatDonationKgText, setFreshMeatDonationKgText] = useState<string>('');

  // Dynamic Custom Donor / Ration items array (+)
  const [customDonorItems, setCustomDonorItems] = useState<CustomDonorItem[]>([
    {
      id: 'default_chicken',
      name: 'Fresh Chicken / Mutton Inflow',
      category: 'meat_poultry',
      donatedKg: 0,
      gramPerServing: 100,
      isPerishable: true,
      estimatedCostPerUnit: 3.50,
    },
  ]);

  // Modal State for adding custom commodity (+)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customItemName, setCustomItemName] = useState('');
  const [customCategory, setCustomCategory] = useState<CustomDonorItem['category']>('meat_poultry');
  const [customDonatedKgText, setCustomDonatedKgText] = useState('');
  const [customGramPerServingText, setCustomGramPerServingText] = useState('60');
  const [customIsPerishable, setCustomIsPerishable] = useState(true);

  const region = useMemo<RegionPreset>(
    () => REGIONAL_RATION_PRESETS.find((r) => r.id === selectedRegionId) || REGIONAL_RATION_PRESETS[0],
    [selectedRegionId]
  );

  const peopleCount = Number(peopleCountText) || 0;
  const durationDays = Number(durationDaysText) || 0;
  const wasteMargin = (Number(wasteMarginPctText) || 0) / 100;
  const freshMeatKg = (Number(freshMeatDonationKgText) || 0) + customDonorItems.reduce((acc, c) => acc + (c.isPerishable ? c.donatedKg : 0), 0);

  // Calculate meat offset
  const meatProteinOffsetKg = useMemo(() => calculateMeatProteinOffsetKg(freshMeatKg), [freshMeatKg]);

  // Perform Calculations across standard preset items
  const presetCalculations = useMemo(() => {
    return region.staples.map((staple) => {
      const gramPerServing = calcMode === 'dry_ration' ? staple.fullReliefGramPerDay : staple.singleMealGram;
      const requiredKg = calculateFoodRequiredKg(peopleCount, gramPerServing, durationDays, wasteMargin);

      // Apply protein offset if dal/beans/staple is pulse
      const isPulse = staple.id.includes('dal') || staple.id.includes('bean') || staple.id.includes('csb');
      const netRequiredKg = isPulse ? Math.max(0, Number((requiredKg - meatProteinOffsetKg).toFixed(2))) : requiredKg;

      const cookedOutputKg = calculateCookedOutputKg(netRequiredKg, staple.yieldKey);
      const capacityPeople = calculatePeopleServedFromStock(netRequiredKg, gramPerServing, durationDays, wasteMargin);
      const estimatedCost = calculateItemCost(netRequiredKg, staple.estimatedCostPerUnit || 1.0);

      return {
        ...staple,
        isCustom: false,
        gramPerServing,
        requiredKg,
        netRequiredKg,
        cookedOutputKg,
        capacityPeople,
        estimatedCost,
      };
    });
  }, [region, calcMode, peopleCount, durationDays, wasteMargin, meatProteinOffsetKg]);

  // Calculations across dynamic custom items (+)
  const customCalculations = useMemo(() => {
    return customDonorItems
      .filter((item) => item.donatedKg > 0 || item.gramPerServing > 0)
      .map((item) => {
        const requiredKg = calculateFoodRequiredKg(peopleCount, item.gramPerServing, durationDays, wasteMargin);
        const netRequiredKg = Math.max(0, Number((requiredKg - item.donatedKg).toFixed(2)));
        const cookedOutputKg = calculateCookedOutputKg(netRequiredKg, item.category === 'meat_poultry' ? 'chicken' : 'vegetables');
        const estimatedCost = calculateItemCost(netRequiredKg, item.estimatedCostPerUnit || 2.0);

        return {
          id: item.id,
          name: item.name,
          unit: 'kg',
          isCustom: true,
          gramPerServing: item.gramPerServing,
          donatedKg: item.donatedKg,
          requiredKg,
          netRequiredKg,
          cookedOutputKg,
          isPerishable: item.isPerishable,
          estimatedCost,
        };
      });
  }, [customDonorItems, peopleCount, durationDays, wasteMargin]);

  const allCalculations = useMemo(() => [...presetCalculations, ...customCalculations], [presetCalculations, customCalculations]);

  // Financial Donor Sponsorship Quotation Metrics
  const totalSponsorshipBudget = useMemo(() => {
    return Number(allCalculations.reduce((acc, curr) => acc + (curr.estimatedCost || 0), 0).toFixed(2));
  }, [allCalculations]);

  const totalMeals = useMemo(() => peopleCount * durationDays, [peopleCount, durationDays]);

  const costPerMeal = useMemo(() => {
    return calculateCostPerMeal(totalSponsorshipBudget, totalMeals);
  }, [totalSponsorshipBudget, totalMeals]);

  const totalCookedFoodKg = useMemo(() => {
    return Number(allCalculations.reduce((acc, curr) => acc + (curr.cookedOutputKg || 0), 0).toFixed(2));
  }, [allCalculations]);

  const handleAddCustomItemSubmit = () => {
    if (!customItemName.trim()) {
      snackbar.error('Please enter a name for the custom donor item');
      return;
    }

    const newItem: CustomDonorItem = {
      id: `custom_${Date.now()}`,
      name: customItemName.trim(),
      category: customCategory,
      donatedKg: Number(customDonatedKgText) || 0,
      gramPerServing: Number(customGramPerServingText) || 50,
      isPerishable: customIsPerishable,
      estimatedCostPerUnit: 1.50,
    };

    setCustomDonorItems((prev) => [...prev, newItem]);
    setIsAddModalOpen(false);

    // Reset Form
    setCustomItemName('');
    setCustomDonatedKgText('');
    setCustomGramPerServingText('60');
    setCustomIsPerishable(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    snackbar.success(`Added custom donor item: ${newItem.name}`);
  };

  const handleRemoveCustomItem = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setCustomDonorItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleExportPO = async (format: 'csv' | 'pdf') => {
    if (allCalculations.length === 0) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const poRows = allCalculations.map((c) => ({
      Region: region.name,
      Mode: calcMode === 'dry_ration' ? 'Dry Ration' : 'Hot Kitchen',
      Commodity: c.name,
      Type: c.isCustom ? 'Custom Donor Item (+)' : 'Standard Preset',
      TargetMeals: totalMeals,
      GramPerServing: `${c.gramPerServing}g`,
      GrossRequiredKgL: `${c.requiredKg} ${c.unit}`,
      NetRequiredKgL: `${c.netRequiredKg} ${c.unit}`,
      CookedOutputKg: `${c.cookedOutputKg} kg`,
      EstCostUSD: `$${c.estimatedCost.toFixed(2)}`,
    }));

    try {
      if (format === 'csv') {
        await exportToCSV(poRows, `Donor-Meal-Quotation-${region.id}-${Date.now()}`);
        snackbar.success('Donor Meal Quotation CSV Exported');
      } else {
        await exportToPDF(poRows, `Donor Meal Sponsorship Quotation (${peopleCount} Meals)`, `donor-quotation-${Date.now()}`);
        snackbar.success('Donor Sponsorship PDF Exported');
      }
    } catch (_err) {
      snackbar.error('Could not export quotation');
    }
  };

  return (
    <View style={styles.screen}>
      <AmbientGlow variant="dual" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.contentWrap}>
          <FadeInUp delay={0}>
            <ScreenHeader
              eyebrow="HUMANITARIAN LOGISTICS & SPONSORSHIP"
              title="Ration & Supplier Calculator"
              subtitle="Convert cash/meal donations into exact raw kg/Liters and generate financial quotes."
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
              <Text style={[styles.cardTitle, { color: theme.text }]}>2. Sponsor Target Parameters</Text>
              <View style={styles.inputsGrid}>
                <View style={styles.inputWrap}>
                  <Text style={[styles.fieldLabel, { color: theme.muted }]}>Donor Target Meals / Beneficiaries (N)</Text>
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

          {/* Custom Donor Inflow Manager (+) */}
          <FadeInUp delay={160}>
            <SurfaceCard padding={spacing.lg}>
              <View style={styles.cardHeaderRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.cardTitle, { color: theme.text }]}>3. Custom Donor Inflow (+)</Text>
                  <Text style={[styles.fieldHelper, { color: theme.muted }]}>
                    Add unexpected donor items (e.g. Fresh Chicken, Mutton, Eggs, Milk Powder, Produce). Offsets dry pulses & flags perishable priority.
                  </Text>
                </View>
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setIsAddModalOpen(true);
                  }}
                  style={({ pressed }) => [
                    styles.addCustomBtn,
                    { backgroundColor: theme.primary },
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <MaterialCommunityIcons name="plus" size={18} color={theme.primaryText} />
                  <Text style={[styles.addCustomBtnText, { color: theme.primaryText }]}>Add Item</Text>
                </Pressable>
              </View>

              {/* Direct Quick Meat Input */}
              <View style={{ marginTop: spacing.xs }}>
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
              </View>

              {/* Render dynamic added custom donor items list */}
              {customDonorItems.length > 0 ? (
                <View style={styles.customItemsList}>
                  {customDonorItems.map((item) => (
                    <View key={item.id} style={[styles.customItemCard, { backgroundColor: theme.backgroundAlt, borderColor: theme.border }]}>
                      <View style={{ flex: 1 }}>
                        <View style={styles.customItemTitleRow}>
                          <Text style={[styles.customItemName, { color: theme.text }]}>{item.name}</Text>
                          {item.isPerishable ? (
                            <View style={[styles.badgePerishable, { backgroundColor: theme.warningSoft || 'rgba(251,191,36,0.14)' }]}>
                              <Text style={[styles.badgeText, { color: theme.warning }]}>Perishable (48h)</Text>
                            </View>
                          ) : null}
                        </View>
                        <Text style={[styles.customItemSub, { color: theme.muted }]}>
                          Donated: {item.donatedKg > 0 ? `${item.donatedKg} kg` : '0 kg'} · Serving: {item.gramPerServing}g / person
                        </Text>
                      </View>

                      {item.id !== 'default_chicken' ? (
                        <Pressable onPress={() => handleRemoveCustomItem(item.id)} style={styles.trashBtn}>
                          <MaterialCommunityIcons name="trash-can-outline" size={18} color={theme.danger || '#ef4444'} />
                        </Pressable>
                      ) : null}
                    </View>
                  ))}
                </View>
              ) : null}

              {freshMeatKg > 0 ? (
                <View style={[styles.perishableAlert, { backgroundColor: theme.warningSoft || 'rgba(251,191,36,0.14)', borderColor: theme.warning }]}>
                  <MaterialCommunityIcons name="clock-alert-outline" size={20} color={theme.warning} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.alertTitle, { color: theme.warning }]}>🚨 48-Hour Dispatch Priority Alert</Text>
                    <Text style={[styles.alertText, { color: theme.text }]}>
                      {freshMeatKg} kg Fresh Produce/Meat offsets {meatProteinOffsetKg} kg dry pulse procurement! Dispatch within 48 hours to prevent spoilage.
                    </Text>
                  </View>
                </View>
              ) : null}
            </SurfaceCard>
          </FadeInUp>

          {/* Donor Sponsorship Financial Quote Banner */}
          <FadeInUp delay={180}>
            <SurfaceCard padding={spacing.lg}>
              <View style={styles.cardHeaderRow}>
                <Text style={[styles.cardTitle, { color: theme.text }]}>4. Donor Financial Quote & Meal Yield</Text>
                <MaterialCommunityIcons name="cash-check" size={22} color={theme.success} />
              </View>

              <View style={styles.quoteMetricsRow}>
                <MetricTile
                  label="Total Donor Sponsorship"
                  value={`$${totalSponsorshipBudget.toLocaleString()}`}
                  subtext={`Est. budget for ${totalMeals} meals`}
                  icon="cash-multiple"
                  variant="primary"
                />
                <MetricTile
                  label="Cost Per Meal"
                  value={`$${costPerMeal}`}
                  subtext="Per person / meal"
                  icon="currency-usd"
                  variant="success"
                />
              </View>

              <View style={[styles.cookedYieldSummaryBox, { backgroundColor: theme.backgroundAlt, borderColor: theme.border }]}>
                <MaterialCommunityIcons name="pot-steam" size={20} color={theme.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.cookedYieldTitle, { color: theme.text }]}>Cooked Food Output Yield</Text>
                  <Text style={[styles.cookedYieldText, { color: theme.primary }]}>
                    {totalCookedFoodKg.toLocaleString()} kg total cooked meal output produced from raw inventory.
                  </Text>
                </View>
              </View>
            </SurfaceCard>
          </FadeInUp>

          {/* Calculated Procurement Requirements Summary */}
          <FadeInUp delay={200}>
            <SurfaceCard padding={spacing.lg}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>5. Itemized Raw Commodity Requirements (kg / Liters)</Text>
              <View style={styles.calcGrid}>
                {allCalculations.map((c) => (
                  <View key={c.id} style={[styles.calcCard, { backgroundColor: theme.backgroundAlt, borderColor: theme.border }]}>
                    <View style={styles.calcHeader}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Text style={[styles.calcName, { color: theme.text }]}>{c.name}</Text>
                        {c.isCustom ? (
                          <View style={[styles.customBadge, { backgroundColor: theme.primarySoft }]}>
                            <Text style={[styles.customBadgeText, { color: theme.primary }]}>Custom (+)</Text>
                          </View>
                        ) : null}
                      </View>
                      <Text style={[styles.calcRate, { color: theme.muted }]}>{c.gramPerServing}g / serving</Text>
                    </View>

                    <View style={styles.calcMetricsRow}>
                      <View style={styles.calcMetric}>
                        <Text style={[styles.metricSubLabel, { color: theme.muted }]}>Required Raw Quantity</Text>
                        <Text style={[styles.metricVal, { color: theme.primary }]}>{c.netRequiredKg.toLocaleString()} {c.unit}</Text>
                      </View>
                      <View style={styles.calcMetric}>
                        <Text style={[styles.metricSubLabel, { color: theme.muted }]}>Est. Cost</Text>
                        <Text style={[styles.metricVal, { color: theme.success }]}>${c.estimatedCost.toFixed(2)}</Text>
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
              <Text style={[styles.cardTitle, { color: theme.text }]}>6. Export Donor Quotation & Procurement Order</Text>
              <View style={styles.exportRow}>
                <Pressable
                  onPress={() => handleExportPO('csv')}
                  style={({ pressed }) => [styles.exportBtn, { backgroundColor: theme.primary }, pressed && { opacity: 0.85 }]}
                >
                  <MaterialCommunityIcons name="file-document-outline" size={18} color={theme.primaryText} />
                  <Text style={[styles.exportBtnText, { color: theme.primaryText }]}>Export Donor Quote (CSV)</Text>
                </Pressable>

                <Pressable
                  onPress={() => handleExportPO('pdf')}
                  style={({ pressed }) => [styles.exportBtn, { backgroundColor: theme.surfaceRaised, borderColor: theme.border, borderWidth: 1 }, pressed && { opacity: 0.85 }]}
                >
                  <MaterialCommunityIcons name="file-pdf-box" size={18} color={theme.text} />
                  <Text style={[styles.exportBtnText, { color: theme.text }]}>Export Donor Quote (PDF)</Text>
                </Pressable>
              </View>
            </SurfaceCard>
          </FadeInUp>
        </View>
      </ScrollView>

      {/* Modal for adding dynamic custom donor item (+) */}
      <Modal visible={isAddModalOpen} transparent animationType="slide" onRequestClose={() => setIsAddModalOpen(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>+ Add Custom Donor / Ration Item</Text>
              <Pressable onPress={() => setIsAddModalOpen(false)}>
                <MaterialCommunityIcons name="close" size={22} color={theme.text} />
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={{ gap: spacing.md }}>
              <TextInput
                mode="outlined"
                label="Item Name (e.g. Fresh Chicken, Milk Powder, Eggs)"
                value={customItemName}
                onChangeText={setCustomItemName}
                style={styles.textInput}
                outlineColor={theme.border}
                activeOutlineColor={theme.primary}
                textColor={theme.text}
              />

              <TextInput
                mode="outlined"
                label="Donated Quantity Received (kg)"
                value={customDonatedKgText}
                onChangeText={(t) => setCustomDonatedKgText(t.replace(/[^0-9.]/g, ''))}
                keyboardType="numeric"
                style={styles.textInput}
                outlineColor={theme.border}
                activeOutlineColor={theme.primary}
                textColor={theme.text}
              />

              <TextInput
                mode="outlined"
                label="Portion per Serving (grams)"
                value={customGramPerServingText}
                onChangeText={(t) => setCustomGramPerServingText(t.replace(/[^0-9]/g, ''))}
                keyboardType="numeric"
                style={styles.textInput}
                outlineColor={theme.border}
                activeOutlineColor={theme.primary}
                textColor={theme.text}
              />

              <Pressable
                onPress={() => setCustomIsPerishable(!customIsPerishable)}
                style={[
                  styles.checkboxRow,
                  { backgroundColor: theme.backgroundAlt, borderColor: theme.border },
                ]}
              >
                <MaterialCommunityIcons
                  name={customIsPerishable ? 'checkbox-marked' : 'checkbox-blank-outline'}
                  size={22}
                  color={customIsPerishable ? theme.warning : theme.muted}
                />
                <Text style={[styles.checkboxText, { color: theme.text }]}>
                  Perishable Priority Item (Triggers 48h dispatch warning)
                </Text>
              </Pressable>

              <Pressable
                onPress={handleAddCustomItemSubmit}
                style={({ pressed }) => [styles.submitBtn, { backgroundColor: theme.primary }, pressed && { opacity: 0.85 }]}
              >
                <Text style={[styles.submitBtnText, { color: theme.primaryText }]}>Save Custom Donor Item</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    cardTitle: { ...type.subtitle, fontSize: 16, marginBottom: 4 },
    cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing.sm },
    addCustomBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs + 2,
      borderRadius: radius.pill,
    },
    addCustomBtnText: { ...type.bodyStrong, fontSize: 12 },
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
    fieldHelper: { ...type.caption, fontSize: 12, marginBottom: spacing.sm },
    textInput: { backgroundColor: theme.surfaceRaised },
    customItemsList: { gap: spacing.xs, marginTop: spacing.md },
    customItemCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      borderRadius: radius.md,
      borderWidth: 1,
    },
    customItemTitleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
    customItemName: { ...type.bodyStrong, fontSize: 14 },
    customItemSub: { ...type.caption, fontSize: 12, marginTop: 2 },
    badgePerishable: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: radius.xs },
    badgeText: { fontSize: 10, fontWeight: '700' },
    trashBtn: { padding: spacing.xs },
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
    quoteMetricsRow: { flexDirection: 'row', gap: spacing.md, marginVertical: spacing.sm },
    cookedYieldSummaryBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      padding: spacing.md,
      borderRadius: radius.md,
      borderWidth: 1,
      marginTop: spacing.xs,
    },
    cookedYieldTitle: { ...type.bodyStrong, fontSize: 13 },
    cookedYieldText: { ...type.caption, fontSize: 12, marginTop: 2 },
    calcGrid: { gap: spacing.md },
    calcCard: { padding: spacing.md, borderRadius: radius.md, borderWidth: 1 },
    calcHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: spacing.sm },
    calcName: { ...type.bodyStrong, fontSize: 15 },
    calcRate: { ...type.caption, fontSize: 12 },
    calcMetricsRow: { flexDirection: 'row', justifyContent: 'space-between' },
    calcMetric: { flex: 1 },
    metricSubLabel: { ...type.caption, fontSize: 11, marginBottom: 2 },
    metricVal: { fontSize: 18, fontWeight: '800' },
    customBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: radius.xs },
    customBadgeText: { fontSize: 10, fontWeight: '700' },
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
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: spacing.md },
    modalCard: { padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1, maxHeight: '80%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
    modalTitle: { ...type.subtitle, fontSize: 16 },
    checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md, borderRadius: radius.md, borderWidth: 1 },
    checkboxText: { ...type.caption, fontSize: 12, flex: 1 },
    submitBtn: { paddingVertical: spacing.md, borderRadius: radius.md, alignItems: 'center', marginTop: spacing.xs },
    submitBtnText: { ...type.bodyStrong, fontSize: 14 },
  });
}
