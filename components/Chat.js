import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default class Screen2 extends React.Component {
  componentDidMount() {
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });
  }

  render() {
    return (
      <View
        style={[
          styles.chatContainer,
          { backgroundColor: this.props.route.params.backgroundColor },
        ]}
      >
        <Text style={styles.chatText}>Hello Chat Screen!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "color",
  },
  chatText: {
    color: "white",
  },
});
