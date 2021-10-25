//@ts-nocheck
import React, {useState, useContext} from 'react';
import { StyleSheet, SafeAreaView, View, Text, Platform, TouchableOpacity, TextInput} from 'react-native';
import Modal from 'modal-react-native-web'
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import { AppContext } from '../store/root';
import { observer } from 'mobx-react-lite';


const sendPOSTRequest = (post_id) =>{
    axios.delete(`http://127.0.0.1:8000/api/delete/Post/${post_id}`)
}

const DeletePostMenu = observer((props : any) => {
  const appstate = useContext(AppContext);
  return (
      <View>
        <Modal
        visible={appstate.delete.modalVisible}
        animationType="slide"
        style={{
          height: 100,
          width: 100,
        }}
      >
        <SafeAreaView style={styles.centeredView}>
          <SafeAreaView style={styles.modalView}>
            <AntDesign
              name="close"
              size={24}
              color="black"
              style={{
                position: 'absolute',
                top: 15,
                left: 215,
              }}
              onPress={()=>appstate.delete.modalVisible = false} />
                <TouchableOpacity style={styles.enrollButton} onPress={()=>sendPOSTRequest(props.post_id)}>
                    <Text style={styles.titleText}>Delete Post</Text>
                </TouchableOpacity>
          </SafeAreaView>
        </SafeAreaView>
          </Modal>
          <AntDesign
              name="close"
              size={18}
              color="black"
              onPress={()=>appstate.delete.modalVisible = true} />
      </View>
      );
});

const styles = StyleSheet.create({
  input: {
    height: 60,
    width: 200,
    marginBottom: 10,
    borderWidth: 0.5,
  },
  titleText: {
    fontFamily: Platform.OS === 'web' ? 'Roboto-Regular.ttf' : 'Roboto' ,
    fontSize: Platform.OS === 'web' ? 18 : 18,
  },
  enrollButton: {
    height: 60,
    width: 200,
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
  },modalView: {
    margin: 20,
    height: 250,
    width: 250,
    backgroundColor: "#DDD8D8",
    borderRadius: 5,
    padding: 35,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  h2:{
    
  }
});

export default DeletePostMenu;
