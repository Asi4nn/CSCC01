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
    fetch("/api/profile/network/remove",requestOptions).then((response)=>
    response.json()
    ).then((data) => {});
  }

const UnfollowUsersButton = () =>{
    return(
        <TouchableOpacity
            style={styles.enrollButton}
            onPress={sendPOSTRequest}
            >
                <Text style={{color:"#efb960"}}>Unfollow</Text>  
            </TouchableOpacity>
    )
    
}

const styles = StyleSheet.create({
    enrollButton: {
        height: 40,
        width: 100,
        backgroundColor: '#fff',
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
      }
});

export default UnfollowUsersButton;