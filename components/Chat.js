import React from "react";
import { View, Platform, KeyboardAvoidingView, StyleSheet } from "react-native";
import { Bubble, GiftedChat } from "react-native-gifted-chat";

export default class Screen2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });

    this.setState({
      messages: [
        //messages from others to the user
        {
          _id: 1,
          text: "Hello developer",
          createdAt: new Date(),
          user: {
            _id: 2,
            name: "React Native",
            avatar: "https://placeimg.com/140/140/any",
          },
        },
        //messages from the system (who enters the room, etc.)
        {
          _id: 2,
          text: "You entered the chat",
          createdAt: new Date(),
          system: true,
        },
      ],
    });
  }

  //function to append new messages to the messages states array.
  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  //function to style the bubble messages
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          //bubbles at the right side of the screen (use left for left side)
          right: {
            backgroundColor: "#000",
          },
        }}
      />
    );
  }

  render() {
    return (
      <View
        style={{
          backgroundColor: this.props.route.params.color,
          flex: 1,
        }}
      >
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  chatContainer: {
    flex: 1,
  },
  chatText: {
    color: "white",
  },
});
