//@ts-nocheck
import React, {useState} from 'react';
import { StyleSheet, SafeAreaView, View, Text, Platform, TouchableOpacity, TextInput} from 'react-native';
import { Comment, Avatar } from 'antd';
import { Link } from 'react-router-native';

export async function getComments(modelType: string, modelId : string) : Promise<string>{
    const url = new URL(`/api/user/comment/display/${modelType}/${modelId}`);
    const params = {parentModelId};
    url.search = new URLSearchParams(params).toString();
    const response = await fetch(url.toString());
    const data = await response.json();
    return data;
}

export function CommentThread({ id, allComments, PostComment, profileName, parentModelId, content }){

    let childComments = () => allComments.filter(c => c.parent_comment_id === id);

    return(
        <Comment
            author={
                <Link to={`/profile/${profileName}`}>
                {profileName}
                </Link>
            }
            avatar={
                <Link to={`/profile/${profileName}`}>
                <Avatar
                    src={`/profile/${profileName}/avatar.jpeg`}
                    alt={`${profileName}-avatar`}
                />
                </Link>
            }
            content={
                <p>{`${id} - ${content}`}</p>
            }
            datetime={date}
            >
            {
            
            childComments().map(c => (
                <CommentThread 
                    id={id}  
                    allComments={allComments}
                    PostComment={PostComment}
                    profileName={profileName}
                    parentModelId={parentModelId}
                />
            ))
            }
            </Comment>
    );
}

