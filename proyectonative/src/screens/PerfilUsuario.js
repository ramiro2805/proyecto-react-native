import {Text, View , FlatList, TouchableOpacity, Image} from 'react-native'
import React, {Component} from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {NavigationContainer} from '@react-navigation/native'
import Register from '../screens/Register'
import {db, auth} from '../firebase/config'

import { StyleSheet } from 'react-native'
import Post from '../Component/Post'
import Login from '../screens/Login'
import PostPerfil from '../Component/PostPerfil'


export default class PerfilUsuario extends Component {
    constructor(props) {
        super(props)
        this.state = {
            posteos: [],
            datosUsuario:null,
            mail: this.props.route.params.mail,
        }
    }
    componentDidMount(){
        db.collection('posteos').where('owner','==',this.state.mail).onSnapshot (
            docs => {
                let posts=[]
                docs.forEach( doc => {
                    posts.push({
                        id: doc.id,
                        data : doc.data()
                    })
                    
                })
                this.setState({posteos:posts}, () => {console.log('Posteos en el state extendido',this.state.posteos)})

            }
        )
        db.collection('users').where('mail', '==', this.state.mail)
        .onSnapshot(data => {
            data.forEach(doc => {    
                console.log(doc.data());
                this.setState({datosUsuario:doc.data()})
            });
     })
    }
    
    
    render( ) {
        return(
            <View style={styles.containerPrincipal}>
                
                {this.state.datosUsuario ? 
                    <View style={styles.perfil}>
                        <Text>Perfil de: {this.state.datosUsuario.nombre}</Text>
                        <Text>{this.state.datosUsuario.mail}</Text>
                        {this.state.datosUsuario.fotoPerfil==''?<Image style={styles.img} source={{uri:`../../assets/fotoDeafult.jpeg`}} resizeMode='contains' /> :
                        <Image style={styles.img} source={{uri:this.state.datosUsuario.fotoPerfil}} resizeMode='contains' />
                        }
                        
                        <Text>{this.state.datosUsuario.nombre}</Text>
                        <Text>{this.state.datosUsuario.minibio}</Text>
                        <Text>Cantidad de posteos: {this.state.posteos.length}</Text>
                    </View>
                 : 
                    <Text>Cargando información del usuario...</Text>
                }
                <FlatList
                data={this.state.posteos}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) => <View><Post  navigation = {this.props.navigation} posteo={item}/></View>}
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
    },
    img:{
        height: 100,
        width: 100,
        borderRadius: `50%`
      }
})