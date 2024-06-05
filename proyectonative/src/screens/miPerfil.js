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
            posteos: [],
            datosUsuario:{}
        }
    }
    componentDidMount(){
        db.collection('posteos').where('owner','==',auth.currentUser.email).onSnapshot (
            docs => {
                let posts=[]
                docs.forEach( doc => {
                    posts.push({
                        id: doc.id,
                        data : doc.data()
                    })
                    
                })
                this.setState({posteos:posts})
            }
        )
        db.collection('users').where('owner', '==', auth.currentUser.email)
        .onSnapshot(data => {
            data.forEach(doc => {
                const userData = doc.data();
                console.log(userData);
            });
     })
    }
    render( ) {
        return(
            <View style={styles.containerPrincipal}>
                <Text>Mi perfil</Text>
                <View style={styles.perfil}>
                        <Text>{auth.currentUser.email}</Text>
                        <Text>{auth.currentUser.nombre}</Text>
                        <Text>{auth.currentUser.minibio}</Text>
                    </View>
                <FlatList
                data={this.state.posteos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) => <View><Post posteo={item}/></View>}
                />

                
                
                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    containerPrincipal: {
        flex: 1
    },
    container1 : {
        flex: 1,
        backgroundColor: 'white'
    },
    container2 : {
        flex : 4,
        backgroundColor : 'white'
    }, 
    container3 : {
        flex : 1,
        backgroundColor : 'grey'
    },
    input : {
        borderColor: 'green',
        borderWidth: 1,
        height: 20,
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'red',
        border: 'solid',
        marginVertical: 10

    },
    boton : {
        backgroundColor: '#28a745',
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#28a745',
    borderStyle: 'solid',
    }
})