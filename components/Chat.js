import React from "react";
import {
  View,
  Platform,
  KeyboardAvoidingView,
  FlatList,
  StyleSheet,
} from "react-native";
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";

const firebase = require("firebase");
require("firebase/firestore");

export default class Screen2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
    };

    const firebaseConfig = {
      apiKey: "AIzaSyAVR56ZAQenGXN15aKEruNiSQ0nl-6FIlA",
      authDomain: "app-chat-a76de.firebaseapp.com",
      projectId: "app-chat-a76de",
      storageBucket: "app-chat-a76de.appspot.com",
      messagingSenderId: "154388903012",
      appId: "1:154388903012:web:82c1885e0fded1723c9b71",
      measurementId: "G-19N9H84QY9",
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
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

    // create a reference to your “messages” collection
    this.referenceChatMessages = firebase.firestore().collection("messages");

    // if (!this.referenceChatMessages) {
    //   send a message to the user
    // }

    // this step is cleaning up the messages from the system...
    // this.unsubscribe = this.referenceChatMessages.onSnapshot(
    //   this.onCollectionUpdate
    // );
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user,
      });
    });
    this.setState({
      messages,
    });
  };

  componentWillUnmount() {
    // this.unsubscribe();
  }

  addMessages() {
    // add a new list to the collection
    this.referenceChatMessages.add({
      text: "Testtext",
      createdAt: new Date(),

      // uid: this.state.uid,
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
          backgroundColor: this.props.route.params.backgroundColor,
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
