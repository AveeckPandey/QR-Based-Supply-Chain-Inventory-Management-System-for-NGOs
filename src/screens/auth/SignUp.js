import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, Animated, ScrollView } from 'react-native';
import { TextInput, ActivityIndicator } from 'react-native-paper';
import { useState, useRef, useEffect } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
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

export default function SignUp({ navigation }) {
  const [name, setName] = useState('');
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
    if (!name.trim()) return "Full name is required";
    if (!email.includes('@')) return "Enter a valid email address";
    if (password.length < 6) return "Password must be at least 6 characters";
    return null;
  };

  const handleSignUp = async () => {
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    try {
      setLoading(true);
      setError('');
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError("Account already exists or invalid data");
    } finally {
      setLoading(false);
    }
  };

  const inputField = (label, value, onChange, field, extra = {}) => (
    <View style={[styles.inputWrapper, focusedField === field && styles.inputWrapperFocused]}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        onFocus={() => setFocusedField(field)}
        onBlur={() => setFocusedField(null)}
        style={styles.input}
        underlineColor="transparent"
        activeUnderlineColor="transparent"
        textColor={COLORS.text}
        theme={{ colors: { background: 'transparent' } }}
        placeholderTextColor={COLORS.muted}
        {...extra}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Ambient glow blobs */}
      <View style={styles.glowTop} />
      <View style={styles.glowRight} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>

          {/* Brand mark */}
          <View style={styles.brandMark}>
            <View style={styles.brandSquare} />
            <View style={styles.brandSquareInner} />
          </View>

          {/* Heading */}
          <Text style={styles.heading}>Create{'\n'}Account</Text>
          <Text style={styles.subheading}>Join us today</Text>

          {/* Step indicator */}
          <View style={styles.stepRow}>
            <View style={styles.dividerLine} />
            <View style={styles.stepBadge}>
              <Text style={styles.stepText}>NEW</Text>
            </View>
            <View style={styles.dividerLine} />
          </View>

          {/* Form */}
          <View style={styles.form}>
            {inputField('FULL NAME', name, setName, 'name', {
              placeholder: 'Your name',
              autoCapitalize: 'words',
            })}
            {inputField('EMAIL', email, setEmail, 'email', {
              placeholder: 'you@example.com',
              keyboardType: 'email-address',
              autoCapitalize: 'none',
            })}
            {inputField('PASSWORD', password, setPassword, 'password', {
              placeholder: '••••••••',
              secureTextEntry: true,
            })}

            {/* Password strength hint */}
            <View style={styles.strengthRow}>
              {[1, 2, 3, 4].map(i => (
                <View
                  key={i}
                  style={[
                    styles.strengthBar,
                    password.length >= i * 2 && styles.strengthBarActive,
                  ]}
                />
              ))}
              <Text style={styles.strengthLabel}>
                {password.length === 0 ? 'Min. 6 characters' :
                  password.length < 4 ? 'Too short' :
                  password.length < 8 ? 'Fair' : 'Strong'}
              </Text>
            </View>

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSignUp}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color={COLORS.bg} size={20} />
                : <Text style={styles.buttonText}>Create Account</Text>
              }
            </TouchableOpacity>

            <Text style={styles.terms}>
              By signing up you agree to our{' '}
              <Text style={styles.termsLink}>Terms of Service</Text>
              {' '}and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                <Text style={styles.footerLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>

        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  glowTop: {
    position: 'absolute',
    top: -60,
    right: '15%',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: COLORS.gold,
    opacity: 0.06,
  },
  glowRight: {
    position: 'absolute',
    bottom: 60,
    left: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: COLORS.gold,
    opacity: 0.04,
  },
  container: {
    paddingHorizontal: 28,
  },
  brandMark: {
    alignItems: 'flex-start',
    marginBottom: 32,
    position: 'relative',
    width: 24,
    height: 24,
  },
  brandSquare: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: COLORS.gold,
    borderRadius: 3,
  },
  brandSquareInner: {
    position: 'absolute',
    top: 6,
    left: 6,
    width: 10,
    height: 10,
    backgroundColor: COLORS.gold,
    borderRadius: 2,
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
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 28,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  stepBadge: {
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  stepText: {
    color: COLORS.gold,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
  },
  form: {
    gap: 14,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: COLORS.inputBg,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 4,
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
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: -4,
  },
  strengthBar: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.border,
  },
  strengthBarActive: {
    backgroundColor: COLORS.gold,
  },
  strengthLabel: {
    color: COLORS.muted,
    fontSize: 11,
    marginLeft: 4,
    minWidth: 80,
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
  terms: {
    color: COLORS.muted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 4,
  },
  termsLink: {
    color: COLORS.goldLight,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4,
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