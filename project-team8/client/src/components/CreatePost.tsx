//@ts-nocheck
import React from 'react';
import { StyleSheet, SafeAreaView, View, Text, Platform, TouchableOpacity, TextInput} from 'react-native';
import { Formik } from 'formik';
import { HTTPClient } from '../services/httpclient';
import axios from 'axios';
import url from "../config/urls";

function sendPOSTRequest(content : string){
    axios.post(`${url}/api/user/post/create/`, {
        content,
        allow_comments : true
    })
}


function CreatePost(){
    return(
      <SafeAreaView style={styles.postStyle}>
        <Formik
        initialValues={{ content: '' }}
        onSubmit={(values) => {
          sendPOSTRequest(values.content);
        } }
        >
          {(props) => (
            <SafeAreaView style={styles.container}>
              <TextInput
                style={styles.input}
                placeholder="What's on your mind?"
                onChangeText={props.handleChange('content')}
                value={props.values.content} 
                multiline={true}
                maxLength={300}/>
              <TouchableOpacity
                style={styles.postButton}
                onPress={props.handleSubmit}
              >
                <Text style={styles.titleText}>Post</Text>
              </TouchableOpacity>
            </SafeAreaView>
          )}
        </Formik>
      </SafeAreaView>
    );
  }
  
const styles = StyleSheet.create({
      postStyle:{
        flex: 1,
        flexShrink:1,
        width: 550,
        height: 100,
        backgroundColor: "#DDD8D8",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        borderRadius: 3,
        marginTop:10,
    },
    input: {
      width: 500,
      height: 100,
      borderRadius: 3,
      marginBottom: 10,
      borderWidth: 0.5,
    },
    titleText: {
      fontFamily: Platform.OS === 'web' ? 'Roboto-Regular.ttf' : 'Roboto' ,
      fontSize: Platform.OS === 'web' ? 16 : 18,
    },
    postButton: {
      position: 'relative',
      left: "0%",
      height: 30,
      width: 80,
      borderRadius: 2,
      backgroundColor: '#efb960',
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      alignContent: "center",
    },
    container: {
      flex: 1,
      justifyContent: "flex-end",
      alignItems: "flex-end",
      alignContent: "flex-end",
      color: "#DDD8D8",
      marginTop: 22,
    },
});
  
  export default CreatePost;