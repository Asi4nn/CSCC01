import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

//need to know what data is gonna be in the URI

let profileId : string = "aaaaa";

const sendPOSTRequest = () =>{
    const requestOptions = {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        "profileId" : profileId,
      }),
    };
    fetch("/api/profile/network/add",requestOptions).then((response)=>
    response.json()
    ).then((data) => ;
  }

const FollowUsersButton = () =>{
    return(
        <TouchableOpacity
            style={styles.enrollButton}
            onPress={sendPOSTRequest}
            >
                <Text>Follow</Text>  
        </TouchableOpacity>
    )
    
}

const styles = StyleSheet.create({
    enrollButton: {
        height: 40,
        width: 100,
        backgroundColor: '#efb960',
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
      }
});

export default FollowUsersButton;