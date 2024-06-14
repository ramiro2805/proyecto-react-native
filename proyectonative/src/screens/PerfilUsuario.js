import { Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import React, { Component } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Register from '../screens/Register';
import { db, auth } from '../firebase/config';

import { StyleSheet } from 'react-native';
import Post from '../Component/Post';
import Login from '../screens/Login';
import PostPerfil from '../Component/PostPerfil';

export default class PerfilUsuario extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posteos: [],
            datosUsuario: null,
            mail: this.props.route.params.mail,
        };
    }

    componentDidMount() {
        db.collection('posteos').where('owner', '==', this.state.mail).onSnapshot(
            docs => {
                let posts = [];
                docs.forEach(doc => {
                    posts.push({
                        id: doc.id,
                        data: doc.data()
                    });
                });
                this.setState({ posteos: posts }, () => { console.log('Posteos en el state extendido', this.state.posteos) });
            }
        );
        db.collection('users').where('mail', '==', this.state.mail)
            .onSnapshot(data => {
                data.forEach(doc => {
                    console.log(doc.data());
                    this.setState({ datosUsuario: doc.data() });
                });
            });
    }

    render() {
        return (
            <View style={styles.containerPrincipal}>
                {this.state.datosUsuario ?
                    <View style={styles.perfil}>
                        <Text style={styles.profileTitle}>Perfil de: {this.state.datosUsuario.nombre}</Text>
                        <Text style={styles.profileText}>{this.state.datosUsuario.mail}</Text>
                        {this.state.datosUsuario.fotoPerfil === '' ?
                            <Image style={styles.img} source={{ uri: `../../assets/fotoDeafult.jpeg` }} resizeMode='contain' /> :
                            <Image style={styles.img} source={{ uri: this.state.datosUsuario.fotoPerfil }} resizeMode='contain' />
                        }
                        <Text style={styles.profileText}>{this.state.datosUsuario.nombre}</Text>
                        <Text style={styles.profileText}>{this.state.datosUsuario.minibio}</Text>
                        <Text style={styles.profileText}>Cantidad de posteos: {this.state.posteos.length}</Text>
                    </View>
                    :
                    <Text style={styles.loadingText}>Cargando información del usuario...</Text>
                }
                {this.state.posteos.length == 0 ?
                <Text>Este usuario  no tiene ningun posteo</Text> :
                <FlatList
                    data={ this.state.posteos}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <View><Post navigation={this.props.navigation} posteo={item} /></View>}
                />
    }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerPrincipal: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 10,
    },
    perfil: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    profileText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
    },
    img: {
        height: 100,
        width: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    loadingText: {
        fontSize: 18,
        color: '#999',
        textAlign: 'center',
        marginTop: 20,
    },
    flatList: {
        flex: 1,
    },
});
