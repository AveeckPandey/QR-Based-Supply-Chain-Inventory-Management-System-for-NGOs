import { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { doc, runTransaction } from "firebase/firestore";
import { db } from '../../services/firebase';
import { useAppTheme } from '../../theme/AppThemeContext';

export default function BoxDetails({ route, navigation }) {
  const { theme } = useAppTheme();
  const { item } = route.params;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const applyInventoryChange = async (nextStatus) => {
    const boxRef = doc(db, "boxes", item.id);
    const inventoryRef = doc(db, "inventory", "main");

    await runTransaction(db, async (transaction) => {
      const boxSnap = await transaction.get(boxRef);
      const inventorySnap = await transaction.get(inventoryRef);

      if (!boxSnap.exists()) {
        throw new Error("Box not found");
      }

      const currentBox = boxSnap.data();
      const currentInventory = inventorySnap.exists()
        ? inventorySnap.data()
        : { rice: 0, dal: 0, sachets: 0 };

      if (currentBox.status === nextStatus) {
        return;
      }

      const multiplier = nextStatus === "dispatched" ? -1 : 1;

      transaction.set(inventoryRef, {
        rice: Number(currentInventory.rice ?? 0) + (Number(currentBox.rice ?? 0) * multiplier),
        dal: Number(currentInventory.dal ?? 0) + (Number(currentBox.dal ?? 0) * multiplier),
        sachets: Number(currentInventory.sachets ?? 0) + (Number(currentBox.sachets ?? 0) * multiplier)
      });

      transaction.update(boxRef, {
        status: nextStatus
      });
    });
  };

  const handleDispatch = async () => {
    try {
      await applyInventoryChange("dispatched");
      navigation.goBack();
    } catch (err) {
      console.log("Dispatch error:", err);
      alert("Could not dispatch this box");
    }
  };

  const handleReturn = async () => {
    try {
      await applyInventoryChange("returned");
      navigation.goBack();
    } catch (err) {
      console.log("Return error:", err);
      alert("Could not return this box");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Card style={styles.card}>
        <Text style={styles.eyebrow}>BOX OPERATIONS</Text>
        <Text style={styles.title}>Box Details</Text>
        <Text style={styles.subtitle}>Review box contents and update its delivery state.</Text>

        <View style={styles.metricsGrid}>
          <View style={styles.metricTile}>
            <Text style={styles.metricLabel}>Box ID</Text>
            <Text style={styles.metricValue}>{item.id}</Text>
          </View>
          <View style={styles.metricTile}>
            <Text style={styles.metricLabel}>Rice</Text>
            <Text style={styles.metricValue}>{item.rice}</Text>
          </View>
          <View style={styles.metricTile}>
            <Text style={styles.metricLabel}>Dal</Text>
            <Text style={styles.metricValue}>{item.dal}</Text>
          </View>
          <View style={styles.metricTile}>
            <Text style={styles.metricLabel}>Sachets</Text>
            <Text style={styles.metricValue}>{item.sachets}</Text>
          </View>
        </View>

        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>Current status: {item.status}</Text>
        </View>

        <Button mode="contained" buttonColor={theme.primary} textColor={theme.primaryText} onPress={handleDispatch} style={styles.button}>
          Dispatch
        </Button>
        <Button mode="outlined" textColor={theme.text} onPress={handleReturn} style={styles.button}>
          Return
        </Button>
      </Card>
    </ScrollView>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    screen: {
      flexGrow: 1,
      justifyContent: 'center',
      backgroundColor: theme.background,
      padding: 18
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 20
    },
    eyebrow: {
      color: theme.primary,
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 2,
      marginBottom: 10
    },
    title: {
      color: theme.text,
      fontSize: 28,
      fontWeight: '800',
      marginBottom: 8
    },
    subtitle: {
      color: theme.muted,
      marginBottom: 18
    },
    metricsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10
    },
    metricTile: {
      minWidth: '45%',
      flexGrow: 1,
      backgroundColor: theme.surfaceRaised,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 18,
      padding: 14
    },
    metricLabel: {
      color: theme.muted,
      fontSize: 12,
      marginBottom: 4
    },
    metricValue: {
      color: theme.text,
      fontWeight: '800'
    },
    statusBadge: {
      marginTop: 16,
      marginBottom: 4,
      backgroundColor: theme.primarySoft,
      borderRadius: 16,
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: theme.border
    },
    statusText: {
      color: theme.text,
      fontWeight: '700',
      textTransform: 'capitalize'
    },
    button: {
      marginTop: 14,
      borderRadius: 14
    }
  });
}
