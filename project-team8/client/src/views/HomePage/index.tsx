import { observer } from 'mobx-react-lite';
import React from 'react';
import { Image, View, Text, StyleSheet, Linking } from 'react-native';
import { Link } from "react-router-native";
import Post from '../../components/SocialPost';
import { useState } from 'react';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    },
    h1: {
      color: 'black',
      fontSize: 40,
    },
    h2: {
      color: 'rgb(249, 183, 77)',
      fontSize: 18,
      marginTop: 8,
    },
    image: {
        width: 300,
        height: 260,
        justifyContent: 'center',
      },
      topContainer: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
      },
      middleContainer: {
        flex: 3,
        justifyContent: 'flex-start',
        alignItems: 'center',
      },
      bottomContainer: {
        justifyContent: 'flex-end',
        width: '90%',
        margin: 20,
        padding: 10,
      },
      buttonContainer: {
        backgroundColor: 'green',
        borderRadius: 5,
        padding: 8,
        margin: 8,
      },
      underLineText: {
        fontSize: 12,
        textDecorationLine: 'underline',
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    outerContainer: {
        display: 'flex',  
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export const HomePage = observer(() => {
    return (
        <View style={styles.container}>
          <View style={styles.topContainer}>
            <Text style={styles.h1}>Welcome to EAIC!</Text>
            <Text style={styles.h2}>
              An E-Learning Platform for the African Impact Challenge.
            </Text>
          </View>
          <View style={styles.middleContainer}>
            <Image source={{uri:"https://images.squarespace-cdn.com/content/v1/5959429eff7c50228e412bf1/1607561881703-9EE9CN7L551HJPITP9XB/AII+LOGO.png?format=1500w"}} style={styles.image}/>
          </View>
          <View>
            <Text style={styles.h2}>Sponsored by the African Impact Initiative.</Text>
          </View>
          <View style={styles.outerContainer}>
            <View style={styles.bottomContainer}>
                <View style={styles.buttonContainer}>
                    {/* <a style={{textAlign: 'center'}} href="https://www.africanimpact.ca/the-african-impact-challenge"><Text style={styles.underLineText}>Learn More</Text></a> */}
                    <Text style={styles.underLineText} onPress={() => Linking.openURL('https://www.africanimpact.ca/the-african-impact-challenge')}>Learn More</Text>
                </View>
            </View>
            <View style={styles.bottomContainer}>
                <View style={styles.buttonContainer}>
                <Link to="/auth/login" >
                        <Text style={styles.underLineText}>Get Started</Text>
                    </Link>
                </View>
            </View>
          </View>
          <View>
            <Text>
              Current Posts by our users
            </Text>
          </View>
          <Post
            avatarsource="https://www.shareicon.net/data/256x256/2016/01/05/232816_naruto_256x256.png"
            name="borutos dad"
            content = {"CONTENT"}
            post_id = {1}
            likes = {6}
          />
          <Post
            avatarsource="https://i.pinimg.com/474x/d0/dc/9d/d0dc9da4cede4c5b8974b50ab5a85432.jpg"
            name="borutos teacher"
            content = {"I have nice eyes"}
            post_id = {2}
            likes = {100}
          />
          <Post
            avatarsource="https://occ-0-1722-1723.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABSqsgfvQdS-2X_aWD1FSa8w28y8WvE19vH5fLRyg97N351A-cvmqoIJyjoP-2CqVWTtA46pkAs12i7JQsYV0wzQIF4bbzcTEtjrgEiTqzBNoOGOd.jpg?r=f90"
            name="boruto from another timeline"
            content = {"I will be hokage"}
            /*post_id = {3}*/
            likes = {10000}
          />
        </View>
      );
})