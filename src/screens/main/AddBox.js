import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, TextInput } from 'react-native-paper';
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from '../../services/firebase';
import { useAppTheme } from '../../theme/AppThemeContext';

export default function AddBox({ navigation }) {
  const { theme } = useAppTheme();
  const [rice, setRice] = useState('');
  const [dal, setDal] = useState('');
  const [sachets, setSachets] = useState('');
  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleAddBox = async () => {
    try {
      await addDoc(collection(db, "boxes"), {
        rice: Number(rice),
        dal: Number(dal),
        sachets: Number(sachets),
        status: "stored",
        createdAt: Timestamp.now()
      });

      navigation.goBack();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Card style={styles.card}>
        <Text style={styles.eyebrow}>BOX CREATION</Text>
        <Text style={styles.title}>Create New Box</Text>
        <Text style={styles.subtitle}>Fill in the ration quantities and store the box instantly.</Text>

        <View style={styles.form}>
          <TextInput mode="outlined" label="Rice (kg)" value={rice} onChangeText={setRice} keyboardType="numeric" style={styles.input} outlineColor={theme.border} activeOutlineColor={theme.primary} textColor={theme.text} theme={{ colors: { background: theme.surfaceRaised, primary: theme.primary, outline: theme.border } }} />
          <TextInput mode="outlined" label="Dal (kg)" value={dal} onChangeText={setDal} keyboardType="numeric" style={styles.input} outlineColor={theme.border} activeOutlineColor={theme.primary} textColor={theme.text} theme={{ colors: { background: theme.surfaceRaised, primary: theme.primary, outline: theme.border } }} />
          <TextInput mode="outlined" label="Sachets" value={sachets} onChangeText={setSachets} keyboardType="numeric" style={styles.input} outlineColor={theme.border} activeOutlineColor={theme.primary} textColor={theme.text} theme={{ colors: { background: theme.surfaceRaised, primary: theme.primary, outline: theme.border } }} />
        </View>

        <Button mode="contained" buttonColor={theme.primary} textColor={theme.primaryText} onPress={handleAddBox} style={styles.button}>
          Create Box
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
    form: {
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
