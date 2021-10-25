import React, {useContext, useState} from 'react';
import { StyleSheet, SafeAreaView, View, Text, Platform, TouchableOpacity} from 'react-native';
import Modal from 'modal-react-native-web'
import {TextInput} from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import { Formik } from 'formik';
import url from '../config/urls';
import { observer } from "mobx-react-lite";
import { AppContext } from '../store/root';
import { AppState } from 'react-native';


const sendPOSTRequest = async (enteredCourseName: string, enteredCourseCode: string, enteredPassword: string, enteredCalendarLink: string) => {
    try {
        await axios.post(`${url}/api/course/create/`, {
            course_name : enteredCourseName,
            course_code : enteredCourseCode,
            password : enteredPassword,
            calendar_link : enteredCalendarLink
        });
        return true;
    } catch (error) {
        console.log(error.response.data);
        return false;
    }
}

const CreateClassButton = observer(() => {
  const [modalVisible, setModalVisible] = useState(false);
  const appState = useContext(AppContext);

  return (
      <View>
        <Modal
        visible={modalVisible}
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
              onPress={() => setModalVisible(false)} />
            <Formik
              initialValues={{ 
                courseName: '',
                courseCode: '',
                password: '',
                calendarLink: ''
            }}
              onSubmit={async (values) => {
                const success = await sendPOSTRequest(values.courseName, values.courseCode, values.password, values.calendarLink);
                if (success) {
                  setModalVisible(false);
                  appState.courses.getAllCourses();
                }
              }}
            >
              {(props) => (
                <SafeAreaView style={styles.centeredView}>
                  <TextInput
                    style={styles.input}
                    placeholder="Course Name"
                    onChangeText={props.handleChange('courseName')}
                    value={props.values.courseName} />
                  <TextInput
                    style={styles.input}
                    placeholder="Course Code"
                    onChangeText={props.handleChange('courseCode')}
                    value={props.values.courseCode} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    onChangeText={props.handleChange('password')}
                    value={props.values.password} />
                  <TextInput
                    style={styles.input}
                    placeholder="Calendar Link"
                    onChangeText={props.handleChange('calendarLink')}
                    value={props.values.calendarLink} />
                  <TouchableOpacity
                    style={styles.enrollButton}
                    onPress={props.handleSubmit}
                  >
                    <Text style={styles.titleText}>Create Class</Text>
                  </TouchableOpacity>
                </SafeAreaView>
              )}
            </Formik>
          </SafeAreaView>
        </SafeAreaView>
          </Modal>
          <AntDesign
              name="plus"
              size={24}
              color="black"
              onPress={() => setModalVisible(true)} />
      </View>
      );
})

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
    height: 420,
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
});

export default CreateClassButton;