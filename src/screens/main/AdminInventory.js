import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from '../../services/firebase';
import { useAppTheme } from '../../theme/AppThemeContext';

export default function AdminInventory() {
  const { theme } = useAppTheme();
  const [rice, setRice] = useState('');
  const [dal, setDal] = useState('');
  const [sachets, setSachets] = useState('');
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const styles = useMemo(() => createStyles(theme), [theme]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 450,
      useNativeDriver: true
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    const ref = doc(db, "inventory", "main");

    const unsubscribe = onSnapshot(ref, async (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setRice(String(data.rice ?? 0));
        setDal(String(data.dal ?? 0));
        setSachets(String(data.sachets ?? 0));
        return;
      }

      await setDoc(ref, {
        rice: 0,
        dal: 0,
        sachets: 0
      });
    });

    return () => unsubscribe();
  }, []);

  const handleUpdate = async () => {
    try {
      await setDoc(doc(db, "inventory", "main"), {
        rice: Number(rice),
        dal: Number(dal),
        sachets: Number(sachets)
      });

      alert("Inventory updated");
    } catch (err) {
      console.log("Inventory update error:", err);
      alert("Could not update inventory");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <Text style={styles.eyebrow}>ADMIN CONTROL</Text>
        <Text style={styles.title}>Inventory Manager</Text>
        <Text style={styles.subtitle}>
          Update warehouse stock manually. The dashboard and charts will reflect these numbers live.
        </Text>

        <View style={styles.inputGroup}>
          <TextInput
            mode="outlined"
            label="Rice (kg)"
            value={rice}
            onChangeText={setRice}
            keyboardType="numeric"
            style={styles.input}
            outlineColor={theme.border}
            activeOutlineColor={theme.primary}
            textColor={theme.text}
            theme={{ colors: { background: theme.surfaceRaised, primary: theme.primary, outline: theme.border } }}
          />
          <TextInput
            mode="outlined"
            label="Dal (kg)"
            value={dal}
            onChangeText={setDal}
            keyboardType="numeric"
            style={styles.input}
            outlineColor={theme.border}
            activeOutlineColor={theme.primary}
            textColor={theme.text}
            theme={{ colors: { background: theme.surfaceRaised, primary: theme.primary, outline: theme.border } }}
          />
          <TextInput
            mode="outlined"
            label="Sachets"
            value={sachets}
            onChangeText={setSachets}
            keyboardType="numeric"
            style={styles.input}
            outlineColor={theme.border}
            activeOutlineColor={theme.primary}
            textColor={theme.text}
            theme={{ colors: { background: theme.surfaceRaised, primary: theme.primary, outline: theme.border } }}
          />
        </View>

        <Button mode="contained" buttonColor={theme.primary} textColor={theme.primaryText} onPress={handleUpdate} style={styles.button}>
          Update Inventory
        </Button>
      </Animated.View>
    </ScrollView>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    screen: {
      flexGrow: 1,
      backgroundColor: theme.background,
      justifyContent: 'center',
      padding: 18
    },
    card: {
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 24,
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
      lineHeight: 20,
      marginBottom: 18
    },
    inputGroup: {
      gap: 12
    },
    input: {
      backgroundColor: theme.surfaceRaised
    },
    button: {
      marginTop: 18,
      borderRadius: 14
    }
  });
}
