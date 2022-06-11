import {NativeStackScreenProps} from '@react-navigation/native-stack';
import React, {useCallback, useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
} from 'react-native';
import {RootStackParamList} from '../../App';
import DismissKeyboardView from '../components/DismissKeyboardVies';

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

function SignIn({navigation}: SignInScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);

  const canGoNext = email && password;

  const onChangeEmail = useCallback(text => {
    setEmail(text.trim());
  }, []);
  const onChangePassword = useCallback(text => {
    setPassword(text.trim());
  }, []);

  const onSubmit = useCallback(() => {
    if (!email || !email.trim()) {
      return Alert.alert('알림', '이메일을 입력해주세요');
    }
    if (!password || !password.trim()) {
      return Alert.alert('알림', '비밀번호를 입력해주세요');
    }
    Alert.alert('알림', '로그인되었습니다');
  }, [email, password]);

  const toSignUp = useCallback(() => {
    navigation.navigate('SignUp');
  }, []);

  return (
    <DismissKeyboardView>
      <View style={styles.container}>
        <Text style={styles.title}>로그인</Text>
        <View style={styles.inputWrapper}>
          <Text
            style={
              !canGoNext
                ? styles.label
                : StyleSheet.compose(styles.label, styles.labelActive)
            }>
            이메일
          </Text>
          <TextInput
            onChangeText={onChangeEmail}
            value={email}
            style={styles.textInput}
            importantForAutofill="yes"
            autoComplete="email"
            textContentType="emailAddress"
            keyboardType="email-address"
            returnKeyType="next"
            onSubmitEditing={() => {
              passwordRef.current?.focus();
            }}
            ref={emailRef}
            blurOnSubmit={false}
            clearButtonMode="while-editing"
          />
        </View>
        <View style={styles.inputWrapper}>
          <Text
            style={
              !canGoNext
                ? styles.label
                : StyleSheet.compose(styles.label, styles.labelActive)
            }>
            비밀번호
          </Text>
          <TextInput
            onChangeText={onChangePassword}
            value={password}
            style={styles.textInput}
            ref={passwordRef}
            importantForAutofill="yes"
            autoComplete="password"
            textContentType="password"
            secureTextEntry
            onSubmitEditing={onSubmit}
          />
        </View>
        <View style={styles.button}>
          <Pressable
            onPress={onSubmit}
            style={
              !canGoNext
                ? styles.loginButton
                : StyleSheet.compose(
                    styles.loginButton,
                    styles.loginButtonActive,
                  )
            }
            disabled={!canGoNext}>
            <Text style={styles.loginButtonText}>로그인</Text>
          </Pressable>
          <Pressable onPress={toSignUp}>
            <Text style={styles.signUpText}>회원가입</Text>
          </Pressable>
        </View>
      </View>
    </DismissKeyboardView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    alignSelf: 'center',
  },
  inputWrapper: {
    padding: 18,
  },
  label: {
    color: '#C4C4C4',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 10,
  },
  labelActive: {
    color: '#0a9a58',
  },
  textInput: {
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 10,
  },
  loginButtonActive: {
    backgroundColor: '#0a9a58',
  },
  loginButton: {
    backgroundColor: '#a7a7a7',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
    marginBottom: 14,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
  },
  button: {
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 16,
  },
});

export default SignIn;
