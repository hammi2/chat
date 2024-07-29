import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import {Ionicons} from '@expo/vector-icons';
export default class LoginScreen extends Component {
  state = {
    name: "",
  };

  continue = () => {
    this.props.navigation.navigate("Chat", { name: this.state.name });
  };
  render() {
    return (
      <ImageBackground
        source={{
          uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkdzDsF9n7EwWS8cL6MGJM0wvkdOWA8vEXzW2WPwahUn6aNm18t6rhlugFJlJ4Nk3aWYA&usqp=CAU",
        }}
        style={styles.backgroundImage}
      >
        <View style={styles.circle}></View>
        <View style={{ marginHorizontal: 32 }}>
          <Text style={styles.header}>User Name</Text>
          <TextInput
            placeholder="Enter your name"
            style={styles.input}
            onChangeText={(text) => this.setState({ name: text })}
            value={this.state.name}
          />
        </View>
        <View style={{alignItems:'flex-end', marginTop:60}}>
            <TouchableOpacity style={styles.continue} onPress={this.continue}>
                <Ionicons name="arrow-forward-circle" size={50} color="white" />
            </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#F4F5F7',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    //alignItems: 'center',
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },
  circle: {
    width: 500,
    height: 500,
    borderRadius: 500 / 2,
    backgroundColor: "rgba(255, 255, 255, 0.5)", // شفاف
    position: "absolute",
    top: -120,
    top: -20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.5)", // شفاف
    borderRadius: 20, // دائري
  },
  header: {
    color: "#514ESA",
    fontWeight: "800",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 30,
  },
  continue: {
    backgroundColor: '#514ESA',
    //padding: 15,
    borderRadius: 70/2,
    width:80,
    height:80,
    alignItems:'center',
    justifyContent:'center'
  },
});