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
      filtro: "email", // Estado para almacenar el filtro seleccionado
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

  seleccionarUsuario(MailUserSeleccionado) {
    if (MailUserSeleccionado != auth.currentUser.email) {
      this.props.navigation.navigate('profileuser', { mail: MailUserSeleccionado });
    } else {
      this.props.navigation.navigate('profile');
    }
  }

  filtrarUsuarios() {
    const { busqueda, resultados, filtro } = this.state;
    return resultados.filter((usuario) => {
      if (filtro === "email") {
        return usuario.datos.mail.toLowerCase().includes(busqueda.toLowerCase());
      } else if (filtro === "username") {
        return usuario.datos.nombre.toLowerCase().includes(busqueda.toLowerCase());
      } else {
        return usuario.datos.mail.toLowerCase().includes(busqueda.toLowerCase()) ||
               usuario.datos.nombre.toLowerCase().includes(busqueda.toLowerCase());
      }
    });
  }

  render() {
    const resultadosFiltrados = this.filtrarUsuarios();

    return (
      <View>
        <View style={styles.filterContainer}>
          <TouchableOpacity onPress={() => this.setState({ filtro: "email" })}>
            <Text style={{ color: this.state.filtro === "email" ? "blue" : "grey" }}>Filtrar por Email</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.setState({ filtro: "username" })}>
            <Text style={{ color: this.state.filtro === "username" ? "blue" : "grey" }}>Filtrar por Nombre</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.setState({ filtro: "both" })}>
            <Text style={{ color: this.state.filtro === "both" ? "blue" : "grey" }}>Filtrar por Ambos</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          placeholder="Search..."
          keyboardType="default"
          value={this.state.busqueda}
          style={styles.input}
          onChangeText={(text) => this.setState({ busqueda: text })}
        />
        {resultadosFiltrados.length === 0 ? (
          <Text>No hay resultados para su búsqueda</Text>
        ) : (
          <FlatList
            data={resultadosFiltrados}
            keyExtractor={(user) => user.id}
            style={styles.container}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => this.seleccionarUsuario(item.datos.mail)}
                style={styles.containerProfile}
              >
                {item.datos.fotoPerfil !== '' ? (
                  <Image
                    style={styles.profilePic}
                    source={{ uri: item.datos.fotoPerfil }}
                    resizeMode="contain"
                  />
                ) : (
                  <Image
                    style={styles.profilePic}
                    source={require('../../assets/fotoDeafult.jpeg')}
                    resizeMode="contain"
                  />
                )}
                <View>
                  <Text>{item.datos.nombre}</Text>
                  <Text style={styles.email}>{item.datos.mail}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { marginLeft: 10 },
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
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 10,
  },
});

export default Buscador;
