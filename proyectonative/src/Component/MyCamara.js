import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { storage } from "../firebase/config";
import { auth } from "../firebase/config";


class MyCamera extends Component {
    constructor(props) {
        super(props);
        this.state = {
            permission: false,
            photo: '',
            showCamera: true,
        }
    }

    componentDidMount() {
        Camera.requestCameraPermissionsAsync()
            .then((res) => {
                if (res.granted === true)
                    this.setState({
                        permission: true,
                    })
            })
            .catch(e => console.log(e))
    }

    takePicture() {
        this.metodosCamara.takePictureAsync()

            .then(photo => {
                this.setState({
                    photo: photo.uri,
                    showCamera: false
                })
            })
            .catch(e => console.log(e))
    }

    cancelPicture() {
        this.setState({
            showCamera: true,
        })
    }

    acceptPicture() {
        fetch(this.state.photo)
            .then(res => res.blob())
            .then(image => {
                const ref = storage.ref(`${auth.currentUser?.email}_${Date.now()}.jpg`)
                ref.put(image)
                    .then(() => {
                        ref.getDownloadURL()
                            .then(url => {
                                this.props.actualizar(url)
                            }
                            )
                    })
            })
            .catch(e => console.log(e))
    }

    render() {
        console.log(Camera.Constants);
        return (
            <>
                {this.state.permission ?
                    this.state.showCamera ?
                        <View style={styles.container} >
                            <Camera style={styles.camera} type={Camera.Constants.Type.back} ref={metodosCamara => this.metodosCamara = metodosCamara} />
                            <View style={styles.containerButton}>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => this.takePicture()}
                                >
                                    <Text style={styles.textButton}>Take Picture</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                        :
                        <>
                            <Image style={styles.camera} source={{ uri: this.state.photo }} />

                            <View style={styles.containerAcceptyCancel}>

                                <TouchableOpacity
                                    style={styles.accept}
                                    onPress={() => this.acceptPicture()}
                                >
                                    <Text style={styles.textButton}>Accept</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.cancel}
                                    onPress={() => this.cancelPicture()}
                                >
                                    <Text style={styles.textButton}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    :
                    <Text style={styles.textCamera}>You did not give us permission to use your camera</Text>
                }
            </>
        )
    }
}

const styles = StyleSheet.create({
    containerAcceptyCancel: {

        flexDirection: 'row',
        justifyContent: 'center',
    },
    accept: {
        height: 35,
        width: 100,
        alignItems: 'center',
        backgroundColor: "#5ac15d",
        padding: 10,
        borderRadius: 10,
        margin: 15,
    },
    cancel: {
        height: 35,
        width: 100,
        alignItems: 'center',
        backgroundColor: "#ec5853",
        padding: 10,
        borderRadius: 10,
        margin: 15,
    },
    containerButton: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    textCamera: {
        margin: 50,
    },
    title: {
        fontWeight: 'bold'
    },
    container: {
        flex: 1,
    },
    camera: {
        height: 400
    },
    button: {
        flex: 1,
        width: '100%',
        height: 10,
        alignItems: 'center',
        backgroundColor: "#896a92",
        padding: 10,
    },

    textButton: {
        color: "#fff",
    }
});

export default MyCamera;
Contraer












