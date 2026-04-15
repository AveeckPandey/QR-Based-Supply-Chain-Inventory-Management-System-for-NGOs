import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { TextInput, ActivityIndicator } from 'react-native-paper';
import { useState, useRef, useEffect } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase";

const COLORS = {
  bg: '#0F0F0F',
  surface: '#1A1A1A',
  border: '#2A2A2A',
  gold: '#C9A84C',
  goldLight: '#E8C97A',
  text: '#F0EDE6',
  muted: '#7A7670',
  error: '#E07070',
  inputBg: '#161616',
};

export default function SignIn({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(32)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, []);

  const validate = () => {
    if (!email.includes('@')) return "Enter a valid email address";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const handleSignIn = async () => {
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    try {
      setLoading(true);
      setError('');
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Background accent */}
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

        {/* Logo / Brand mark */}
        <View style={styles.brandMark}>
          <View style={styles.brandDiamond} />
        </View>

        {/* Heading */}
        <Text style={styles.heading}>Welcome{'\n'}Back</Text>
        <Text style={styles.subheading}>Sign in to continue</Text>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <View style={styles.dividerDot} />
          <View style={styles.dividerLine} />
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={[styles.inputWrapper, focusedField === 'email' && styles.inputWrapperFocused]}>
            <Text style={styles.inputLabel}>EMAIL</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              textColor={COLORS.text}
              theme={{ colors: { background: 'transparent' } }}
              placeholderTextColor={COLORS.muted}
              placeholder="you@example.com"
            />
          </View>

          <View style={[styles.inputWrapper, focusedField === 'password' && styles.inputWrapperFocused]}>
            <Text style={styles.inputLabel}>PASSWORD</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              secureTextEntry
              style={styles.input}
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              textColor={COLORS.text}
              theme={{ colors: { background: 'transparent' } }}
              placeholderTextColor={COLORS.muted}
              placeholder="••••••••"
            />
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSignIn}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color={COLORS.bg} size={20} />
              : <Text style={styles.buttonText}>Sign In</Text>
            }
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.footerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>

      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bg,
    justifyContent: 'center',
  },
  glowTop: {
    position: 'absolute',
    top: -80,
    left: '20%',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: COLORS.gold,
    opacity: 0.06,
  },
  glowBottom: {
    position: 'absolute',
    bottom: -100,
    right: '10%',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.gold,
    opacity: 0.04,
  },
  container: {
    paddingHorizontal: 28,
  },
  brandMark: {
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  brandDiamond: {
    width: 18,
    height: 18,
    backgroundColor: COLORS.gold,
    transform: [{ rotate: '45deg' }],
  },
  heading: {
    fontSize: 44,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -1,
    lineHeight: 50,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  subheading: {
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 8,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 28,
    gap: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.gold,
  },
  form: {
    gap: 16,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.inputBg,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4,
    transition: 'border-color 0.2s',
  },
  inputWrapperFocused: {
    borderColor: COLORS.gold,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.gold,
    letterSpacing: 2,
    marginBottom: 2,
  },
  input: {
    backgroundColor: 'transparent',
    fontSize: 15,
    paddingHorizontal: 0,
    height: 40,
  },
  errorBox: {
    backgroundColor: 'rgba(224,112,112,0.08)',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.error,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 13,
  },
  button: {
    backgroundColor: COLORS.gold,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: COLORS.bg,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    paddingBottom: 8,
  },
  footerText: {
    color: COLORS.muted,
    fontSize: 14,
  },
  footerLink: {
    color: COLORS.goldLight,
    fontSize: 14,
    fontWeight: '600',
  },
});