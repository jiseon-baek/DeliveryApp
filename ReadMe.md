# 첫 시작(setting)
[공식문서](https://reactnative.dev/)
- 초기 세팅: [반드시 따라하기](https://reactnative.dev/docs/environment-setup)
- java 17 버전 설치하면 안 됨(11버전 설치할 것), 환경 변수 설정도 잘 해 놓을 것(JAVA_HOME)
- Android SDK 30이 있어야 함. 가상기기는 Nexus 5로 받을 것
- [adb](https://developer.android.com/studio/releases/platform-tools) 설치 필요, ANDROID_HOME 환경변수도
```shell
npx react-native init FoodDeliveryApp --template react-native-template-typescript
```
보통은 강의용으로 자동생성 안 좋아하는데 RN은 자동생성하지 않으면 네이티브단까지 처리하기 어려움 

```shell
cd FoodDeliveryApp # 폴더로 이동
npm run android # 안드로이드 실행 명령어
npm run ios # 아이폰 실행 명령어
```

서버가 하나 뜰 것임. Metro 서버. 여기서 소스 코드를 컴파일하고 앱으로 전송해줌. 기본 8081포트.
메트로 서버가 꺼져있다면 터미널을 하나 더 열어
```shell
npm start
```
개발은 iOS 기준으로 하는 게 좋다(개인 경험). 그러나 강좌는 어쩔 수 없이 Windows로 한다.

react-native@0.66 버전, 한 달에 0.1씩 올라가는데 요즘 개발 속도가 느려져서 규칙이 깨짐. 거의 완성 단계라 신규 기능은 npm에서 @react-native-community로부터 받아야 함. 버전 업그레이드 함부로 하지 말 것!

[맥 전용]npx pod-install도 미리 한 번, iOS 라이브러리 받는 용도

## 폴더 구조
- android: 안드로이드 네이티브 폴더
- ios: ios 네이티브 폴더
- node_modules: 노드 라이브러리
- app.json: name은 앱 컴포넌트 이름이니 함부로 바꾸면 안 됨, 이거 바꾸면 네이티브 컴포넌트 이름도 다 바꿔야함, displayName은 앱 이름 변경용
  - ios/FoodDeliveryApp/AppDelegate.m 의 moduleName
  - android/app/src/main/java/com/fooddeliveryapp/MainActivity.java 의 getMainComponentName
- babel.config.js: 바벨 설정
- index.js: 메인 파일
- App.tsx: 기본 App 컴포넌트
- metro.config.js: 메트로 설정 파일(웹팩 대신 사용)
- tsconfig.json: 타입스크립트 설정
- android/app/src/main/java/com/fooddeliveryapp/MainActivity.java: 안드로이드 액티비티에서 js엔진 통해 리액트 코드 실행 + bridge로 소통

## 앱 실행 후
- cmd + R로 리로딩
- cmd + D로 디버그 메뉴
- Debugging with Chrome으로 개발자 도구 사용 가능
- Configure Bundler로 메트로 서버 포트 변경 가능
- Show Perf Monitor로 프레임 측정 가능

[Flipper](https://fbflipper.com/) 페이스북이 만든 모바일앱 디버거도 좋음(다만 연결 시 에러나는 사람 다수 발견)
- setup doctor 문제 해결할 것
```shell
npm i react-native-flipper redux-flipper rn-async-storage-flipper
npx pod-install # 아이폰 전용
```
- flipper-plugin-async-storage
- flipper-plugin-redux-debugger
- Layout, Network, Images, Database(sqlite), React Devtools, Hermes Debugger 사용 가능

## 앱 이름 변경
\android\app\src\main\res\values\strings.xml
app.json의 displayName
\ios\FoodDeliveryApp\Info.plist의 CFBundleDisplayName

## 리액트 네이티브 폴더 구조
- src 폴더 생성(지금 바로 생성 안 하고 폴더 안에 파일이 들 때 생성해도 됨)
- src/assets: 이미지, 폰트, 비디오 등
- src/constants: 상수
- src/pages: 페이지 단위 컴포넌트
- src/components: 기타 컴포넌트
- src/contexts: context api 모음
- src/hooks: 커스텀 훅 모음
- src/modules: 네이티브 모듈
- src/store: 리덕스 스토어 세팅
- src/slices: 리덕스 슬라이스
- types: 타입 정의

# 코딩 시작!
## App.tsx 분석
- View가 div, Text가 span이라고 생각하기(1대1 매칭은 아님)
- css는 dp 단위(density-independent pixels, 다양한 화면 크기에 영향받지 않음)
- [css 속성 리스트](https://github.com/vhpoet/react-native-styling-cheat-sheet): 좀 오래됨
- flex에서는 flexDirection이 Column이 default

## React Navigation
react-router-native도 대안임(웹에서 넘어온 개발자들에게 친숙, 웹처럼 주소 기반)
```shell
npm i @react-navigation/native
npm i @react-navigation/native-stack
npm i react-native-screens react-native-safe-area-context
npx pod-install # 맥 전용
```
android/app/src/main/java/FoodDeliveryApp/MainActivity.java
```java
import android.os.Bundle;
...
@Override
protected void onCreate(Bundle savedInstanceState) {
  super.onCreate(null);
}
```
App.tsx 교체
```typescript jsx
import * as React from 'react';
import {NavigationContainer, ParamListBase} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import {Text, TouchableHighlight, View} from 'react-native';
import {useCallback} from 'react';

type RootStackParamList = {
  Home: undefined;
  Details: undefined;
};
type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
type DetailsScreenProps = NativeStackScreenProps<ParamListBase, 'Details'>;

function HomeScreen({navigation}: HomeScreenProps) {
  const onClick = useCallback(() => {
    navigation.navigate('Details');
  }, [navigation]);

  return (
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <TouchableHighlight onPress={onClick}>
              <Text>Home Screen</Text>
            </TouchableHighlight>
          </View>
  );
}

function DetailsScreen({navigation}: DetailsScreenProps) {
  const onClick = useCallback(() => {
    navigation.navigate('Home');
  }, [navigation]);

  return (
          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <TouchableHighlight onPress={onClick}>
              <Text>Details Screen</Text>
            </TouchableHighlight>
          </View>
  );
}

const Stack = createNativeStackNavigator();
function App() {
  return (
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
              <Stack.Screen
                      name="Home"
                      component={HomeScreen}
                      options={{title: 'Overview'}}
              />
              <Stack.Screen name="Details">
                {props => <DetailsScreen {...props} />}
              </Stack.Screen>
            </Stack.Navigator>
          </NavigationContainer>
  );
}

export default App;
```
- safe-area가 적용되어 있음(설명)
- NavigationContainer: 내비게이션 상태 저장
- Navigator 안에 Screen들 배치
- Screen name 대소문자 상관 없음, component는 보통 두 가지 방식 사용(컴포넌트 그 자체 vs Render Callback)
- props로 navigation과 route가 전달됨
- Pressable, Button, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback
- navigation.navigate로 이동 가능
- navigation.push로 쌓기 가능
- navigation.goBack으로 이전으로 이동
- params 추가 가능(객체 넣지 말기, 글로벌 스토어에 넣기)
- Screen options.title: 제목
- Screen options에 함수를 넣어 route.params로 params 접근 가능
- navigation.setOptions로 옵션 변경 가능
- Navigator screenOptions로 공통 옵션 설정
- Screen options.headerShown로 헤더표시여부
- Screen options.headerTitle로 커스텀 컴포넌트
- Screen options.headerRight로 우측 버튼(useLayoutEffect)
[옵션 목록](https://reactnavigation.org/docs/screen-options)

## 실제 라우터 만들기 (ch1)
```shell
npm install @react-navigation/bottom-tabs
```

App.tsx
```typescript jsx

```
- Tab.Navigator 도입
- isLoggedIn 분기처리
- Drawer과 Tab.Group 사용처 소개
src/pages/Delivery.tsx
```typescript jsx

```
- Navigator는 nesting 가능
## 회원가입, 로그인 화면 만들기
src/components/DismissKeyBoardView.tsx
```typescript jsx
import React from 'react';
import {
  TouchableWithoutFeedback,
  Keyboard,
  StyleProp,
  ViewStyle,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const DismissKeyboardHOC = (
  Comp: typeof KeyboardAvoidingView,
): React.FC<{style?: StyleProp<ViewStyle>}> => {
  return ({children, ...props}) => (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <Comp
        {...props}
        style={props.style}
        behavior={Platform.OS === 'android' ? undefined : 'padding'}>
        {children}
      </Comp>
    </TouchableWithoutFeedback>
  );
};
const DismissKeyboardView = DismissKeyboardHOC(KeyboardAvoidingView);

export default DismissKeyboardView;
```
인풋 바깥 클릭 시 키보드를 가리기 위함
- src/pages/SignIn.tsx
- src/pages/SignUp.tsx
- src/components/DismissKeyboardView.tsx
- TextInput, StyleSheet.compose 사용
- DismissKeyboardView 만들기(Keyboard, KeyboardAvoidingView)
- react-native-keyboard-aware-scrollview
``` shell
npm i react-native-keyboard-avoiding-view  
```
src/components/DismissKeyBoardView.tsx
```typescript jsx

```
## 서버 요청 보내기(ch2)

back 서버 실행 필요, DB 없이도 되게끔 만들어둠. 서버 재시작 시 데이터는 날아가니 주의
```shell
# 터미널 하나 더 켜서
cd back
npm start
```

리덕스 설정
```shell
npm i @reduxjs/toolkit react-redux redux-flipper
```
src/store/index.ts와 src/store/reducer.ts, src/slices/user.ts 작성

AppInner.tsx 생성 및 isLoggedIn을 redux로 교체(AppInner 분리 이유는 App.tsx에서 useSelector를 못 씀)

App.tsx
```typescript jsx
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import store from './src/store';
import AppInner from './AppInner';

function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppInner />
      </NavigationContainer>
    </Provider>
  );
}

export default App;
```
## 회원가입, 로그인, 로그아웃
액세스토큰/리프레시토큰을 받아서 다음 라이브러리로 저장
```shell
npm install react-native-encrypted-storage
npx pod-install # ios 전용
```
서버 요청은 axios 사용(요즘 ky나 got으로 넘어가는 추세이나 react-native와 호환 여부 불투명)
```shell
npm i axios
```
환경변수, 키 값을 저장할 config 패키지 
```shell
npm i react-native-config
```
```typescript jsx
import Config from 'react-native-config';
```
android/app/proguard-rules.pro
```
-keep class com.zerocho.fooddeliveryapp.BuildConfig { *; }
```
android/app/build.gradle
```
apply plugin: "com.android.application"
apply from: project(':react-native-config').projectDir.getPath() + "/dotenv.gradle"
...
    defaultConfig {
        ...
        resValue "string", "build_config_package", "com.zerocho.fooddeliveryapp"
    }
```
- .env에 키=값 저장해서(예를 들어 abc=def) Config.abc로 꺼내 씀
.env
```
API_URL=http://10.0.2.2:3105
```
-10.0.2.2로 해야 함(localhost로 하면 안드로이드에서 안 됨)
암호화해서 저장할 데이터는 다음 패키지에
```
import EncryptedStorage from 'react-native-encrypted-storage';
```
```typescript jsx
await EncryptedStorage.setItem('키', '값');
await EncryptedStorage.removeItem('키', '값');
const 값 = await EncryptedStorage.getItem('키', '값');
```
- 자주 바뀌는 값이거나 민감한 값은 encrypted-storage에
- 개발 환경별로 달라지는 값은 react-native-config에 저장하면 좋음(암호화 안 됨)
src/pages/SignUp.tsx, src/pages/SignIn.tsx, src/pages/Settings.tsx
```
```
android에서 http 요청이 안 보내지면
- android/app/src/main/AndroidManifest.xml 에서 <application> 태그에 android:usesCleartextTraffic="true" 추가
## 소켓IO 연결
웹소켓 기반 라이브러리
- 요청-응답 방식이 아니라 실시간 양방향 통신 가능
```shell
npm i socket.io-client
```
src/hooks/useSocket.ts
```typescript jsx
import {useCallback} from 'react';
import {io, Socket} from 'socket.io-client';
import Config from 'react-native-config';

let socket: Socket | undefined;
const useSocket = (): [Socket | undefined, () => void] => {
  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      socket = undefined;
    }
  }, []);
  if (!socket) {
    socket = io(`${Config.API_URL}`, {
      transports: ['websocket'],
      path: '/socket-io',
    });
  }
  return [socket, disconnect];
};

export default useSocket;
```
AppInner.tsx
```typescript jsx
  const [socket, disconnect] = useSocket();

  useEffect(() => {
    const helloCallback = (data: any) => {
      console.log(data);
    };
    if (socket && isLoggedIn) {
      console.log(socket);
      socket.emit('login', 'hello');
      socket.on('hello', helloCallback);
    }
    return () => {
      if (socket) {
        socket.off('hello', helloCallback);
      }
    };
  }, [isLoggedIn, socket]);

  useEffect(() => {
    if (!isLoggedIn) {
      console.log('!isLoggedIn', !isLoggedIn);
      disconnect();
    }
  }, [isLoggedIn, disconnect]);
```
*로그아웃 시에 disconnect해주는 것 잊지 말기

## 앱 다시 켤 때 자동로그인되게[ch3]
encrypted-storage에서 토큰 불러오기

AppInner.tsx
```typescript
  // 앱 실행 시 토큰 있으면 로그인하는 코드
  useEffect(() => {
    const getTokenAndRefresh = async () => {
      try {
        const token = await EncryptedStorage.getItem('refreshToken');
        if (!token) {
          return;
        }
        const response = await axios.post(
          `${Config.API_URL}/refreshToken`,
          {},
          {
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        );
        dispatch(
          userSlice.actions.setUser({
            name: response.data.data.name,
            email: response.data.data.email,
            accessToken: response.data.data.accessToken,
            refreshToken: token,
          }),
        );
      } catch (error) {
        console.error(error);
        if ((error as AxiosError).response?.data.code === 'expired') {
          Alert.alert('알림', '다시 로그인 해주세요.');
        }
      }
    };
    getTokenAndRefresh();
  }, [dispatch]);
```
- 잠깐 로그인 화면이 보이는 것은 SplashScreen으로 숨김
socket.io에서 주문 내역 받아서 store에 넣기

AppInner.tsx
```typescript
  useEffect(() => {
    const callback = (data: any) => {
      console.log(data);
    };
    if (socket && isLoggedIn) {
      socket.emit('acceptOrder', 'hello');
      socket.on('order', callback);
    }
    return () => {
      if (socket) {
        socket.off('order', callback);
      }
    };
  }, [isLoggedIn, socket]);
```
src/slices/order.ts
```typescript

```
src/pages/Orders.tsx
```typescript jsx

```
- ScrollView + map 조합은 좋지 않음
- 반복되는 것은 컴포넌트로 빼는 것이 좋음
- keyExtractor 반드시 설정하기
src/components/EachOrder.tsx
```typescript jsx

```
## 주문 수락/거절
accessToken 만료시 자동으로 refresh되게 axios.interceptor 설정
```typescript
  useEffect(() => {
    axios.interceptors.response.use(
      response => {
        return response;
      },
      async error => {
        const {
          config,
          response: {status},
        } = error;
        if (status === 419) {
          if (error.response.data.code === 'expired') {
            const originalRequest = config;
            const refreshToken = await EncryptedStorage.getItem('refreshToken');
            // token refresh 요청
            const {data} = await axios.post(
              `${Config.API_URL}/refreshToken`, // token refresh api
              {},
              {headers: {authorization: `Bearer ${refreshToken}`}},
            );
            // 새로운 토큰 저장
            dispatch(userSlice.actions.setAccessToken(data.data.accessToken));
            originalRequest.headers.authorization = `Bearer ${data.data.accessToken}`;
            // 419로 요청 실패했던 요청 새로운 토큰으로 재요청
            return axios(originalRequest);
          }
        }
        return Promise.reject(error);
      },
    );
  }, [dispatch]);
```
## 수익금 확인하기
src/pages/Settings.tsx
```

```
## 네이버 지도 사용하기[ch4]
```shell
npm i react-native-nmap --force
npx pod-install # ios 전용
```
[ios]git-lfs로 추가 설치 필요 [참고](https://github.com/navermaps/ios-map-sdk#%EB%8C%80%EC%9A%A9%EB%9F%89-%ED%8C%8C%EC%9D%BC%EC%9D%84-%EB%B0%9B%EA%B8%B0-%EC%9C%84%ED%95%B4-git-lfs-%EC%84%A4%EC%B9%98%EA%B0%80-%ED%95%84%EC%9A%94%ED%95%A9%EB%8B%88%EB%8B%A4)
- 안드로이드 앱 패키지 이름: com.[원하는이름].fooddeliveryapp (ex: com.zerocho.fooddeliveryapp)
- [커밋 참조](https://github.com/ZeroCho/food-delivery-app/commit/36295cabf2cdab4ed68fa3b907c7b467101a02a5) (폴더 등 변경할 게 많음)
- [iOS]Xcode로는 xcworkspace 파일을 열어야함(xcodeproj 열면 안됨)
- iOS Bundle ID: com.[원하는이름].fooddeliveryapp(ex: com.zerocho.fooddeliveryapp)로 수정
src/components/EachOrder.tsx
```typescript jsx
<View
        style={{
          width: Dimensions.get('window').width - 30,
          height: 200,
          marginTop: 10,
        }}>
  <NaverMapView
          style={{width: '100%', height: '100%'}}
          zoomControl={false}
          center={{
            zoom: 10,
            tilt: 50,
            latitude: (start.latitude + end.latitude) / 2,
            longitude: (start.longitude + end.longitude) / 2,
          }}>
    <Marker
            coordinate={{
              latitude: start.latitude,
              longitude: start.longitude,
            }}
            pinColor="blue"
    />
    <Path
            coordinates={[
              {
                latitude: start.latitude,
                longitude: start.longitude,
              },
              {latitude: end.latitude, longitude: end.longitude},
            ]}
    />
    <Marker
            coordinate={{latitude: end.latitude, longitude: end.longitude}}
    />
  </NaverMapView>
</View>
```
## 위치 정보 가져오기
권한 얻기(위치정보, 카메라, 갤러리)
```
npm i react-native-permissions
```
ios/Podfile
```
permissions_path = '../node_modules/react-native-permissions/ios'
pod 'Permission-Camera', :path => "#{permissions_path}/Camera"
pod 'Permission-LocationAccuracy', :path => "#{permissions_path}/LocationAccuracy"
pod 'Permission-LocationAlways', :path => "#{permissions_path}/LocationAlways"
pod 'Permission-LocationWhenInUse', :path => "#{permissions_path}/LocationWhenInUse"
pod 'Permission-Notifications', :path => "#{permissions_path}/Notifications"
pod 'Permission-PhotoLibrary', :path => "#{permissions_path}/PhotoLibrary"
```
ios/FoodDeliveryApp/Info.plist
```
<key>NSCameraUsageDescription</key>
<string>배송완료 사진 촬영을 위해 카메라 권한이 필요합니다.</string>
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>배송중 위치 확인을 위해서 위치 권한이 필요합니다.</string>
<key>NSLocationAlwaysUsageDescription</key>
<string>배송중 위치 확인을 위해서 위치 권한이 필요합니다.</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>배송중 위치 확인을 위해서 위치 권한이 필요합니다.</string>
<key>NSMotionUsageDescription</key>
<string>배송중 위치 확인을 위해서 위치 권한이 필요합니다.</string>
<key>NSPhotoLibraryAddUsageDescription</key>
<string>배송완료 사진 선택을 위해 라이브러리 접근 권한이 필요합니다.</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>배송완료 사진 선택을 위해 라이브러리 접근 권한이 필요합니다.</string>
```
android/app/src/main/AndroidManifest.xml
```
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA"/>
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.VIBRATE"/>
```
```shell
npx pod-install
```
- [플로우](https://github.com/zoontek/react-native-permissions)를 잘 볼 것

src/hooks/usePermissions.ts
```typescript jsx
import {useEffect} from 'react';
import {Alert, Linking, Platform} from 'react-native';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';

function usePermissions() {
  // 권한 관련
  useEffect(() => {
    if (Platform.OS === 'android') {
      check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
        .then(result => {
          console.log('check location', result);
          if (result === RESULTS.BLOCKED || result === RESULTS.DENIED) {
            Alert.alert(
              '이 앱은 위치 권한 허용이 필요합니다.',
              '앱 설정 화면을 열어서 항상 허용으로 바꿔주세요.',
              [
                {
                  text: '네',
                  onPress: () => Linking.openSettings(),
                },
                {
                  text: '아니오',
                  onPress: () => console.log('No Pressed'),
                  style: 'cancel',
                },
              ],
            );
          }
        })
        .catch(console.error);
    } else if (Platform.OS === 'ios') {
      check(PERMISSIONS.IOS.LOCATION_ALWAYS)
        .then(result => {
          if (result === RESULTS.BLOCKED || result === RESULTS.DENIED) {
            Alert.alert(
              '이 앱은 백그라운드 위치 권한 허용이 필요합니다.',
              '앱 설정 화면을 열어서 항상 허용으로 바꿔주세요.',
              [
                {
                  text: '네',
                  onPress: () => Linking.openSettings(),
                },
                {
                  text: '아니오',
                  onPress: () => console.log('No Pressed'),
                  style: 'cancel',
                },
              ],
            );
          }
        })
        .catch(console.error);
    }
    if (Platform.OS === 'android') {
      check(PERMISSIONS.ANDROID.CAMERA)
        .then(result => {
          if (result === RESULTS.DENIED || result === RESULTS.GRANTED) {
            return request(PERMISSIONS.ANDROID.CAMERA);
          } else {
            console.log(result);
            throw new Error('카메라 지원 안 함');
          }
        })
        .catch(console.error);
    } else {
      check(PERMISSIONS.IOS.CAMERA)
        .then(result => {
          if (
            result === RESULTS.DENIED ||
            result === RESULTS.LIMITED ||
            result === RESULTS.GRANTED
          ) {
            return request(PERMISSIONS.IOS.CAMERA);
          } else {
            console.log(result);
            throw new Error('카메라 지원 안 함');
          }
        })
        .catch(console.error);
    }
  }, []);
}

export default usePermissions;
```
- Platform으로 운영체제 구별
- Linking으로 다른 서비스 열기 가능
위치 정보 가져오기
```shell
npm i @react-native-community/geolocation
```
src/pages/Ing.tsx
```
```
## 이미지 선택하기(주문 완료)
src/pages/Complete.tsx
```
```
이미지 선택 후 리사이징
```shell
npm i react-native-image-crop-picker
npm i react-native-image-resizer
npx pod-install # ios 전용
```
- 이미지 업로드에는 multipart/formData를 사용함
- 이미지는 { uri: 주소, filename: 파일명, type: 확장자 } 꼴
## 사진 찍을 때 이미지를 카메라롤/갤러리에 저장하고 싶음: Native Module Patching[ch5]
```shell
npm i patch-package
```
package.json
```json
  "scripts": {
    "postinstall": "patch-package",
    "android": "react-native run-android",
```
- patch 후 적용하기
```shell
npx patch-package react-native-image-crop-picker
```
- 앞으로 npm i 할 때마다 자동으로 패치가 적용됨(postinstall 스크립트 덕분)
- 이런 것 때문에 네이티브를 알아야함 ㅠ

## Tmap 연결하기(Native Modules)
[가입](https://openapi.sk.com/)
- My Project - 프로젝트 생성 - TMap API 신청(무료)
- [sdk](https://openapi.sk.com/resource/sdk/indexView)
- [안드로이드 연동](http://tmapapi.sktelecom.com/main.html#android/guide/androidGuide.sample1)
- [iOS 연동](http://tmapapi.sktelecom.com/main.html#ios/guide/iosGuide.sample1)
- iOS 연동시 Header 파일들이 project.pbxproj에 등록되었나 확인(다른 것도 당연히)
- android/app/src/java/com/zerocho/fooddeliveryapp/TMapModule.java 생성
- android/app/src/java/com/zerocho/fooddeliveryapp/TMapPackage.java 생성
- android/app/src/java/com/zerocho/fooddeliveryapp/MainApplication에 TMapPackage 연결
- ios/FoodDeliveryApp/RCTTMap.h
- ios/FoodDeliveryApp/RCTTMap.m
- ios/FoodDeliveryApp-Bridging-Header.h
- src/modules/TMap.ts
src/pages/Ing.tsx
```typescript jsx
TMap.openNavi(
  '도착지',
  end.longitude.toString(),
  end.latitude.toString(),
  'MOTORCYCLE',
).then(data => {
  console.log('TMap callback', data);
  if (!data) {
    Alert.alert('알림', '티맵을 설치하세요.');
  }
});
```
## react-native-splash-screen
```shell
npm i react-native-splash-screen
```

## FCM
- 푸쉬알림 보내기
```shell
npm i @react-native-firebase/analytics @react-native-firebase/app @react-native-firebase/messaging
npm i react-native-push-notification
```
## 배포 관련[ch6]
### Android

### iOS
iOS 개발자 멤버쉽

### fastlane
버저닝, 배포 자동화 가능

### CodePush
- 실시간으로 앱 수정 가능(JS코드, 이미지, 비디오만)
- 노드모듈, 네이티브쪽은 앱 배포 필요
```shell
npm i react-native-code-push
```
App.tsx
```typescript jsx
import codePush from "react-native-code-push";

class MyApp extends Component {
}

MyApp = codePush(MyApp);
```

## iOS Pod 관련
[맥 전용]ios 폴더 안에서 pod 명령어 수행 가능, but npx pod-install은 프로젝트 폴더 어디서나 가능
- Podfile: 설치할 Pod과 개별설정들 기록
- pod deintegrate: 기존 pod들 제거
- pod update: 기존 pod 버전 업그레이드(pod install 시)
- pod install: npx pod-install 역할 Podfile.lock에 따라 설치

## Hermes 켜기
android/app/build.gradle
```

```
# 꿀팁들
- [patch-package](https://www.npmjs.com/package/patch-package): 노드모듈즈 직접 수정 가능, 유지보수 안 되는 패키지 업데이트 시 유용, 다만 patch-package한 패키지는 추후 버전 안 올리는 게 좋음
- [Sentry](https://sentry.io/): 배포 시 React Native용으로 붙여서 에러 모니터링하면 좋음(무료 지원)
- [react-native-upgrade helper](https://react-native-community.github.io/upgrade-helper/): 버전 업그레이드 방법 나옴

# 에러들
## Error: listen EADDRINUSE: address already in use :::8081
이미 메트로 서버가 다른 데서 켜져 있는 것임. 메트로 서버를 실행하고 있는 터미널 종료하기
## java.lang.RuntimeException: Unable to load script. Make sure you're either running Metro (run 'npx react-native start') or that your bundle 'index.android.bundle' is packaged correctly for release.
- android/app/src/main/assets 폴더 만들기
```shell
cd android
./gradlew clean
cd ..
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle
```
## Execution failed for task ':app:packageDebug'. > java.lang.OutOfMemoryError (no error message)
android/gradle.properties에 다음 줄 추가
```
org.gradle.jvmargs=-XX\:MaxHeapSize\=1024m -Xmx1024m
```
또는

android/app/src/main/AndroidManifest.xml 에서 <application> 태그에 android:largeHeap="true" 추가
## warn No apps connected. Sending "reload" to all React Native apps failed. Make sure your app is running in the simulator or on a phone connected via USB.
```
npx react-native start --reset-cache
cd android && ./gradlew clean
cd ..
npx react-native run-android
```
