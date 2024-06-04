import {Text, View, TouchableOpacity, Image, FlatList, TextInput} from 'react-native'
import {Component} from 'react'
import { StyleSheet } from 'react-native'
import { auth } from '../firebase/config'



class Register extends Component {
    constructor(props){
        super(props)
        this.state ={
            conteo: 0,
            email : "",
            pass: '',
            user: '',
            error : ''
        }
    }
   componentDidMount() {
    console.log("Mounteo")
    console.log(this.props)
   }
    clickeame () {
        console.log("me clickearon")
    }
    OnSubmit (name,email,password) {
        console.log(this.state.user)
        console.log(this.state.pass)
        console.log(this.state.email)
        if((name===null)||name===''||name.length < 5) {
            this.setState({error:'El name no puede ser menos de 5 caracteres'})
            return false
        }
        if(email===null||email===''|| !email.includes('@')) {
            this.setState({error:'el email tiene un formato invalido'})
            return false
        }
        if(password===null|| password ===''|| password.length < 6) {
            this.setState({error:'La password dno puede tener menos de 6 caracteres'})
            return false
        }

        auth.createUserWithEmailAndPassword(email,password)
        .then((user) => 
        {if(user) {
            console.log('usuario registrado')
            // aca tengo que crear la coleccion de usuarios
        }}
    
    )
        .catch((e) => {
            if ( e.code=== "auth/email-already-in-use") {
            this.setState({error: 'El email ya existe'})
        }
    })
        
    }
    redirect() {
        this.props.navigation.navigate('login')
    }
    render( ){
        return(
            <View style={styles.containerPrincipal}>
                <View style={styles.container1}>
                    <Text>Form Register </Text>
                    <TextInput 
                    style={styles.input}
                    placeholder='Ingresa tu user'
                    onChangeText={(text) => this.setState({user : text, error :''})}
                    value= {this.state.user}
                    >
                    </TextInput>
                    <TextInput 
                    style={styles.input}
                    placeholder='Ingresa tu mail'
                    onChangeText={(text) => this.setState({email : text,error : ''})}
                    value= {this.state.email}
                    >
                    </TextInput>
                    <TextInput 
                    style={styles.input}
                    placeholder='Ingresa tu contrasena'
                    onChangeText={(text) => this.setState({pass : text, error : ''})}
                    value= {this.state.pass}
                    secureTextEntry= {true}
                    >
                    </TextInput>
                    <TouchableOpacity style={styles.boton} onPress={() => this.OnSubmit(this.state.user,this.state.email,this.state.pass)}>
                        <Text>Registrarse</Text>
                    </TouchableOpacity>
                    {this.state.error !== '' ?
                    <Text>{this.state.error}</Text> :
                    console.log('usuarioregistrado')
                
                }
                    <View>
                        <Text>
                            Ya tienes una cuenta?
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

export default Register