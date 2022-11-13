import React, { Component } from "react";
import { View, Platform, KeyboardAvoidingView, StyleSheet } from "react-native";
import { Bubble, GiftedChat, InputToolbar } from "react-native-gifted-chat";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
// import action button
import CustomActions from "./CustomActions";

import MapView from "react-native-maps";

const firebase = require("firebase");
require("firebase/firestore");

export default class Screen2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      uid: 0,
      isConnected: false,
      loggedInText: "Please wait, you are getting logged in",
      image: null,
      location: null,
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
        image: data.image || "",
        location: data.location || "",
      });
    });

    this.setState(
      {
        messages,
      },
      () => {
        this.saveMessages();
      }
    );
  };

  //Save messages in the asyncStorage
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

  //Get messages locally
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

    //Check is user is online or offline
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        console.log("HHHHHHHHHHHHHHHHH", "online");
        this.setState({ isConnected: true });

        // create a reference to your “messages” collection
        this.referenceChatMessages = firebase
          .firestore()
          .collection("messages");

        this.imgRef = this.authUnsubscribe = firebase
          .auth()
          .onAuthStateChanged((user) => {
            if (!user) {
              firebase.auth().signInAnonymously();
            }
            this.setState(
              {
                uid: user.uid,
                messages: [],
                loggedInText: "",
              },
              () => {
                this.saveMessages();
              }
            );

            //Listen for collection changes
            this.unsubscribe = this.referenceChatMessages
              .orderBy("createdAt", "desc")
              .onSnapshot(this.onCollectionUpdate);
          });
      } else {
        console.log("FFFFFFFFFFFF", "offline");
        this.setState({ isConnected: false });

        this.getMessages();
      }
    });

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
  }

  componentWillUnmount() {
    // this function is not a function (as the Render error warns)
    if (this.unsubscribe) {
      this.unsubscribe();
    }

    // stoplistening to authentication
    if (this.authUnsubscribe) {
      this.authUnsubscribe();
    }
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

  // addMessage = () => {
  //   const message = this.state.messages[0];
  //   this.referenceChatMessages.add({
  //     uid: this.state.uid,
  //     _id: message._id,
  //     text: message.text || '',
  //     createdAt: message.createdAt,
  //     user: message.user,
  //     image: message.image || null,
  //     location: message.location || null,
  //   });
  // };

  //function to style the bubble messages
  renderBubble(props) {
    return <Bubble {...props} wrapperStyle={styles.bubble} />;
  }

  //condition to render inputToolbar
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return <InputToolbar {...props} />;
    }
  }

  //Create the + button
  renderCustomActions(props) {
    return <CustomActions {...props} />;
  }

  //render map location
  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  render() {
    const { backgroundColor, name } = this.props.route.params;
    console.log({ logoPath: this.state.logoUrl });
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
          // isConnected={this.state.isConnected}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderActions={this.renderCustomActions.bind(this)}
          renderCustomView={this.renderCustomView.bind(this)}
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
      backgroundColor: "white",
    },
    right: {
      backgroundColor: "#3A85A9",
    },
  },
});
