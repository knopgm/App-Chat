import React from "react";
import {
  View,
  Platform,
  KeyboardAvoidingView,
  FlatList,
  StyleSheet,
} from "react-native";
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebase = require("firebase");
require("firebase/firestore");

export default class Screen2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      uid: 0,
    };

    //set up Firebase
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

    this.referenceChatMessages = null;
  }

  // Retrieve collection data & store in messages
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document

    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text || "",
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar || "",
        },
      });
    });

    this.setState({
      messages,
    });
  };

  //function to save messages in the asyncStorage of the cellphone
  async saveMessages() {
    try {
      await AsyncStorage.setItem(
        "messages",
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  }

  async getMessages() {
    let messages = "";
    try {
      messages = (await AsyncStorage.getItem("messages")) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  //function to delete test messages (dev tool)
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem("messages");
      this.setState({
        messages: [],
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  componentDidMount() {
    let { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });

    this.getMessages();

    // this.setState({
    //   messages: [
    //     //messages from others to the user
    //     {
    //       _id: 1,
    //       text: "Hello developer",
    //       createdAt: new Date(),
    //       user: {
    //         _id: 2,
    //         name: "React Native",
    //         avatar: "https://placeimg.com/140/140/any",
    //       },
    //     },
    //     //messages from the system (who enters the room, etc.)
    //     {
    //       _id: 2,
    //       text: "You entered the chat",
    //       createdAt: new Date(),
    //       system: true,
    //     },
    //   ],
    // });

    // create a reference to your “messages” collection
    this.referenceChatMessages = firebase.firestore().collection("messages");

    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      this.setState({
        uid: user.uid,
      });
      console.log(">>>>>>", { user });

      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });
  }

  componentWillUnmount() {
    // this function is not a function (as the Render error warns)
    this.unsubscribe();
    // stoplistening to authentication
    this.authUnsubscribe();
  }

  addMessage() {
    // add a new list to the collection
    // this.referenceChatMessages.add({
    //   text: "Testtext",
    //   createdAt: new Date(),
    //   uid: this.state.uid,
    // });
  }

  //function to append new messages to the messages states array.
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.saveMessages();
      }
    );

    messages.forEach((message) => {
      this.referenceChatMessages.add(message);
    });
  }

  //function to style the bubble messages
  renderBubble(props) {
    return <Bubble {...props} wrapperStyle={styles.bubble} />;
  }

  render() {
    const { backgroundColor, name } = this.props.route.params;
    console.log(this.state.messages);
    return (
      <View
        style={[
          {
            backgroundColor: backgroundColor,
          },
          styles.chatContainer,
        ]}
      >
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: this.state.uid,
            name: name,
          }}
        />
        {/*Prevent hidden input field on Android*/}
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
    color: "black",
  },
  bubble: {
    left: {
      backgroundColor: "gray",
    },
    right: {
      backgroundColor: "#3A85A9",
    },
  },
});
