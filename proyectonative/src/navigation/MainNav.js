import React, {Component} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import Register from '../screens/Register'
const Stack = createNativeStackNavigator()
import Login from '../screens/Login'
import TabNav from './TabNav'
import EditUser from '../screens/EditUser'

export default class MainNav extends Component {


    render( ) {
        return(
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name='register' component={Register} options = {{ headerShown: false}}/>
                    <Stack.Screen name='login' component= {Login} options = {{ headerShown: false}}/>
                    <Stack.Screen name='tabnav' component={TabNav}  options={{headerShown : false}}/>
                    <Stack.Screen name = 'EditUser' component = {EditUser}  />
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
}