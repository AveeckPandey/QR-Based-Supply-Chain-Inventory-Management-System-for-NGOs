import { useMemo, useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator, Button, Card, IconButton } from 'react-native-paper';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';
import QRCode from 'react-native-qrcode-svg';
import { useAppTheme } from '../../theme/AppThemeContext';

export default function PrintQR({ route }) {
  const { theme } = useAppTheme();
  const { item } = route.params;
  const [isSaving, setIsSaving] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const qrRef = useRef(null);
  const styles = useMemo(() => createStyles(theme), [theme]);

  const getQrFileUri = () =>
    `${FileSystem.documentDirectory}qr-${item.id}.png`;

  const getQrDataUrl = async () =>
    await new Promise((resolve, reject) => {
      if (!qrRef.current) {
        reject(new Error('QR ref not ready'));
        return;
      }

      qrRef.current.toDataURL((base64) => {
        if (!base64) {
          reject(new Error('QR export failed'));
          return;
        }

        resolve(`data:image/png;base64,${base64}`);
      });
    });

  const saveQrFile = async () => {
    const qrDataUrl = await getQrDataUrl();

    const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, '');
    const fileUri = getQrFileUri();

    await FileSystem.writeAsStringAsync(fileUri, base64Data, {
      encoding: FileSystem.EncodingType.Base64
    });

    return { fileUri, qrDataUrl };
  };

  const handleDownload = async () => {
    try {
      setIsSaving(true);
      const { fileUri } = await saveQrFile();
      const canShare = await Sharing.isAvailableAsync();

      if (canShare) {
        await Sharing.shareAsync(fileUri, {
          dialogTitle: 'Save or share QR image',
          mimeType: 'image/png',
          UTI: 'public.png'
        });
      }

      Alert.alert(
        'QR saved',
        canShare
          ? 'The QR image is ready in the share sheet so you can download or send it.'
          : `The QR image was saved to:\n${fileUri}`
      );
    } catch (err) {
      console.log('QR save error:', err);
      Alert.alert('Save failed', 'Could not save the QR image.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = async () => {
    try {
      setIsPrinting(true);
      const { qrDataUrl } = await saveQrFile();
      const html = `
        <html>
          <body style="font-family: Arial, sans-serif; padding: 24px; color: #111827;">
            <div style="max-width: 360px; margin: 0 auto; border: 2px solid #1F2937; border-radius: 18px; padding: 24px; text-align: center;">
              <div style="font-size: 12px; letter-spacing: 3px; font-weight: 700; color: #6B7280; margin-bottom: 10px;">QR LABEL</div>
              <div style="font-size: 28px; font-weight: 800; margin-bottom: 18px;">Box ${item.id}</div>
              <img src="${qrDataUrl}" style="width: 220px; height: 220px; margin-bottom: 18px;" />
              <div style="font-size: 16px; line-height: 1.8; text-align: left;">
                <div><strong>Rice:</strong> ${item.rice}</div>
                <div><strong>Dal:</strong> ${item.dal}</div>
                <div><strong>Sachets:</strong> ${item.sachets}</div>
              </div>
            </div>
          </body>
        </html>
      `;

      await Print.printAsync({ html });
    } catch (err) {
      console.log('QR print error:', err);
      Alert.alert('Print failed', 'Could not open the print dialog.');
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Card style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.headerTextWrap}>
            <Text style={styles.eyebrow}>QR EXPORT</Text>
            <Text style={styles.title}>Printable QR Card</Text>
            <Text style={styles.subtitle}>
              Save the QR image to your device or open the native print dialog for a clean label.
            </Text>
          </View>

          <IconButton
            icon="download"
            mode="contained"
            size={22}
            iconColor={theme.primaryText}
            containerColor={theme.primary}
            onPress={handleDownload}
            disabled={isSaving}
          />
        </View>

        <View style={styles.qrPanel}>
          <View style={styles.qrFrame}>
            <QRCode
              getRef={(ref) => {
                qrRef.current = ref;
              }}
              value={item.id}
              size={220}
              color={theme.text}
              backgroundColor={theme.surfaceRaised}
            />
          </View>
          {(isSaving || isPrinting) ? (
            <ActivityIndicator color={theme.primary} size="small" style={styles.loader} />
          ) : null}
        </View>

        <View style={styles.actionsRow}>
          <Button
            mode="contained"
            icon="download"
            buttonColor={theme.primary}
            textColor={theme.primaryText}
            onPress={handleDownload}
            disabled={isSaving}
            style={styles.actionButton}
          >
            {isSaving ? 'Saving...' : 'Download QR'}
          </Button>
          <Button
            mode="outlined"
            icon="printer"
            textColor={theme.text}
            onPress={handlePrint}
            disabled={isPrinting}
            style={styles.actionButton}
          >
            {isPrinting ? 'Opening...' : 'Print QR'}
          </Button>
        </View>

        <View style={styles.detailsGrid}>
          <View style={styles.detailTile}>
            <Text style={styles.detailLabel}>Box ID</Text>
            <Text style={styles.detailValue}>{item.id}</Text>
          </View>
          <View style={styles.detailTile}>
            <Text style={styles.detailLabel}>Rice</Text>
            <Text style={styles.detailValue}>{item.rice}</Text>
          </View>
          <View style={styles.detailTile}>
            <Text style={styles.detailLabel}>Dal</Text>
            <Text style={styles.detailValue}>{item.dal}</Text>
          </View>
          <View style={styles.detailTile}>
            <Text style={styles.detailLabel}>Sachets</Text>
            <Text style={styles.detailValue}>{item.sachets}</Text>
          </View>
        </View>
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
    headerRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 12
    },
    headerTextWrap: {
      flex: 1
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
      marginBottom: 18,
      lineHeight: 20
    },
    qrPanel: {
      backgroundColor: theme.surfaceRaised,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 24,
      padding: 18,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 260,
      marginBottom: 18
    },
    qrFrame: {
      borderRadius: 12,
      overflow: 'hidden'
    },
    loader: {
      marginTop: 12
    },
    actionsRow: {
      gap: 12,
      marginBottom: 18
    },
    actionButton: {
      borderRadius: 14
    },
    detailsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10
    },
    detailTile: {
      minWidth: '45%',
      flexGrow: 1,
      backgroundColor: theme.surfaceRaised,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 18,
      padding: 14
    },
    detailLabel: {
      color: theme.muted,
      fontSize: 12,
      marginBottom: 4
    },
    detailValue: {
      color: theme.text,
      fontWeight: '800'
    }
  });
}
