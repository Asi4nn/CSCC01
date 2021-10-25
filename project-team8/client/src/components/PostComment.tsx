//@ts-nocheck
import React from 'react';
import { StyleSheet, SafeAreaView, View, Text, Platform, TouchableOpacity, TextInput} from 'react-native';
import { Formik } from 'formik';

function sendPOSTRequest(content : string){
    const requestOptions = {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          "content" : content,
        }),
      };
      fetch("/api/user/comment/create/post",requestOptions).then((response)=>
      response.json()
      ).then((data) => console.log(data)); 
}

function PostComment(){
  return(
    <SafeAreaView>
      <Formik
      initialValues={{ content: '' }}
      onSubmit={(values) => {
        sendPOSTRequest(values.content);
      } }
      >
        {(props) => (
          <SafeAreaView style={styles.centeredView}>
            <TextInput
              style={styles.input}
              placeholder="Type your reply here"
              onChangeText={props.handleChange('content')}
              value={props.values.content} />
            <TouchableOpacity
              style={styles.postButton}
              onPress={props.handleSubmit}
            >
              <Text style={styles.titleText}>Reply</Text>
            </TouchableOpacity>
          </SafeAreaView>
        )}
    </Formik>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 60,
    width: 200,
    borderRadius: 2,
    marginBottom: 10,
    borderWidth: 0.5,
  },
  titleText: {
    fontFamily: Platform.OS === 'web' ? 'Roboto-Regular.ttf' : 'Roboto' ,
    fontSize: Platform.OS === 'web' ? 16 : 18,
  },
  postButton: {
    position: 'relative',
    left: -60,
    height: 30,
    width: 80,
    borderRadius: 2,
    backgroundColor: '#efb960',
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    marginTop: 22,
  },
});

export default PostComment;