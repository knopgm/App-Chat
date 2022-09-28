import React from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  ImageBackground,
} from "react-native";
import Background_Image from "../assets/Background_Image.png";
// import icon from "../assets/icon.svg";

export default class Screen1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: "", color: "", active: false };
  }

  render() {
    const colors = ["#090C08", "#474056", "#8A95A5", "#B9C6AE"];
    const currentColor = this.state.color;
    console.log(this.state.color);
    return (
      <View style={styles.container}>
        <ImageBackground
          source={Background_Image}
          resizeMode="cover"
          style={styles.image}
        >
          <Text style={styles.apptitle}>App Chat</Text>
          <View style={styles.interactive_container}>
            <TextInput
              style={styles.name}
              //onChangeText will listen the text changes and store it as strings
              onChangeText={(name) => this.setState({ name })}
              value={this.state.name}
              placeholder="Your Name"
              // inlineImageLeft="icon"
            />
            <View>
              <Text>Choose Background Color:</Text>
              <View style={styles.colorcontainer}>
                <View
                  style={styles.colorsdisplay1}
                  onPress={() => this.setState({ color: "#090C08" })}
                ></View>
                <View
                  style={[styles.colorsdisplay1, styles.colorsdisplay2]}
                  onPress={() => this.setState({ color: "#474056" })}
                ></View>
                <View
                  style={[styles.colorsdisplay1, styles.colorsdisplay3]}
                  onPress={() => this.setState({ color: "#8A95A5" })}
                ></View>
                <View
                  style={[styles.colorsdisplay1, styles.colorsdisplay4]}
                  onPress={() => this.setState({ color: "#B9C6AE" })}
                ></View>
              </View>
            </View>
            <Button
              color="#757083"
              title="Start Chatting"
              onPress={() =>
                this.props.navigation.navigate("Chat", {
                  name: this.state.name,
                })
              }
            />
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  //background image style
  image: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  //to style the app title
  apptitle: {
    fontSize: 45,
    fontWeight: "600",
    color: "#FFFFFF",
    height: "50%",
    paddingTop: 60,
  },
  //interactive container styles
  interactive_container: {
    backgroundColor: "#FFFFFF",
    height: "44%",
    width: "88%",
    padding: "3%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  //to style the input for name
  name: {
    height: 30,
    minWidth: 150,
    padding: 6,
    borderWidth: 1,
    borderColor: "gray",
    color: "#757083",
    fontSize: 16,
    fontWeight: "300",
    opacity: 0.5,
  },
  //text of color display box
  colorcontainer: {
    color: "#757083",
    fontSize: 16,
    fontWeight: "300",
    opacity: 100,
    flexDirection: "row",
  },
  colorsdisplay1: {
    height: 40,
    width: 40,
    borderRadius: 20,
    margin: 10,
    padding: 6,
    borderWidth: 1,
    borderColor: "gray",
    backgroundColor: "#090C08",
  },
  colorsdisplay2: {
    backgroundColor: "#474056",
  },
  colorsdisplay3: {
    backgroundColor: "#8A95A5",
  },
  colorsdisplay4: {
    backgroundColor: "#B9C6AE",
  },
});
