import {Text, View, TouchableOpacity, Image, FlatList, TextInput} from 'react-native'
import {Component} from 'react'

import { StyleSheet } from 'react-native'
import { auth } from '../firebase/config'
class Login extends Component {
    constructor(props){
        super(props)
        this.state ={
            conteo: 0,
            email : "",
            pass: '',
            user: ''
        }
    }
    componentDidMount() {
        auth.onAuthStateChanged((user) => {
        if (user !== null) {
            console.log("Este es el email logueado ", auth.currentUser.email)
            this.props.navigation.navigate('tabnav')

        }

        })
    }
    redirect() {
        this.props.navigation.navigate('register')
    }
    clickeame () {
        console.log("me clickearon")
    }
    
OnSubmit (email,password) { 
            console.log(this.state.user)
            console.log(this.state.pass)
            console.log(this.state.email)

            if(email===null||email===''|| !email.includes('@')) {
                this.setState({error:'el email tiene un formato invalido'})
                return false
            }
            if(password===null|| password ===''|| password.length < 6) {
                this.setState({error:'La password no puede tener menos de 6 caracteres'})
                return false
            }
    
            auth.signInWithEmailAndPassword(email,password)
            .then((user) => 
            {if(user) {
                this.props.navigation.navigate('tabnav')
            }}
        
        )
        .catch((e) => {
            console.log(e)
            if (e.code === "auth/internal-error") {
                this.setState({error: 'el usuario o pass no son correctos'})
                console.log(this.state.error)
                alert(`ekl usuario o pass no son correctos`)
            }  else {
                this.setState({error: e.message})
                console.log(this.state.error)
                
            }
        })
            
        }
        
    
    render( ){
        return(
            <View style={styles.containerPrincipal}>
                <View style={styles.container1}>
                    
                    <TextInput 
                    style={styles.input}
                    placeholder='Ingresa tu mail'
                    onChangeText={(text) => this.setState({email : text})}
                    value= {this.state.email}
                    >
                    </TextInput>
                    <TextInput 
                    style={styles.input}
                    placeholder='Ingresa tu contrasena'
                    onChangeText={(text) => this.setState({pass : text})}
                    value= {this.state.pass}
                    secureTextEntry= {true}
                    >
                    </TextInput>
                    <TouchableOpacity style={styles.boton} onPress={() => this.OnSubmit(this.state.email,this.state.pass)}>
                        <Text>Login</Text>
                    </TouchableOpacity>
                    <View>
                        <Text>
                            No tienes una cuenta?
                            <TouchableOpacity onPress={() => this.redirect()}>
                                <Text>Ingresa aqui</Text>
                            </TouchableOpacity>
                        </Text>
                    </View>
                </View>
                
                
                
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
    imgPerrito: {
        height : 150,
        width:'100%'
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

export default Login