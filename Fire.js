import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";

class Fire {
  constructor() {
    this.init();
    this.checkAuth();
  }

  init = () => {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyAMadAMXoCttGEaSfHqYNUcEPERqdl32f4",
        authDomain: "react-chat-e5aeb.firebaseapp.com",
        projectId: "react-chat-e5aeb",
        storageBucket: "react-chat-e5aeb.appspot.com",
        messagingSenderId: "870544988248",
        appId: "1:870544988248:web:bc6283fd51dde2ee90122d",
      });
    }
  };

  checkAuth = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log("User is signed in with UID:", user.uid);
      } else {
        console.log("No user is signed in. Signing in anonymously...");
        firebase.auth().signInAnonymously().catch(error => {
          console.error("Error signing in anonymously:", error);
        });
      }
    });
  };

  send = messages => {
    if (!Array.isArray(messages)) {
      console.error("Messages should be an array");
      return;
    }

    messages.forEach(item => {
      const message = {
        _id: item._id || this.generateRandomUid(),
        text: item.text,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        user: {
          _id: item.user._id || this.generateRandomUid(),
          name: item.user.name || 'Anonymous'
        },
        reaction: item.reaction || null,
        replyingTo: item.replyingTo || null,
      };

      // Remove undefined properties
      const cleanMessage = JSON.parse(JSON.stringify(message));

      this.db.push(cleanMessage);
    });
  };

  generateRandomUid = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  parse = message => {
    const { user, text, timestamp, reaction, replyingTo } = message.val();
    const { key: _id } = message;
    const createdAt = new Date(timestamp);
    return { _id, user, text, createdAt, reaction, replyingTo };
  };

  get = callback => {
    this.db.on('child_added', snapshot => callback(this.parse(snapshot)));
    this.db.on('child_changed', snapshot => callback(this.parse(snapshot)));
  };

  off = () => {
    this.db.off();
  };

  delete = (messageId) => {
    this.db.child(messageId).remove();
  }

  updateMessage = (message) => {
    this.db.child(message._id).update(message);
  }

  addReaction = (messageId, reaction) => {
    const messageRef = this.db.child(messageId);
    messageRef.update({ reaction });
  }

  get db() {
    return firebase.database().ref("messages");
  }

  get uid() {
    return (firebase.auth().currentUser || {}).uid;
  }
}

export default new Fire();
