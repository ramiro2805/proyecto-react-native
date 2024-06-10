import React, { Component } from "react";
import { TextInput, View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from "react-native";

import { auth, db } from "../firebase/config";

class Buscador extends Component {
  constructor(props) {
    super(props);

    this.state = {
      busqueda: "",
      resultados: [],
      IdUserSeleccionado: "",
    };
  }


  componentDidMount() {
    db.collection("users").onSnapshot((snapshot) => {
      let info = [];
      snapshot.forEach((doc) => {
        info.push({
          id: doc.id,
          datos: doc.data(),
        });
      });

      this.setState({
        resultados: info,
      });
    });
  }


  seleccionarUsuario(IdUserSeleccionado) {
    {
        IdUserSeleccionado != auth.currentUser.email ?
      this.props.navigation.navigate('profileuser', IdUserSeleccionado)
      :
      this.props.navigation.navigate('profile')
    }
    console.log(IdUserSeleccionado);
  }

  render() {
    const resultadosFiltrados = this.state.resultados.filter((usuario) =>
      usuario.datos.mail.toLowerCase().includes(this.state.busqueda.toLowerCase())
    );


    return (
      <View >
        <TextInput
          placeholder="Search by mail ..."
          keyboardType="default"
          value={this.state.busqueda}
          style={styles.input}
          onChangeText={(text) => this.setState({ busqueda: text })}
        />

        <FlatList
          data={resultadosFiltrados}
          keyExtractor={(user) => user.id}
          style={styles.container}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => this.seleccionarUsuario(item.datos.mail)}
              style={styles.containerProfile}>
              {item.datos.fotoPerfil != '' ?
                <Image
                  style={styles.profilePic}
                  source={{ uri: item.datos.fotoPerfil }}
                  resizeMode='contain' /> :
                <Image
                  style={styles.profilePic}
                  source={require('../../assets/fotoDeafult.jpeg')}
                  resizeMode='contain' />}
              <View>
                <Text >{item.datos.nombre}</Text>
                <Text style={styles.email}>{item.datos.mail}</Text>

              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { marginLeft: 10, },
  email: { color: 'grey' },
  containerProfile: {
    flexDirection: 'row',
    height: 50
  },
  input: {
    height: 40,
    backgroundColor: '#eae0ed',
    paddingLeft: 10,
    margin: 10,
    borderRadius: 15,
  },
  profilePic: {
    height: 40,
    width: 40,
    borderWidth: 2,
    borderRadius: 25,
    borderColor: 'white',
    marginRight: 10
  },
});

export default Buscador;