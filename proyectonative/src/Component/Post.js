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
            likes: this.props.posteo.data.likes.length,
            datosUsuario: {}
        }
    }
    componentDidMount() {
        
        db.collection('users').where('mail', '==', this.props.posteo.data.owner)
        .onSnapshot(data => {
            data.forEach(doc => {    
                console.log(doc.data());
                this.setState({datosUsuario:doc.data()})
            });
     })
    }
    Likear() {
        db.collection('posteos').doc(this.props.posteo.id).update({likes:firebase.firestore.FieldValue.arrayUnion(auth.currentUser.email)})
        .then(()=> {this.setState({likes:this.props.posteo.data.likes.length , miLike : true})})
    } 
    Deslikear() {
        db.collection('posteos').doc(this.props.posteo.id).update({likes:firebase.firestore.FieldValue.arrayRemove(auth.currentUser.email)})
        .then(()=> {this.setState({likes:this.props.posteo.data.likes.length , miLike: false})})
    }
    IrPerfil(MailUserSeleccionado){
        {
            MailUserSeleccionado != auth.currentUser.email ?
          this.props.navigation.navigate('profileuser', {mail: MailUserSeleccionado})
          :
          this.props.navigation.navigate('profile')
        }
    }
    render() {
        return(
            <View style={styles.container}>
                <View style={styles.userInfo}>
                    <TouchableOpacity onPress={() => this.IrPerfil(this.state.datosUsuario.mail)}>
                        <Text style={styles.userName}>{this.state.datosUsuario.nombre}</Text>
                    </TouchableOpacity>
                </View>
                <Image style={styles.img} source={{ uri: this.props.posteo.data.imageUrl }} />
                <Text style={styles.postDescription}>{this.props.posteo.data.descripcion}</Text>
                <View style={styles.likeButton}>
                    {this.state.miLike ? (
                        <TouchableOpacity onPress={() => this.Deslikear()}>
                            <AntDesign name="heart" size={24} color="red" style={styles.likeIcon} />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => this.Likear()}>
                            <AntDesign name="hearto" size={24} color="black" style={styles.likeIcon} />
                        </TouchableOpacity>
                    )}
                    <Text style={styles.likeCount}>{this.state.likes} likes</Text>
                </View>
                <Text style={styles.commentCount}>{this.props.posteo.data.comments ? this.props.posteo.data.comments.length : 0} comments</Text>
                {this.props.posteo.data.comments && this.props.posteo.data.comments.length > 0 ? (
                    <FlatList
                        data={this.props.posteo.data.comments.slice(0, 3)}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => <Text style={styles.comment}>{item.owner}: {item.descripcion}</Text>}
                        style={styles.commentList}
                    />
                ) : (
                    <Text style={styles.comment}>No comments yet</Text>
                )}
                {auth.currentUser.email != null &&
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => { this.props.navigation.navigate('detalleposteo', { id: this.props.posteo.id }) }}
                    >
                        <Text style={styles.buttonText}>View all comments</Text>
                    </TouchableOpacity>
                }
            </View>
        )
    }
    
    
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: 10,
        marginBottom: 10,
        borderColor: '#dcdcdc',
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#ffffff'
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    userName: {
        fontWeight: 'bold',
        marginLeft: 10,
        color: '#262626'
    },
    img: {
        height: 300,
        width: '100%',
        marginBottom: 10,
        borderRadius: 10
    },
    postDescription: {
        marginBottom: 10,
        color: '#262626'
    },
    likeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    likeIcon: {
        marginRight: 5
    },
    likeCount: {
        marginLeft: 10,
        color: '#262626'
    },
    commentCount: {
        marginBottom: 10,
        color: '#8e8e8e'
    },
    commentList: {
        marginBottom: 10
    },
    comment: {
        color: '#262626'
    },
    button: {
        backgroundColor: '#3897f0',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold'
    }
});

export default Post