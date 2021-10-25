import React , { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Platform, Image } from 'react-native';
import { RouteComponentProps, useHistory, useLocation } from "../../router";
import { observer } from 'mobx-react-lite';
import { AppContext } from '../../store/root';
import { Card, Text, Button, Input } from 'react-native-elements';
import ProfileRow from './ProfileRow'

type ProfileMatch = {
  socials_link : string
}


const styles = StyleSheet.create({
  container: {
    display: 'flex',
  },
  headerBackgroundImage: {
    paddingBottom: 20,
    paddingTop: 45,
  },
  headerColumn: {
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        alignItems: 'center',
        elevation: 1,
        marginTop: -1,
      },
      android: {
        alignItems: 'center',
      },
    }),
  },
  profileItem: {
    fontSize : 20
  },
  placeIcon: {
    color: 'white',
    fontSize: 26,
  },
  userImage: {
    borderColor: '#FFF',
    borderRadius: 85,
    borderWidth: 3,
    height: 100,
    resizeMode: "contain",
    marginBottom: 15,
    width: 100,
  },
  userNameText: {
    color: 'black',
    fontSize: 22,
    fontWeight: 'bold',
    paddingBottom: 8,
    textAlign: 'center',
  },
  button : {
    width : 150,
    padding : 10,
  }
})
export const HomeScreen = observer(({ match } : RouteComponentProps<ProfileMatch>) => {
    const appState = useContext(AppContext);
    const history = useHistory();
    const location = useLocation();
    useEffect(() => {
        async function getProfile() {
          const success = await appState.profile.getUserProfile(match.params.socials_link);
          if (!success) {
            history.push("/error");
          }
        }
        async function getNetwork() {
          await appState.profile.getUserNetwork();
        }
        getProfile();
        getNetwork();
    }, [location]);
    return (
        <View style={styles.container}>
            <Card>
                <View>
                    <View style={styles.headerColumn}>
                        <Image
                            style={styles.userImage}
                            source={{uri: 'https://reactnative.dev/img/tiny_logo.png'}}
                        />
                        <Text style={styles.userNameText}>{appState.profile.isHomePage ?  'Your': ''} Profile ({`${appState.profile.firstname} ${appState.profile.lastname}`})</Text>
                    </View>
                </View>
                <Card.Title>Details</Card.Title>
                <ProfileRow></ProfileRow>
                <View style={{ padding : 50 }}>
                  {
                    appState.profile.edit ? 
                    <Input 
                      placeholder='Username'
                      value={appState.profile.username}
                      errorStyle={{ color: 'red' }}
                      onChangeText={name => appState.profile.username = name }  
                      maxLength={200}
                    >
                    </Input>
                    :
                    <Text style={styles.profileItem}>
                        {appState.profile.username !== '' ? appState.profile.username : 'No Username'}
                    </Text> 
                  }
                  {
                    appState.profile.edit ? 
                    <Input 
                      placeholder='Social'
                      value={appState.profile.socials_link}
                      errorStyle={{ color: 'red' }}
                      onChangeText={link => appState.profile.socials_link = link }
                      errorMessage={appState.ui.profile.linkError}
                    >
                    </Input>
                    :
                    <Text style={styles.profileItem}>
                        {appState.profile.socials_link !== '' ? appState.profile.socials_link : 'No Social Link'}
                    </Text> 
                  }
                  {
                    appState.profile.edit ? 
                    <Input 
                      placeholder='Description'
                      style={{height : 100}}
                      value={appState.profile.description}
                      errorStyle={{ color: 'red' }}
                      onChangeText={desc => appState.profile.description = desc }
                      multiline={true}  
                      maxLength={200}
                    >
                    </Input>
                    :
                    <Text style={styles.profileItem}>
                        {appState.profile.description !== '' ? appState.profile.description : 'No Profile Description'}
                    </Text> 
                  }
                </View>
                { appState.profile.isHomePage ? 
                  <View style={{ display : 'flex', flexDirection :'row',  justifyContent : 'center'}}>
                    <Button 
                      style={styles.button}
                      onPress={async () => {
                        appState.ui.clearProfile();
                        if (appState.profile.edit) {
                          const success = await appState.profile.updateUserProfile();
                          if (success) { 
                            appState.profile.toggleEdit();
                            history.push(`/profile/${appState.profile.socials_link}`);
                          }
                        } else {
                          appState.profile.toggleEdit();
                        }
                      }}
                      title={appState.profile.edit ? "Save" : "Edit"}
                    />
                    <Button
                      style={styles.button}
                      onPress={() => appState.profile.createAPost()}
                      title="Create a Post"
                    />  
                  </View>
                    : null
                } 
                { 
                  appState.profile.isHomePage ? null : 
                  <View style={{ display : 'flex', flexDirection :'row',  justifyContent : 'center'}}>
                      <Button
                            onPress={() => 
                              appState.profile.isFollowing ? appState.profile.unfollowUser() :
                                                             appState.profile.followUser()
                            }
                            title={appState.profile.isFollowing ? "Unfollow" : "Follow"}
                      />
                  </View>
                }
                {
                  appState.profile.isFollower ? 
                    <View>
                        <Text>{appState.profile.firstname} {appState.profile.isFollowing ? 'also ' :  null}follows you</Text>
                    </View> : null
                }
            </Card>
        </View>
    ); 

})


