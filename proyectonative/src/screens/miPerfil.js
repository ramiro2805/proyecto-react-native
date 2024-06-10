import {Text, View, FlatList, TouchableOpacity, Image} from 'react-native'
import React, {Component} from 'react'
import {StyleSheet} from 'react-native'
import {db, auth} from '../firebase/config'
import PostPerfil from '../Component/PostPerfil'

export default class miPerfil extends Component {
    constructor(props) {
        super(props)
        this.state = {
            posteos: [],
            datosUsuario: null
        }
    }

    componentDidMount() {
        db.collection('posteos').where('owner', '==', auth.currentUser.email).onSnapshot(
            docs => {
                let posts = []
                docs.forEach(doc => {
                    posts.push({
                        id: doc.id,
                        data: doc.data()
                    })
                })
                this.setState({posteos: posts})
            }
        )
        db.collection('users').where('mail', '==', auth.currentUser.email)
            .onSnapshot(data => {
                data.forEach(doc => {
                    this.setState({datosUsuario: doc.data()})
                });
            })
    }

    logout() {
        auth.signOut()
            .then(() => this.props.navigation.navigate('login'))
    }

    borrarPosteo(idPosteo) {
        db.collection('posteos').doc(idPosteo).delete()
            .then((res) => console.log(res))
            .catch(e => console.log(e))
    }

    render() {
        return (
            <View style={styles.containerPrincipal}>
                <Text style={styles.title}>Mi Perfil</Text>
                {this.state.datosUsuario ? 
                    <View style={styles.perfil}>
                        <Image style={styles.img} source={this.state.datosUsuario.fotoPerfil ? {uri: this.state.datosUsuario.fotoPerfil} : require('../../assets/fotoDeafult.jpeg')} resizeMode='contain' />
                        <Text style={styles.text}>{this.state.datosUsuario.nombre}</Text>
                        <Text style={styles.text}>{this.state.datosUsuario.mail}</Text>
                        <Text style={styles.text}>{this.state.datosUsuario.minibio}</Text>
                        <Text style={styles.text}>Cantidad de posteos: {this.state.posteos.length}</Text>
                        <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate("EditUser")}>
                            <Text style={styles.buttonText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.logoutButton} onPress={() => this.logout()}>
                            <Text style={styles.logoutButtonText}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                    : 
                    <Text>Cargando información del usuario...</Text>
                }
                <FlatList
                    data={this.state.posteos}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({item}) => <View><PostPerfil borrarPosteo={(idPosteo) => this.borrarPosteo(idPosteo)} posteo={item}/></View>}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    containerPrincipal: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
    },
    perfil: {
        alignItems: 'center',
        marginBottom: 20,
    },
    img: {
        height: 100,
        width: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        marginVertical: 2,
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#3498db',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginVertical: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    logoutButton: {
        backgroundColor: '#e74c3c',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginVertical: 10,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});
