import {Text, View, TouchableOpacity, Image, FlatList , TextInput} from 'react-native'
import React, {Component} from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {NavigationContainer} from '@react-navigation/native'
import Register from '../screens/Register'
import {db, auth} from '../firebase/config'
import Login from '../screens/Login'
import { StyleSheet } from 'react-native'
import MyCamara from '../Component/MyCamara'
import * as ImagePicker from 'expo-image-picker'
import { storage } from "../firebase/config";

export default class NewPost extends Component {
    constructor(props) {
        super(props)
        this.state = {
            descripcion : '',
            imgPostUrl: '',
            imgGaleria:'',
            usandoCamara: false,
            useGaleria: false
        }
    }
    actualizarImgUrl (url) {
        this.setState({imgPostUrl : url})
    }
    OnSubmit(descripcion) {
        if(descripcion != '' && this.state.imgPostUrl != ''){
            db.collection('posteos').add({
                descripcion : descripcion,
                owner: auth.currentUser.email,
                createdAt : Date.now(),
                imageUrl:this.state.imgPostUrl ,
                likes: [],
                comments : []
            })
            .then((resp) => this.setState({descripcion : '',usandoCamara:false}, () => this.props.navigation.navigate('feed')))
            .catch((e) => console.log(e))
        }
        else if(descripcion != '' && this.state.imgGaleria != '') {
            db.collection('posteos').add({
                descripcion : descripcion,
                owner: auth.currentUser.email,
                createdAt : Date.now(),
                imageUrl:this.state.imgGaleria ,
                likes: [],
                comments : []
            })
            .then((resp) => this.setState({descripcion : '',usandoCamara:false}, () => this.props.navigation.navigate('feed')))
            .catch((e) => console.log(e))
        }
    }
    useGaleria(){
        this.setState({useGaleria: true})
    }
    elegirCamara() {
        this.setState({ usandoCamara: true });
      }
    elegirIMG(){
        this.setState({usandoCamara:false, useGaleria:true})
        ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing:true,
            aspect:[4,3],
            quality:1
          })
          .then(img => 
            fetch(img.assets[0].uri)
            .then(res => res.blob())
            .then(img =>{
              const ref = storage.ref(`ProfileImg/${Date.now()}.jpg`)
              ref.put(img)
              .then(()=>{
                ref.getDownloadURL()
                .then(url =>{
                  this.setState({imgGaleria: url},()=>console.log(this.state))
                })
              })
            }))  
        }
    render( ) {
        return (
            <View style={styles.container}>
                {this.state.usandoCamara ? (
                    this.state.imgPostUrl=='' ?
                    <MyCamara
                        actualizar={(url) => this.actualizarImgUrl(url)}
                        onCapture={() => this.setState({ usandoCamara: false })}
                    />
                    :
                    <View>
                        <TextInput
                            value={this.state.descripcion}
                            onChangeText={(text) => this.setState({ descripcion: text })}
                            placeholder="Descripción"
                            style={styles.input}
                        />
                        <TouchableOpacity onPress={() => this.OnSubmit(this.state.descripcion)}>
                            <Text>Crear Post</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    this.state.useGaleria==false ? 
                    <View>
                    <TouchableOpacity
                            style={styles.imagePickerButton}
                            onPress={() => this.elegirCamara()}
                        >
                            <Text style={styles.imagePickerText}>Usar cámara</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.imagePickerButton}
                            onPress={() => this.elegirIMG()}
                        >
                            <Text style={styles.imagePickerText}>Elegir desde galería</Text>
                        </TouchableOpacity>
                        </View>
                    :
                    <View>
                            <TextInput
                            value={this.state.descripcion}
                            onChangeText={(text) => this.setState({ descripcion: text })}
                            placeholder="Descripción"
                            style={styles.input}
                        />
                        <TouchableOpacity onPress={() => this.OnSubmit(this.state.descripcion)}>
                            <Text>Crear Post</Text>
                        </TouchableOpacity>
                        </View>
                        
                        
                        
                    
                )}
            </View>
        );
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
    img: {
        height: 200,
        width: 20
    }
})