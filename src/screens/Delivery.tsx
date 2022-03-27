import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Text, View } from 'react-native';
import Complete from './Complete';
import Ing from './Ing';

const Stack = createNativeStackNavigator();
function Delivery() {
    return (
        <Stack.Navigator initialRouteName="Ing">
            <Stack.Screen name="진행중" component={Ing} options={{headerShown: false}}/>
            <Stack.Screen name="완료" component={Complete} options={{headerShown: false}}/>
        </Stack.Navigator>
    ) 
}

export default Delivery;