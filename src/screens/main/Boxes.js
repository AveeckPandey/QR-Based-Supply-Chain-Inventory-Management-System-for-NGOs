import { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Button, Card, IconButton, TextInput } from 'react-native-paper';
import { collection, onSnapshot } from "firebase/firestore";
import QRCode from 'react-native-qrcode-svg';
import { db } from '../../services/firebase';
import { useAppTheme } from '../../theme/AppThemeContext';

export default function Boxes({ navigation }) {
  const { theme } = useAppTheme();
  const [boxes, setBoxes] = useState([]);
  const [search, setSearch] = useState('');
  const styles = useMemo(() => createStyles(theme), [theme]);

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

  const filteredBoxes = boxes.filter((box) =>
    box.id.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusTone = (status) => {
    if (status === "stored") return theme.success;
    if (status === "dispatched") return theme.danger;
    if (status === "returned") return theme.warning;
    return theme.text;
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>BOX REGISTRY</Text>
        <Text style={styles.title}>Manage Boxes</Text>
        <Text style={styles.subtitle}>Search, edit, and print QR codes from one cleaner workspace.</Text>
      </View>

      <TextInput
        mode="outlined"
        placeholder="Search by Box ID"
        value={search}
        onChangeText={setSearch}
        style={styles.search}
        outlineColor={theme.border}
        activeOutlineColor={theme.primary}
        textColor={theme.text}
        theme={{ colors: { background: theme.surface, primary: theme.primary, outline: theme.border, placeholder: theme.muted } }}
      />

      <FlatList
        data={filteredBoxes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.cardTitle}>Box ID</Text>
                <Text style={styles.cardId}>{item.id}</Text>
              </View>
              <View style={[styles.statusBadge, { borderColor: getStatusTone(item.status) }]}>
                <Text style={[styles.statusText, { color: getStatusTone(item.status) }]}>
                  {item.status}
                </Text>
              </View>
            </View>

            <View style={styles.metricsRow}>
              <View style={styles.metricTile}>
                <Text style={styles.metricLabel}>Rice</Text>
                <Text style={styles.metricValue}>{item.rice} kg</Text>
              </View>
              <View style={styles.metricTile}>
                <Text style={styles.metricLabel}>Dal</Text>
                <Text style={styles.metricValue}>{item.dal} kg</Text>
              </View>
              <View style={styles.metricTile}>
                <Text style={styles.metricLabel}>Sachets</Text>
                <Text style={styles.metricValue}>{item.sachets}</Text>
              </View>
            </View>

            <View style={styles.qrCard}>
              <QRCode value={item.id} size={84} color={theme.text} backgroundColor={theme.surfaceRaised} />
            </View>

            <View style={styles.actionsRow}>
              <IconButton
                icon="pencil"
                iconColor={theme.primary}
                containerColor={theme.primarySoft}
                onPress={() => navigation.navigate("EditBox", { item })}
              />

              <Button
                mode="outlined"
                textColor={theme.text}
                onPress={() => navigation.navigate("PrintQR", { item })}
                style={styles.printButton}
              >
                Print QR
              </Button>
            </View>
          </Card>
        )}
      />

      <IconButton
        icon="plus"
        iconColor={theme.primaryText}
        size={30}
        mode="contained"
        containerColor={theme.primary}
        style={styles.fab}
        onPress={() => navigation.navigate("AddBox")}
      />
    </View>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.background,
      paddingTop: 18
    },
    header: {
      paddingHorizontal: 18,
      marginBottom: 12
    },
    eyebrow: {
      color: theme.primary,
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 2,
      marginBottom: 8
    },
    title: {
      color: theme.text,
      fontSize: 30,
      fontWeight: '800',
      marginBottom: 8
    },
    subtitle: {
      color: theme.muted,
      lineHeight: 20
    },
    search: {
      marginHorizontal: 18,
      marginBottom: 8,
      backgroundColor: theme.surface
    },
    list: {
      paddingHorizontal: 18,
      paddingBottom: 96
    },
    card: {
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 24,
      padding: 18,
      marginTop: 12
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: 12
    },
    cardTitle: {
      color: theme.muted,
      fontSize: 12,
      marginBottom: 4
    },
    cardId: {
      color: theme.text,
      fontSize: 18,
      fontWeight: '800'
    },
    statusBadge: {
      borderWidth: 1,
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 6,
      backgroundColor: theme.surfaceRaised
    },
    statusText: {
      textTransform: 'capitalize',
      fontWeight: '700',
      fontSize: 12
    },
    metricsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      marginTop: 16
    },
    metricTile: {
      flexGrow: 1,
      minWidth: '30%',
      backgroundColor: theme.surfaceRaised,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 16,
      padding: 12
    },
    metricLabel: {
      color: theme.muted,
      fontSize: 12,
      marginBottom: 4
    },
    metricValue: {
      color: theme.text,
      fontWeight: '700'
    },
    qrCard: {
      alignItems: 'center',
      marginTop: 16,
      backgroundColor: theme.surfaceRaised,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 16
    },
    actionsRow: {
      marginTop: 14,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    printButton: {
      borderRadius: 12
    },
    fab: {
      position: 'absolute',
      right: 18,
      bottom: 24
    }
  });
}
