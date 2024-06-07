import {Text, View, TouchableOpacity, Image, FlatList, TextInput} from 'react-native'
import {Component} from 'react'
import { StyleSheet } from 'react-native'
import { db, auth } from '../firebase/config'
import * as ImagePicker from 'expo-image-picker'
import { storage } from "../firebase/config";

class Register extends Component {
    constructor(props){
        super(props)
        this.state ={
            conteo: 0,
            email : "",
            pass: '',
            user: '',
            error : '',
            minibio: '',
            fotoPerfil:''
        }
    }
   componentDidMount() {
    console.log("Mounteo")
    console.log(this.props)
    auth.onAuthStateChanged((user) => {
        if (user !== null) {
            console.log("Este es el email logueado ", auth.currentUser.email)
            this.props.navigation.navigate('tabnav')

        }

        })
    
   }
   elegirIMG(){
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
              this.setState({fotoPerfil: url},()=>console.log(this.state))
            })
          })
        }))  
    }
   
    OnSubmit (name,email,password,text,fotoPerfil) {
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
            db.collection('users').add({
                mail: email,
                pass: password,
                nombre: name,
                minibio: text,
                createdAt:Date.now(),
                fotoPerfil:fotoPerfil
            })
            .then( this.props.navigation.navigate('login'))
            .catch((e) => console.log(e))
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
                    />
                    <TextInput
                    style = {styles.input}
                    keyboardType='email-adress'
                    placeholder='minibio'
                    onChangeText = {(text)=> this.setState({
                        minibio:text
                    })}
                    value = {this.state.minibio}
                    />
                    <TouchableOpacity
                    style={styles.img}
                    onPress={()=> this.elegirIMG()}>
                        {this.state.fotoPerfil == ``? <Image source={require(`../../assets/fotoDeafult.jpeg`)} style={styles.img} resizeMode='contains' />
                        : <Image source={{uri:this.state.fotoPerfil}} style={styles.img} resizeMode='contains'/>}
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.boton} onPress={() => this.OnSubmit(this.state.user,this.state.email,this.state.pass,this.state.minibio,this.state.fotoPerfil)}>
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

export default Register