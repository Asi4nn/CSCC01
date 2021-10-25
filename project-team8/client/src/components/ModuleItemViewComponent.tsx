import React, {Component, useContext} from 'react';
import {AppContext} from '../store/root';
import {StyleSheet, View, Text} from 'react-native';
import {Card} from 'react-native-elements';

const styles = StyleSheet.create({
    moduleItem: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default function ModuleItemViewComponent() {
    const appState = useContext(AppContext);

    const moduleItemData = appState.courses.getModuleItemData();
    const lecture = moduleItemData?.lecture;
    const assignment = moduleItemData?.assignment;
    const mark = appState.courses.getMarkData();

    const Grade = () => {
        if (assignment !== undefined && assignment.mark_visible) {
            return (
                <View>
                    <Text>You received {mark?.mark}%.</Text>
                </View>
            )
        } else {
            return (
                <View>
                    <Text>Your assignment grade is muted.</Text>
                </View>
            )
        }
    }
    if (moduleItemData === null) {
        return null;
    }

    if (lecture !== undefined) {
        return(
            <View style={styles.moduleItem}>
                <Card>
                    <Card.Title>{moduleItemData?.name}</Card.Title>
                    <Card.Divider/>
                    <Card.Divider/>
                    <iframe width="560" 
                      height="315" 
                      src={lecture.video} 
                      allow="autoplay; encrypted-media" 
                      allowFullScreen>
                    </iframe>
                    <Text>{lecture.notes}</Text>
                    <Card.Divider/>
                </Card>
            </View>
        );
    } else if (assignment !== undefined) {
        return(
            <View style={styles.moduleItem}>
                <Card >
                    <Card.Title>{moduleItemData?.name}</Card.Title>
                    <Card.Divider/>
                    {/* <Text>{module.description}</Text>   // again no description (as of yet) */}
                    {/* <Card.Divider/> */}
                    <Text>{assignment.notes}</Text>
                    <Card.Divider/>
                    <Grade/>
                </Card>
            </View>
        );
    }

    return null;
    
}