import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';


import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { navigationRef } from './RootNavigation';
import { navigate } from './RootNavigation';

export default function App() {

  function Classes() {
  {
    const axios = require('axios');
    let courses = null;
    // Make a request for a user with a given ID
    axios.get('course/')
    .then(function (response) {
        // handle success
        courses =
          <View style={styles.container}>
          <div>
            {response.data.map(i => {
            return (
              <View style={styles.courseCard}>
                <p>
                  {i.course_code}
                </p>
                <p>
                  {i.course_name}
                </p>
                <p>
                  Number Enrolled: {i.enrolled_students}
                </p>
              </View>
            );
            })}
          </div>
        </View>
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
    .then(function () {
        // always executed
        courses = <div></div>
    });
  }
    return courses;
  }

  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: "100px"
  },
  courseCard: {
    flex: 1,
    borderWidth: '2px',
    padding: '5px',
    fontFamily: 'Courier New',
    fontWeight: 'bold',
    backgroundColor: 'gold',
  },
});


    return (
        <View style={styles.container}>
          <h3 styles="font-family: 'sans-serif'">Mr McDougle</h3>
          <Classes />
        </View>
    );
}