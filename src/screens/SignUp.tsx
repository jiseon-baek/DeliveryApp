import {NativeStackScreenProps} from '@react-navigation/native-stack';
import axios, {AxiosError} from 'axios';
import React, {useCallback, useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Config from 'react-native-config';
import {RootStackParamList} from '../../App';
import DismissKeyboardView from '../components/DismissKeyboardVies';

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

function SignUp({navigation}: SignInScreenProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);
  const nameRef = useRef<TextInput | null>(null);

  const canGoNext = email && password;

  const onChangeEmail = useCallback(text => {
    setEmail(text.trim());
  }, []);
  const onChangePassword = useCallback(text => {
    setPassword(text.trim());
  }, []);
  const onChangeName = useCallback(text => {
    setName(text.trim());
  }, []);

  const onSubmit = useCallback(async () => {
    if (loading) {
      return;
    }
    if (!email || !email.trim()) {
      return Alert.alert('알림', '이메일을 입력해주세요');
    }
    if (!name || !name.trim()) {
      return Alert.alert('알림', '이름을 빼먹었네요');
    }
    if (!password || !password.trim()) {
      return Alert.alert('알림', '비밀번호를 입력해주세요');
    }
    if (
      !/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(
        email,
      )
    ) {
      return Alert.alert('알림', '올바른 이메일 주소가 아닙니다.');
    }
    if (!/^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[$@^!%*#?&]).{8,50}$/.test(password)) {
      return Alert.alert(
        '알림',
        '비밀번호는 영문,숫자,특수문자($@^!%*#?&)를 모두 포함하여 8자 이상 입력해야합니다.',
      );
    }

    try {
      setLoading(true);
      const response = await axios.post(`${Config.API_URL}/user`, {
        email,
        name,
        password,
      });
      console.log(response);

      Alert.alert('알림', '회원가입되었습니다.');
    } catch (error) {
      const errorRes = (error as AxiosError).response;
      console.error(errorRes);
      if (errorRes) {
        Alert.alert('알림', errorRes.data.message);
      }
    } finally {
      setLoading(false);
    }
  }, [loading, email, name, password]);

  const toSignUp = useCallback(() => {
    navigation.navigate('SignUp');
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원가입</Text>
      <DismissKeyboardView>
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
            이름
          </Text>
          <TextInput
            onChangeText={onChangeName}
            value={name}
            style={styles.textInput}
            textContentType="name"
            returnKeyType="next"
            onSubmitEditing={() => {
              passwordRef.current?.focus();
            }}
            ref={nameRef}
            blurOnSubmit={false}
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
            style={
              canGoNext
                ? StyleSheet.compose(
                    styles.loginButton,
                    styles.loginButtonActive,
                  )
                : styles.loginButton
            }
            disabled={!canGoNext || loading}
            onPress={onSubmit}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.loginButtonText}>가입하기</Text>
            )}
          </Pressable>
        </View>
      </DismissKeyboardView>
    </View>
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

export default SignUp;
