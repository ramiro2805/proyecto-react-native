import {Text, View, TouchableOpacity, Image, FlatList} from 'react-native'
import React, {Component} from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {NavigationContainer} from '@react-navigation/native'
import Register from '../screens/Register'
import {db, auth} from '../firebase/config'
import Login from '../screens/Login'
import { StyleSheet } from 'react-native'
import Camara from '../components/Camara'


export default class NewPost extends Component {
    constructor(props) {
        super(props)
        this.state = {
            descripcion : '',
            imgPostUrl: '',
        }
    }
    actualizarImgUrl (url) {
        this.setState({imgPostUrl : url})
    }
    OnSubmit(descripcion) {
        if(descripcion.length != ''){
            db.collection('posteos').add({
                descripcion : descripcion,
                owner: auth.currentUser.email,
                createdAt : Date.now(),
                imageUrl:this.actualizarImgUrl() ,
                likes: [],
                comments : []
            })
            .then((resp) => this.setState({descripcion : ''}, () => this.props.navigation.navigate('feed')))
            .catch((e) => console.log(e))
        }
    }
    render( ) {
        return(
            <View style={styles.container}>
                
                {this.state.imgPostUrl === '' 
                
                ? 
                <Camara actualizar={() => this.actualizarImgUrl(url)}/> 
                
                :
                <View> 
                    <TextInput value={this.state.descripcion} onChangeText={(text) =>  this.setState({descripcion: text})} placeholder='Describe tu post'
                style={styles.input}
                />
                <TouchableOpacity onPress={() => this.OnSubmit(this.state.descripcion)}>
                    <Text>Crear Post</Text>
                </TouchableOpacity>
                 </View>
                 
                
                } 
                
            </View>
        )
    }

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center', 
        padding: 10,
        width: '100%'
    },
})