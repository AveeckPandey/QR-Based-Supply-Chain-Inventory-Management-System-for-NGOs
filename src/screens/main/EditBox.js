import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, TextInput } from 'react-native-paper';
import { doc, updateDoc } from "firebase/firestore";
import { db } from '../../services/firebase';
import { useAppTheme } from '../../theme/AppThemeContext';

export default function EditBox({ route, navigation }) {
  const { theme } = useAppTheme();
  const { item } = route.params;
  const [rice, setRice] = useState(String(item.rice));
  const [dal, setDal] = useState(String(item.dal));
  const [sachets, setSachets] = useState(String(item.sachets));
  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleUpdate = async () => {
    try {
      await updateDoc(doc(db, "boxes", item.id), {
        rice: Number(rice),
        dal: Number(dal),
        sachets: Number(sachets)
      });

      navigation.goBack();
    } catch (err) {
      console.log("Update error:", err);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Card style={styles.card}>
        <Text style={styles.eyebrow}>BOX EDITOR</Text>
        <Text style={styles.title}>Update Box</Text>
        <Text style={styles.subtitle}>Adjust the quantities for box `{item.id}` and save the changes.</Text>

        <View style={styles.form}>
          <TextInput mode="outlined" label="Rice" value={rice} onChangeText={setRice} keyboardType="numeric" style={styles.input} outlineColor={theme.border} activeOutlineColor={theme.primary} textColor={theme.text} theme={{ colors: { background: theme.surfaceRaised, primary: theme.primary, outline: theme.border } }} />
          <TextInput mode="outlined" label="Dal" value={dal} onChangeText={setDal} keyboardType="numeric" style={styles.input} outlineColor={theme.border} activeOutlineColor={theme.primary} textColor={theme.text} theme={{ colors: { background: theme.surfaceRaised, primary: theme.primary, outline: theme.border } }} />
          <TextInput mode="outlined" label="Sachets" value={sachets} onChangeText={setSachets} keyboardType="numeric" style={styles.input} outlineColor={theme.border} activeOutlineColor={theme.primary} textColor={theme.text} theme={{ colors: { background: theme.surfaceRaised, primary: theme.primary, outline: theme.border } }} />
        </View>

        <Button mode="contained" buttonColor={theme.primary} textColor={theme.primaryText} onPress={handleUpdate} style={styles.button}>
          Update Box
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
