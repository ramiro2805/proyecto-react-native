import {Text, View , FlatList} from 'react-native'
import React, {Component} from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {NavigationContainer} from '@react-navigation/native'
import Register from '../screens/Register'
import {db, auth} from '../firebase/config'

import { StyleSheet } from 'react-native'

import Login from '../screens/Login'
import Post from '../Component/Post'


export default class miPerfil extends Component {
    constructor(props) {
        super(props)
        this.state = {
            posteos: []
        }
    }
    render( ) {
        return(
            <View>
                <Text>Mi perfil</Text>
                
                
            </View>
        )
    }
}