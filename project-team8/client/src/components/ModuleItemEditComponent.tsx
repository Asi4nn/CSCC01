import React, {useContext} from 'react';
import {StyleSheet, View, Text, TextInput, FlatList} from 'react-native';
import {Card} from 'react-native-elements';
import {RadioButton} from 'react-native-paper';
import { AssignmentData } from '../store/Course/course';
import {AppContext} from '../store/root';

const styles = StyleSheet.create({
    moduleItem: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    }
});

const Grade = ({assignment} : {assignment : AssignmentData}) => {
    const [checked, setChecked] = React.useState('Yes');
    // if(assignment !== undefined && !assignment.mark_visible) {
    //     setChecked('No');
    // }
    return(
        <View style={{flex: 1, flexDirection: 'row'}}>
            <Text>Grades</Text>
            <Text>Make Grades Visible?</Text>
            <RadioButton
                value='Yes'
                status={checked === 'Yes' ? 'checked' : 'unchecked'}
                onPress={() => setChecked('Yes')}
            />
            <RadioButton
                value='No'
                status={checked === 'No' ? 'checked' : 'unchecked'}
                onPress={() => setChecked('No')}
            />
            {/*
                <FlatList
                    data={courseData?.enrolled_students}
                    keyExtractor={(student) => student.id}
                    renderItem={(student : any) => {
                        const [currentGrade, changeCurrentGrade] = React.useState(100);
                        return(
                            <View style={{flex: 1, flexDirection: 'row'}}>
                                <Text style={{flex: 2}}>{student.id}</Text>
                                <Text style={{flex: 4}}>{student.first_name} {student.last_name}</Text>
                                <TextInput/>
                            </View>
                        )
                    }}
                />
            */}
        </View>
    )
}

export default function ModuleItemEditComponent() {
    const appState = useContext(AppContext);
    const courseData = appState.courses.course;
    const moduleData = appState.courses.getModuleData();
    const moduleItemData = appState.courses.getModuleItemData();
    const lecture = moduleItemData?.lecture;
    const assignment = moduleItemData?.assignment;
    const mark = assignment?.marks;

    

    if (lecture) {
        // const [currentVideo, changeCurrentVideo] = React.useState(lecture.video);
        // const [currentNotes, changeCurrentNotes] = React.useState(lecture.notes);
        return(
            <View>
                <Card wrapperStyle={styles.moduleItem}>
                    <Card.Title>{moduleItemData?.name}</Card.Title>
                    <Card.Divider/>
                    <Card.Divider/>
                    {/* <TextInput
                        onChangeText={(changeCurrentVideo)}
                        value={lecture?.video}
                        placeholder={lecture?.video}    // whats the point of this ?
                        style={{flex: 5}}
                    />
                    <iframe width="560" 
                      height="315" 
                      src={currentVideo} 
                      allow="autoplay; encrypted-media">
                    </iframe>
                    <TextInput
                        onChangeText={changeCurrentNotes}
                        value={currentNotes}
                        placeholder={currentNotes}
                        style={{flex: 5}}
                    /> */}
                    <Card.Divider/>
                </Card>
            </View>
        );
    } else if (assignment) {
        // const [currentNotes, changeCurrentNotes] = React.useState(assignment.notes);
        // const [currentMarkVisibility, changeCurrentMarkVisibility] = React.useState(assignment.mark_visible);
        return(
            <View>
                <Card wrapperStyle={styles.moduleItem}>
                    <Card.Title>{moduleData?.name}</Card.Title>
                    <Card.Divider/>
                    <Text>{moduleData?.description}</Text>
                    <Card.Divider/>
                    {/* <TextInput
                        onChangeText={(changeCurrentNotes)}
                        value={currentNotes}
                        placeholder={currentNotes}
                        style={{flex: 5}}
                    /> */}
                    <Card.Divider/>
                    <Grade assignment={assignment}/>
                </Card>
            </View>
        );
    } else {
        return  (
            <View>    
            </View>
        )
    }
    
}
