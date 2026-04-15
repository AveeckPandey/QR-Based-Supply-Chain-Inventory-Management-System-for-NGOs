import { useMemo, useState } from 'react';
import { Button as NativeButton, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Button, Card } from 'react-native-paper';
import { doc, getDoc } from "firebase/firestore";
import { db } from '../../services/firebase';
import { useAppTheme } from '../../theme/AppThemeContext';

export default function ScanQR({ navigation }) {
  const { theme } = useAppTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleScan = async ({ data }) => {
    if (scanned) return;
    setScanned(true);

    try {
      const docRef = doc(db, "boxes", data);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        navigation.navigate("BoxDetails", {
          item: { id: docSnap.id, ...docSnap.data() }
        });
      } else {
        alert("Box not found");
      }
    } catch (err) {
      console.log("Error scanning QR code:", err);
      alert("Could not process this QR code");
    }

    setTimeout(() => {
      setScanned(false);
    }, 2000);
  };

  if (!permission) {
    return (
      <View style={styles.stateScreen}>
        <Card style={styles.stateCard}>
          <Text style={styles.stateTitle}>Preparing Camera</Text>
          <Text style={styles.stateText}>Checking camera access for QR scanning.</Text>
        </Card>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.stateScreen}>
        <Card style={styles.stateCard}>
          <Text style={styles.stateTitle}>Camera Permission Needed</Text>
          <Text style={styles.stateText}>Enable the camera to scan box QR codes and jump straight into box details.</Text>
          <NativeButton title="Allow Camera" onPress={requestPermission} color={theme.primary} />
        </Card>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={scanned ? undefined : handleScan}
      />

      <View style={styles.overlay}>
        <Text style={styles.eyebrow}>SCAN MODE</Text>
        <Text style={styles.title}>Scan Box QR</Text>
        <Text style={styles.subtitle}>Align the QR code inside the frame to open its details.</Text>

        <View style={styles.scanFrame}>
          <View style={styles.cornerTopLeft} />
          <View style={styles.cornerTopRight} />
          <View style={styles.cornerBottomLeft} />
          <View style={styles.cornerBottomRight} />
        </View>

        <Button mode="contained-tonal" buttonColor="rgba(15,15,15,0.58)" textColor="#FFFFFF" onPress={() => navigation.goBack()} style={styles.button}>
          Back
        </Button>
      </View>
    </View>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: '#000000'
    },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.45)',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24
    },
    eyebrow: {
      color: '#FFFFFF',
      letterSpacing: 2,
      fontWeight: '700',
      marginBottom: 8
    },
    title: {
      color: '#FFFFFF',
      fontSize: 30,
      fontWeight: '800',
      marginBottom: 8
    },
    subtitle: {
      color: 'rgba(255,255,255,0.82)',
      textAlign: 'center',
      marginBottom: 28,
      lineHeight: 20
    },
    scanFrame: {
      width: 240,
      height: 240,
      borderRadius: 28,
      backgroundColor: 'transparent',
      marginBottom: 26
    },
    cornerTopLeft: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: 54,
      height: 54,
      borderTopWidth: 5,
      borderLeftWidth: 5,
      borderColor: theme.primary,
      borderTopLeftRadius: 28
    },
    cornerTopRight: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: 54,
      height: 54,
      borderTopWidth: 5,
      borderRightWidth: 5,
      borderColor: theme.primary,
      borderTopRightRadius: 28
    },
    cornerBottomLeft: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: 54,
      height: 54,
      borderBottomWidth: 5,
      borderLeftWidth: 5,
      borderColor: theme.primary,
      borderBottomLeftRadius: 28
    },
    cornerBottomRight: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 54,
      height: 54,
      borderBottomWidth: 5,
      borderRightWidth: 5,
      borderColor: theme.primary,
      borderBottomRightRadius: 28
    },
    button: {
      borderRadius: 14
    },
    stateScreen: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: theme.background,
      padding: 18
    },
    stateCard: {
      backgroundColor: theme.surface,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: theme.border,
      padding: 20
    },
    stateTitle: {
      color: theme.text,
      fontSize: 24,
      fontWeight: '800',
      marginBottom: 8
    },
    stateText: {
      color: theme.muted,
      marginBottom: 18,
      lineHeight: 20
    }
  });
}
