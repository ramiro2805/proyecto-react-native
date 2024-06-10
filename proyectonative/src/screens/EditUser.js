import React, { Component } from 'react';
import { getAuth, updatePassword } from 'firebase/auth';
import { Text, View, TouchableOpacity, TextInput } from 'react-native';
import { db, auth } from '../firebase/config'




class EditUser extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            user: "",
            pass: "",
            minibio: "",
            datosUsuario: {},
            idUsuario: null
        };
    }

    componentDidMount(){
        db.collection('users').where('mail', '==', auth.currentUser.email)
        .onSnapshot(data => {
            data.forEach(doc => {    
                console.log(doc.data());
                this.setState({ datosUsuario: doc.data(), idUsuario: doc.id })
            });
        });
    }

    Editar = (user,minibio,pass) => {
        if (user !== "") {
            db.collection("users").doc(this.state.idUsuario).update({nombre: user}).then();
        }
        if (minibio !== "") {
            db.collection("users").doc(this.state.idUsuario).update({minibio: minibio}).then();
        }
        if (pass.length > 5) {
            auth.currentUser.updatePassword(pass)
            .then(() => {
                console.log('Se actualizó la contraseña');
            }).catch((error) => {
                console.log(error);
            });
        }
        this.props.navigation.navigate('profile')
        
    }

    render() {
        return ( 
            <View>
                <TextInput 
                    style={styles.input}
                    placeholder={this.state.datosUsuario.nombre || 'Nombre'}
                    onChangeText={(text) => this.setState({ user: text, error: '' })}
                    value={this.state.user}
                />
                <TextInput 
                    style={styles.input}
                    placeholder='Ingresa tu nueva contraseña'
                    onChangeText={(text) => this.setState({ pass: text, error: '' })}
                    value={this.state.pass}
                    secureTextEntry={true}
                />
                <TextInput
                    style={styles.input}
                    placeholder={this.state.datosUsuario.minibio || 'Minibio'}
                    onChangeText={(text) => this.setState({ minibio: text })}
                    value={this.state.minibio}
                />
                <TouchableOpacity onPress={() => this.Editar(this.state.user,this.state.minibio,this.state.pass)}>
                    <Text>Confirmar cambios</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = {
    input: {
        borderColor: 'green',
        borderWidth: 1,
        height: 20,
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderRadius: 5,
        marginVertical: 10
    },
    boton: {
        backgroundColor: '#28a745',
        paddingHorizontal: 10,
        paddingVertical: 6,
        alignItems: 'center',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#28a745'
    }
};

export default EditUser;
