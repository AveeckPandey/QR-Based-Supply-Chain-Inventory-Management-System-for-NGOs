import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Button, Card, TextInput } from 'react-native-paper';
import { signOut } from 'firebase/auth';
import { collection, doc, onSnapshot } from "firebase/firestore";
import { auth, db } from '../../services/firebase';
import { useAppTheme } from '../../theme/AppThemeContext';

export default function Dashboard({ navigation }) {
  const { theme, themeName, toggleTheme } = useAppTheme();
  const [inventory, setInventory] = useState({
    rice: 0,
    dal: 0,
    sachets: 0
  });
  const [boxes, setBoxes] = useState([]);
  const [targetBoxes, setTargetBoxes] = useState(100);

  const heroAnim = useRef(new Animated.Value(0)).current;
  const cardsAnim = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ]).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroAnim, {
        toValue: 1,
        duration: 550,
        useNativeDriver: true
      }),
      Animated.stagger(
        110,
        cardsAnim.map((anim) =>
          Animated.timing(anim, {
            toValue: 1,
            duration: 520,
            useNativeDriver: true
          })
        )
      )
    ]).start();
  }, [cardsAnim, heroAnim]);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "inventory", "main"), (snap) => {
      if (snap.exists()) {
        setInventory({
          rice: Number(snap.data().rice ?? 0),
          dal: Number(snap.data().dal ?? 0),
          sachets: Number(snap.data().sachets ?? 0)
        });
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "boxes"), (snapshot) => {
      const data = snapshot.docs.map((boxDoc) => ({
        id: boxDoc.id,
        ...boxDoc.data()
      }));
      setBoxes(data);
    });

    return () => unsubscribe();
  }, []);

  let stored = 0;
  let dispatched = 0;
  let returned = 0;

  boxes.forEach((box) => {
    if (box.status === "stored") stored++;
    if (box.status === "dispatched") dispatched++;
    if (box.status === "returned") returned++;
  });

  const standardBox = {
    rice: 20,
    dal: 20,
    sachets: 50
  };

  const requiredRice = targetBoxes * standardBox.rice;
  const requiredDal = targetBoxes * standardBox.dal;
  const requiredSachets = targetBoxes * standardBox.sachets;

  const shortageRice = Math.max(requiredRice - inventory.rice, 0);
  const shortageDal = Math.max(requiredDal - inventory.dal, 0);
  const shortageSachets = Math.max(requiredSachets - inventory.sachets, 0);

  const possibleBoxes = Math.max(
    Math.min(
      Math.floor(inventory.rice / standardBox.rice),
      Math.floor(inventory.dal / standardBox.dal),
      Math.floor(inventory.sachets / standardBox.sachets)
    ),
    0
  );

  const chartData = [
    { label: 'Rice', value: inventory.rice, unit: 'kg', color: theme.primary },
    { label: 'Dal', value: inventory.dal, unit: 'kg', color: theme.warning },
    { label: 'Sachets', value: inventory.sachets, unit: '', color: theme.success }
  ];
  const maxChartValue = Math.max(...chartData.map((item) => item.value), 1);
  const completionRate = Math.min((possibleBoxes / Math.max(targetBoxes, 1)) * 100, 100);
  const styles = createStyles(theme);

  const renderAnimatedCard = (index, content) => (
    <Animated.View
      style={{
        opacity: cardsAnim[index],
        transform: [
          {
            translateY: cardsAnim[index].interpolate({
              inputRange: [0, 1],
              outputRange: [28, 0]
            })
          }
        ]
      }}
    >
      {content}
    </Animated.View>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View
          style={[
            styles.heroCard,
            {
              opacity: heroAnim,
              transform: [
                {
                  translateY: heroAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [26, 0]
                  })
                }
              ]
            }
          ]}
        >
          <View style={styles.heroTopRow}>
            <View>
              <Text style={styles.eyebrow}>NGO CONTROL CENTER</Text>
              <Text style={styles.title}>Dashboard</Text>
              <Text style={styles.subtitle}>
                Track stock, box movement, and campaign readiness in real time.
              </Text>
            </View>

            <View style={styles.heroActions}>
              <Pressable style={styles.themePill} onPress={toggleTheme}>
                <Text style={styles.themePillText}>
                  {themeName === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </Text>
              </Pressable>

              <Pressable style={styles.signOutPill} onPress={() => signOut(auth)}>
                <Text style={styles.signOutText}>Sign Out</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.heroStats}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>{possibleBoxes}</Text>
              <Text style={styles.heroStatLabel}>Possible Boxes</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>{boxes.length}</Text>
              <Text style={styles.heroStatLabel}>Total Boxes</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>{Math.round(completionRate)}%</Text>
              <Text style={styles.heroStatLabel}>Target Coverage</Text>
            </View>
          </View>
        </Animated.View>

        {renderAnimatedCard(
          0,
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Live Inventory</Text>
            <View style={styles.inventoryGrid}>
              {chartData.map((item) => (
                <View key={item.label} style={styles.metricTile}>
                  <Text style={styles.metricLabel}>{item.label}</Text>
                  <Text style={styles.metricValue}>
                    {item.value}
                    {item.unit ? ` ${item.unit}` : ''}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        {renderAnimatedCard(
          1,
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Inventory Chart</Text>
            {chartData.map((item) => (
              <View key={item.label} style={styles.chartRow}>
                <View style={styles.chartHeader}>
                  <Text style={styles.chartLabel}>{item.label}</Text>
                  <Text style={styles.chartValue}>
                    {item.value} {item.unit}
                  </Text>
                </View>
                <View style={styles.chartTrack}>
                  <View
                    style={[
                      styles.chartBar,
                      {
                        width: `${Math.max((item.value / maxChartValue) * 100, item.value > 0 ? 10 : 0)}%`,
                        backgroundColor: item.color
                      }
                    ]}
                  />
                </View>
              </View>
            ))}
          </Card>
        )}

        {renderAnimatedCard(
          2,
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Box Status</Text>
            <View style={styles.statusRow}>
              <View style={styles.statusPill}>
                <Text style={styles.statusValue}>{stored}</Text>
                <Text style={styles.statusLabel}>Stored</Text>
              </View>
              <View style={styles.statusPill}>
                <Text style={styles.statusValue}>{dispatched}</Text>
                <Text style={styles.statusLabel}>Dispatched</Text>
              </View>
              <View style={styles.statusPill}>
                <Text style={styles.statusValue}>{returned}</Text>
                <Text style={styles.statusLabel}>Returned</Text>
              </View>
            </View>
          </Card>
        )}

        {renderAnimatedCard(
          3,
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Target Planning</Text>
            <Text style={styles.helperText}>Set how many standard boxes you want to prepare.</Text>
            <TextInput
              mode="outlined"
              value={String(targetBoxes)}
              onChangeText={(text) => setTargetBoxes(Number(text) || 0)}
              keyboardType="numeric"
              style={styles.input}
              outlineColor={theme.border}
              activeOutlineColor={theme.primary}
              textColor={theme.text}
              theme={{
                colors: {
                  background: theme.surfaceRaised,
                  placeholder: theme.muted,
                  primary: theme.primary,
                  outline: theme.border
                }
              }}
            />
            <View style={styles.requirementGrid}>
              <View style={styles.requirementTile}>
                <Text style={styles.requirementLabel}>Rice Shortage</Text>
                <Text style={styles.requirementValue}>{shortageRice} kg</Text>
              </View>
              <View style={styles.requirementTile}>
                <Text style={styles.requirementLabel}>Dal Shortage</Text>
                <Text style={styles.requirementValue}>{shortageDal} kg</Text>
              </View>
              <View style={styles.requirementTile}>
                <Text style={styles.requirementLabel}>Sachet Shortage</Text>
                <Text style={styles.requirementValue}>{shortageSachets}</Text>
              </View>
            </View>
          </Card>
        )}

        {renderAnimatedCard(
          4,
          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Actions</Text>
            <View style={styles.actionGrid}>
              <Button mode="contained" buttonColor={theme.primary} textColor={theme.primaryText} onPress={() => navigation.navigate("Boxes")} style={styles.actionButton}>
                Manage Boxes
              </Button>
              <Button mode="outlined" textColor={theme.text} onPress={() => navigation.navigate("ScanQR")} style={styles.actionButton}>
                Scan QR
              </Button>
              <Button mode="outlined" textColor={theme.text} onPress={() => navigation.navigate("AdminInventory")} style={styles.actionButton}>
                Admin Inventory
              </Button>
            </View>
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.background
    },
    scrollContent: {
      padding: 18,
      paddingBottom: 32
    },
    glowTop: {
      position: 'absolute',
      top: -80,
      right: -30,
      width: 220,
      height: 220,
      borderRadius: 110,
      backgroundColor: theme.primary,
      opacity: theme.mode === 'dark' ? 0.12 : 0.10
    },
    glowBottom: {
      position: 'absolute',
      bottom: -40,
      left: -20,
      width: 180,
      height: 180,
      borderRadius: 90,
      backgroundColor: theme.primary,
      opacity: theme.mode === 'dark' ? 0.07 : 0.08
    },
    heroCard: {
      backgroundColor: theme.surface,
      borderRadius: 28,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 22,
      marginBottom: 18,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: theme.mode === 'dark' ? 0.35 : 0.15,
      shadowRadius: 22,
      elevation: 8
    },
    heroTopRow: {
      gap: 18
    },
    eyebrow: {
      color: theme.primary,
      fontSize: 12,
      letterSpacing: 2,
      fontWeight: '700',
      marginBottom: 10
    },
    title: {
      color: theme.text,
      fontSize: 34,
      fontWeight: '800',
      letterSpacing: -1,
      marginBottom: 8
    },
    subtitle: {
      color: theme.muted,
      fontSize: 14,
      lineHeight: 21,
      maxWidth: 320
    },
    heroActions: {
      flexDirection: 'row',
      gap: 10,
      flexWrap: 'wrap',
      marginTop: 6
    },
    themePill: {
      backgroundColor: theme.primarySoft,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 999,
      paddingHorizontal: 14,
      paddingVertical: 10
    },
    themePillText: {
      color: theme.primary,
      fontWeight: '700',
      fontSize: 12
    },
    signOutPill: {
      backgroundColor: theme.surfaceRaised,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 999,
      paddingHorizontal: 14,
      paddingVertical: 10
    },
    signOutText: {
      color: theme.text,
      fontWeight: '700',
      fontSize: 12
    },
    heroStats: {
      marginTop: 22,
      flexDirection: 'row',
      backgroundColor: theme.surfaceRaised,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.border,
      paddingVertical: 16,
      paddingHorizontal: 10
    },
    heroStat: {
      flex: 1,
      alignItems: 'center'
    },
    heroStatDivider: {
      width: 1,
      backgroundColor: theme.border
    },
    heroStatValue: {
      color: theme.text,
      fontSize: 24,
      fontWeight: '800'
    },
    heroStatLabel: {
      color: theme.muted,
      fontSize: 12,
      marginTop: 4
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 18,
      marginBottom: 16,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: theme.mode === 'dark' ? 0.20 : 0.08,
      shadowRadius: 18,
      elevation: 4
    },
    sectionTitle: {
      color: theme.text,
      fontSize: 18,
      fontWeight: '800',
      marginBottom: 14
    },
    inventoryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12
    },
    metricTile: {
      minWidth: '30%',
      flexGrow: 1,
      backgroundColor: theme.surfaceRaised,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 14
    },
    metricLabel: {
      color: theme.muted,
      fontSize: 12,
      marginBottom: 6
    },
    metricValue: {
      color: theme.text,
      fontSize: 22,
      fontWeight: '800'
    },
    chartRow: {
      marginBottom: 14
    },
    chartHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 6
    },
    chartLabel: {
      color: theme.text,
      fontWeight: '700'
    },
    chartValue: {
      color: theme.muted,
      fontWeight: '600'
    },
    chartTrack: {
      height: 14,
      backgroundColor: theme.backgroundAlt,
      borderRadius: 999,
      overflow: 'hidden'
    },
    chartBar: {
      height: '100%',
      borderRadius: 999
    },
    statusRow: {
      flexDirection: 'row',
      gap: 10,
      flexWrap: 'wrap'
    },
    statusPill: {
      flexGrow: 1,
      minWidth: '30%',
      padding: 14,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surfaceRaised
    },
    statusValue: {
      color: theme.text,
      fontSize: 22,
      fontWeight: '800'
    },
    statusLabel: {
      color: theme.muted,
      marginTop: 4
    },
    helperText: {
      color: theme.muted,
      marginBottom: 12,
      lineHeight: 20
    },
    input: {
      backgroundColor: theme.surfaceRaised,
      marginBottom: 14
    },
    requirementGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10
    },
    requirementTile: {
      minWidth: '30%',
      flexGrow: 1,
      padding: 14,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.primarySoft
    },
    requirementLabel: {
      color: theme.muted,
      fontSize: 12,
      marginBottom: 6
    },
    requirementValue: {
      color: theme.text,
      fontWeight: '800',
      fontSize: 18
    },
    actionGrid: {
      gap: 12
    },
    actionButton: {
      borderRadius: 14
    }
  });
}
