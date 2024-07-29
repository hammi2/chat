import React, { Component } from "react";
import { Platform, KeyboardAvoidingView, SafeAreaView, ImageBackground, Text, View, Alert, TouchableOpacity, Modal } from "react-native";
import { GiftedChat, Bubble, MessageImage } from "react-native-gifted-chat";
import { ActionSheetProvider, connectActionSheet } from '@expo/react-native-action-sheet';
import Fire from "../Fire";
import EmojiSelector from 'react-native-emoji-selector';

class ChatScreen extends Component {
  state = {
    messages: [],
    replyingTo: null,
    showEmojiSelector: false,
    selectedMessage: null,
    lastMessageTime: null,
  };

  get user() {
    return {
      _id: Fire.uid || Fire.generateRandomUid(),
      name: this.props.route.params.name || 'Anonymous',
    };
  }

  componentDidMount() {
    console.log("User name:", this.props.route.params.name);
    Fire.get((message) => {
      this.setState((previous) => {
        // تحقق من عدم وجود الرسالة بالفعل في الحالة
        if (previous.messages.find(msg => msg._id === message._id)) {
          return null;
        }
        return {
          messages: GiftedChat.append(previous.messages, message),
        };
      });
    });
  }

  componentWillUnmount() {
    Fire.off();
  }

  onSend = (messages = []) => {
    messages.forEach(message => {
      if (message.image) {
        console.log("Sending image message: ", message.image);
      }
      if (this.state.replyingTo) {
        message.replyingTo = this.state.replyingTo;
        this.setState({ replyingTo: null });
      }
    });

    Fire.send(messages);
  }

  chooseImage = () => {
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const source = { uri: response.uri };
        this.onSend([{ image: source.uri }]);
      }
    });
  }

  onLongPress = (context, message) => {
    const options = ['Reply', 'React', 'Delete', 'Cancel'];
    const cancelButtonIndex = options.length - 1;
    context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          this.setState({ replyingTo: message });
        } else if (buttonIndex === 1) {
          this.setState({ showEmojiSelector: true, selectedMessage: message });
        } else if (buttonIndex === 2) {
          this.setState((previous) => ({
            messages: previous.messages.filter((msg) => msg._id !== message._id),
          }));
          Fire.delete(message._id);
        }
      },
    );
  }

  onEmojiSelected = (emoji) => {
    const { selectedMessage, messages } = this.state;
    const updatedMessages = messages.map((msg) => {
      if (msg._id === selectedMessage._id) {
        const updatedMessage = { ...msg, reaction: emoji };
        Fire.addReaction(updatedMessage._id, emoji);
        return updatedMessage;
      }
      return msg;
    });
    this.setState({ messages: updatedMessages, showEmojiSelector: false, selectedMessage: null });
  }

  onSwipeRight = (message) => {
    this.setState({ replyingTo: message });
  }

  renderMessageImage = (props) => {
    return (
      <MessageImage
        {...props}
        imageStyle={{
          width: 200,
          height: 200,
          borderRadius: 15,
          margin: 3
        }}
      />
    );
  }

  renderBubble = (props) => {
    const { currentMessage } = props;

    return (
      <View>
        {currentMessage.replyingTo && (
          <View style={{ padding: 5, borderLeftWidth: 2, borderLeftColor: 'red', marginBottom: 5 }}>
            <Text style={{ color: '#aaa' }}>
              {currentMessage.replyingTo.text}
            </Text>
          </View>
        )}
        <Bubble
          {...props}
          wrapperStyle={{
            left: {
              backgroundColor: '#555',
            },
            right: {
              backgroundColor: '#333',
            },
          }}
          textStyle={{
            left: {
              color: '#fff',
            },
            right: {
              color: '#fff',
            },
          }}
        />
        {currentMessage.reaction && (
          <Text style={{ fontSize: 20, marginTop: 5, alignSelf: currentMessage.user._id === this.user._id ? 'flex-end' : 'flex-start' }}>
            {currentMessage.reaction}
          </Text>
        )}
      </View>
    );
  }

  render() {
    const chat = (
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend}
        user={this.user}
        renderBubble={this.renderBubble}
        onLongPress={this.onLongPress}
        onSwipeRight={this.onSwipeRight}
        textInputStyle={{
          backgroundColor: '#666',
          color: '#fff',
          borderRadius: 20,
          paddingHorizontal: 10,
          marginHorizontal: 10,
        }}
        keyExtractor={(item) => item._id}
      />
    );

    return (
      <ImageBackground
        source={{ uri: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjLOxrMwiripHeBv8CMzCjwGBt-JeRKBJf9uvmhtZaNiYoM3ZFddhhamuHVPw2OCzcSOWjd0k-HrgH16vdBB9u8WnY4O1vd2rPDPjvWFRIGuZlMAf8E8-Oa8hP-e-ImOO-zvrNvSuDs40Gc/s1600/%25D8%25B5%25D9%2588%25D8%25A7%25D9%2585-8.jpg' }}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={30} enabled={true}>
            {chat}
          </KeyboardAvoidingView>
        ) : (
          <SafeAreaView style={{ flex: 1 }}>{chat}</SafeAreaView>
        )}
        <Modal
          visible={this.state.showEmojiSelector}
          animationType="slide"
          onRequestClose={() => this.setState({ showEmojiSelector: false })}
        >
          <EmojiSelector
            onEmojiSelected={this.onEmojiSelected}
            showSearchBar={false}
            showTabs={false}
            showHistory={false}
            showSectionTitles={false}
          />
        </Modal>
      </ImageBackground>
    );
  }
}

export default connectActionSheet(ChatScreen);
