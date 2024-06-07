import {Text, View, TouchableOpacity, Image, FlatList, TextInput} from 'react-native'
import {Component} from 'react'
import { StyleSheet } from 'react-native'
import firebase from 'firebase'
import {db, auth} from '../firebase/config'
import { AntDesign } from '@expo/vector-icons';
class DetallePosteo extends Component {
    constructor(props){
        super(props)
        this.state ={
             conteo: 0,
            miLike: false,
            likes: 0,
            datosUsuario: {},
            id: this.props.route.params.id,
            post: null,
            comentario: ""
        }
    }
    componentDidMount() {
        
        db.collection('posteos').doc(this.state.id)
        .onSnapshot(data => {
            this.setState({post:data.data()})
     })
     
    }
    componentDidUpdate() {
        db.collection('users').where('mail', '==', this.state.post.owner)
     .onSnapshot(data => {
         data.forEach(doc => {    
             
             this.setState({datosUsuario:doc.data()})
         });
         this.setState({miLike: this.state.post.likes.includes(auth.currentUser.email),
            likes: this.state.post.likes.length,})
  })
    }

    Likear() {
        db.collection('posteos').doc(this.props.route.params.id).update({likes:firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email)})
        .then(()=> {this.setState({likes:this.state.post.likes.length , miLike : true})})
    } 
    Deslikear() {
        db.collection('posteos').doc(this.props.route.params.id).update({likes:firebase.firestore.FieldValue.arrayRemove(auth.currentUser.email)})
        .then(()=> {this.setState({likes:this.state.post.likes.length, miLike: false})})
    }
    onSubmit(comentario){
        db.collection('posteos').doc(this.state.id).update({
            comments: firebase.firestore.FieldValue.arrayUnion({
                    owner: auth.currentUser.email,
                    descripcion : comentario,
                    createdAt : Date.now()
            })
        }).then(res => console.log(res))
        .catch((e)=>console.log(e))
    }
    render( ){
        return(
            this.state.post == null ? <Text> Cargando </Text> :
            <View style={styles.container}>
                 <Text>{this.state.datosUsuario.nombre}</Text> 
                <Image style={styles.img} source={ {uri: this.state.post.imageUrl}}/>
                <Text>{this.state.post.descripcion}</Text>
                
                {this.state.miLike ? <TouchableOpacity onPress={() => this.Deslikear()}>
                <AntDesign name="heart" size={24} color="black" />
                </TouchableOpacity>:
                <TouchableOpacity onPress={() => this.Likear()}>
                <AntDesign name="hearto" size={24} color="black" />
            </TouchableOpacity>
                }
                <Text>Cantidad de likes: {this.state.likes}</Text>
                <TextInput 
                placeholder = 'Comentario'
                onChangeText = {(text)=>this.setState({
                    comentario:text
                })}
                value = {this.state.comentario}
                style = {styles.input}
                >
                </TextInput>

                <TouchableOpacity
                    style = {styles.button}
                    onPress = {(comentario)=> this.state.comentario ==  null ? alert('No puedes comentar un texto vacio') : this.onSubmit(this.state.comentario)}
                    >
                <Text
                style = {styles.buttonText}
                >Enviar!
                </Text>
            </TouchableOpacity>
            { this.state.post !== null && this.state.post.comments.length !== 0? 
            <FlatList 
            style={styles.flatlist}
            data={this.state.post.comments}
            keyExtractor={item => item.createdAt.toString()}
            renderItem={({item}) => <Text>{item.descripcion}</Text>}
            />
        
            
            :<Text>Todavia no hay comentarios</Text>     
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
        padding: 10 ,
        marginBottom: 5,
        marginTop: 5,
        borderColor: 'black',
        borderBlockColor : 'black',
        backgroundColor: 'gold',
        border: 100,
        borderRadius : 10,
        borderStyle : 'solid'
        
    },
    img: {
        height: 500,
        width:'100%'
    }
  });
export default DetallePosteo