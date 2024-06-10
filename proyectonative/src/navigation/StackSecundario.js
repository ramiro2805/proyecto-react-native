import React, {Component} from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import Feed from '../screens/Feed'
import PerfilUsuario from '../screens/PerfilUsuario'
import DetallePosteo from '../screens/DetallePosteo'

const Stack = createNativeStackNavigator()
export default class StackSecundario extends Component {


    render( ) {
        return(
            <Stack.Navigator>
                <Stack.Screen name='feed' component={Feed} options = {{ headerShown: false}}/>
                <Stack.Screen name='profileuser' component={PerfilUsuario} options = {{ headerShown: false}}/>
                <Stack.Screen name = 'detalleposteo' component = {DetallePosteo} options={{headerShown : false}} />
            </Stack.Navigator>
        )
    }
}