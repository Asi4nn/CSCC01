import React from 'react';
import { AppContext, RootStore } from '../store/root';
import { Router, Route, Switch } from "../router";
import { StyleSheet, View } from "react-native";
import  { Auth } from './Auth';
import  { HomePage } from './HomePage';
import  { Profile } from './Profile';
import  { ErrorPage } from './ErrorPage';
// we could dependency inject a mock client here
import { HTTPClient } from '../services/httpclient';
import Navbar from '.././components/Navbar';
import { Courses } from './Courses';
import { AllCourseView } from './AllCourses';

const styles = StyleSheet.create({
    container: {
      marginTop: 0,
      paddingBottom: 10,
    },
    header: {
      fontSize: 20
    },
});

export function RootApp() {
    return (
        <AppContext.Provider value={new RootStore(new HTTPClient())}>
            <Router>
              <View style={styles.container}>
                  <Navbar/>
                  <Switch>
                    <Route exact path="/" component={HomePage} />
                    <Route path="/auth/:page" component={Auth} />
                    <Route path="/profile" component={Profile} />
                    <Route path="/course/:id" component={Courses} />
                    <Route path="/error" component={ErrorPage} />
                    <Route path="/courses" component={AllCourseView}/>
                  </Switch>
              </View>
            </Router>
        </AppContext.Provider>
    )
}