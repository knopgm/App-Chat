import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  TextInput,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Background_Image from "../assets/Background_Image.png";
// import icon from "../assets/icon.svg";

const colors = ["#090C08", "#474056", "#8A95A5", "#B9C6AE"];

export default class Screen1 extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      //save user's name
      name: "",
      //save user's choosed color
      currentColor: colors[3],
    };
  }

  render() {
    const { currentColor } = this.state;

    return (
      <View style={[styles.container]}>
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
              <Text style={styles.textDisplayColors}>
                Choose Background Color:
              </Text>
              <View style={styles.colorcontainer}>
                <FlatList
                  data={colors}
                  horizontal={true}
                  renderItem={({ item: color }) => (
                    <TouchableOpacity
                      accessible={true}
                      accessibilityLabel="Color options"
                      accessibilityHint="Choose a background color."
                      accessibilityRole="menu"
                      onPress={() => this.setState({ currentColor: color })}
                    >
                      <View
                        style={[
                          styles.colorsdisplay,
                          { backgroundColor: color },
                        ]}
                      ></View>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
            <Button
              //A button cannot use a outside style in react Native
              minHeight="50"
              color="#757083"
              title="Start Chatting"
              // go to the chat page with the states that the user saved
              onPress={() =>
                this.props.navigation.navigate("Chat", {
                  name: this.state.name,
                  backgroundColor: this.state.currentColor,
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
    height: "40%",
    width: "88%",
    padding: "4%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  //to style the input for name
  name: {
    minHeight: 50,
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
  //text asking for a color
  textDisplayColors: {
    color: "#757083",
  },
  // draw's the circles for the colors
  // colors will be choose dynamically
  colorsdisplay: {
    height: 40,
    width: 40,
    borderRadius: 20,
    margin: 10,
    padding: 6,
    borderWidth: 1,
    borderColor: "gray",
  },
});
