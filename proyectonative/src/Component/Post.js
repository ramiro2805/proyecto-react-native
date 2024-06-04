import {Text, View, TouchableOpacity, Image, FlatList} from 'react-native'
import {Component} from 'react'
import { StyleSheet } from 'react-native'
import firebase from 'firebase'
import {db, auth} from '../firebase/config'
import { AntDesign } from '@expo/vector-icons';
class Post extends Component {
    constructor(props){
        super(props)
        this.state ={
            conteo: 0,
            miLike: this.props.posteo.data.likes.includes(auth.currentUser.email),
            likes: this.props.posteo.data.likes.length
        }
    }
   
    Likear() {
        db.collection('posteos').doc(this.props.posteo.id).update({likes:firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email)})
        .then(()=> {this.setState({likes:this.props.posteo.data.likes.length , miLike : true})})
    } 
    Deslikear() {
        db.collection('posteos').doc(this.props.posteo.id).update({likes:firebase.firestore.FieldValue.arrayRemove(auth.currentUser.email)})
        .then(()=> {this.setState({likes:this.props.posteo.data.likes.length , miLike: false})})
    }
    render( ){
        return(
            <View style={styles.container}>
                <Image style={styles.img} source={ {uri: this.props.posteo.data.imageUrl}}/>
                <Text>{this.props.posteo.data.descripcion}</Text>
                
                <Text>{this.props.posteo.data.comments}</Text>
                {this.state.miLike ? <TouchableOpacity onPress={() => this.Deslikear()}>
                <AntDesign name="heart" size={24} color="black" />
                </TouchableOpacity>:
                <TouchableOpacity onPress={() => this.Likear()}>
                <AntDesign name="hearto" size={24} color="black" />
            </TouchableOpacity>
                }
                <Text>Cantidad de likes: {this.state.likes}</Text>
                
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
        height: 100,
        width:'100%'
    }
  });
export default Post