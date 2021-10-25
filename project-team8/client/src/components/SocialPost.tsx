import React, { useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, Platform, StyleSheet} from "react-native";
import { Avatar } from "react-native-elements";
import { AntDesign } from '@expo/vector-icons';
import axios from "axios";
import CreatePost from "./CreatePost";
import DeletePostMenu from './DeletePostMenu';


const longStory = "Lamb, tell me a story... There was once a pale man with dark hair who was very lonely... Why was it lonely? All things must meet this man, so they shunned him. Did he chase them all? He took an axe, and split himself in two... So he will always have a friend...? ...So he will always have a friend."


//MANDATORY PROPS: avatarsource = url for avatar, likes = num likes, name = display name, content = post content


function getPostData(post_id:string){
    //axios.get(`/api/user/post/display/${"post"}/${post_id}`).then((response) => {postData=response.data});
    //axios.get(`/api/profile/${postData.profile_id}`).then((response) => {profileData=response.data});
}

function deletePost(){
   //axios.post(`api/user/post/delete/${postData.post_id}`)
}

function Post(props : any){
    const [replyVisible, setReplyVisible] = useState(false);
    if (props.content === undefined || props.post_id === undefined){
        return null
    }
    return(
        <SafeAreaView>
            <SafeAreaView style={styles.postStyle}>
                <Avatar
                rounded
                size={50}
                source={{uri:props.avatarsource}}
                containerStyle={styles.imageStyle}
                />
                <Text style={styles.nameText}>{props.name}</Text>
                <SafeAreaView style={{position: 'absolute', top: "10%", right: 10}}>
                    <DeletePostMenu post_id={props.post_id}/>
                </SafeAreaView>
                
                <SafeAreaView style={styles.contentTextBox}>
                    <Text style={styles.contentText}>{props.content}</Text>
                </SafeAreaView>
                <SafeAreaView style={styles.optionsTray}>
                <AntDesign
                name="message1"
                size={20}
                color="black"
                onPress={()=> setReplyVisible(true)}
                />
                <AntDesign
                name="hearto"
                size={20}
                color="black"
                style={{marginLeft:50}}
                />
                <Text style={{marginLeft:5}}>{props.likes}</Text>
                </SafeAreaView>
            </SafeAreaView>
            {replyVisible ? <CreatePost/> : null}
        </SafeAreaView>
  
    );
}

const styles = StyleSheet.create({
    postStyle:{
        width: 550,
        height: 150,
        backgroundColor: "#DDD8D8",
        borderColor: "#8a8a8a",
        borderWidth: 1,
        borderRadius: 3,
    },
    imageStyle:{
        margin:10,
    },
    nameText:{
        position:'absolute',
        left:"11%",
        top:"8%",
        fontFamily: Platform.OS === 'web' ? 'Roboto-Regular.ttf' : 'Roboto' ,
        fontSize: Platform.OS === 'web' ? 16 : 18,
        fontWeight: 'bold',

        marginLeft:10,
    },
    contentTextBox: {
        position:'absolute',
        width: 470,
        height: 100,
        left:"11%",
        top:5,
        marginTop: 30,
        borderColor: "blue",
      },
    contentText:{
        flexShrink:1,
        position:'relative',
        marginLeft:10,
    },
    optionsTray:{
        position:'absolute',
        bottom:"5%",
        left:"40%",
        flexDirection:"row",
        justifyContent:"center",
        alignContent:"center",
        alignItems:"center",
        marginTop:5,
    }
});

export default Post;