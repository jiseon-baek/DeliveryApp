import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, StyleSheet } from 'react-native';

function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const canGoNext = email && password;

    const onChangeEmail = useCallback((text) => {
        setEmail(text);
    }, []);
    const onChangePassword = useCallback((text) => {
        setPassword(text)
    }, []);

    const onSubmit = useCallback(() => {
        Alert.alert('알림', '로그인')
    },[]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>로그인</Text>
            <View style={styles.inputWrapper}>
                <Text style={!canGoNext ? styles.label : StyleSheet.compose(styles.label, styles.labelActive)}>이메일</Text>
                <TextInput onChangeText={onChangeEmail} style={styles.textInput}/>
            </View>
            <View style={styles.inputWrapper}>
                <Text style={!canGoNext ? styles.label : StyleSheet.compose(styles.label, styles.labelActive)}>비밀번호</Text>
                <TextInput onChangeText={onChangePassword} style={styles.textInput}/>
            </View>
            <View style={styles.button}>
                <Pressable onPress={onSubmit} style={!canGoNext ? styles.loginButton : StyleSheet.compose(styles.loginButton, styles.loginButtonActive)} disabled={!canGoNext}>
                    <Text style={styles.loginButtonText}>로그인</Text>
                </Pressable>
                <Pressable onPress={onSubmit}>
                    <Text>회원가입</Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex:1,
        justifyContent: 'center'
    },
    title: {
        fontSize: 20,
        alignSelf: 'center'
    },
    inputWrapper: {
        padding: 18
    },
    label: {
        color:'#C4C4C4',
        fontWeight: 'bold',
        fontSize: 14,
        marginBottom: 10,
    },
    labelActive: {
        color:'#0a9a58' 
    },
    textInput: {
        padding: 5,
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginBottom: 10
    },
    loginButtonActive: {
        backgroundColor: '#0a9a58'
    },
    loginButton: {
        backgroundColor: '#a7a7a7',
        paddingHorizontal: 20,
        paddingVertical:10,
        borderRadius: 4,
        marginBottom:10
    },
    loginButtonText: {
        color: 'white'
    },
    button: {
        alignItems: 'center'
    }
})

export default SignIn;