import { observer } from "mobx-react-lite";
import React, { useContext, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Card, Input, Text } from "react-native-elements";
import { RouteComponentProps, useHistory } from "../../router";
import { AppContext } from "../../store/root";

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
        borderWidth: 2,
        padding: '5px',
        backgroundColor: 'white',
        height: '150px',
        width: '400px',
        marginBottom: '20px',
    },
    createACourse: {
        flexDirection: "row"
    },
});

type CourseID = {
    id : string
}


export const HomePage = observer(({match} : RouteComponentProps<CourseID>) => {
    const appState = useContext(AppContext);
    const history = useHistory();
    useEffect(() => {
        appState.courses.setCourseID(parseInt(match.params.id))
        appState.courses.getCourse();
    }, []);
    return (
        <View style={styles.container}>
            <Card>
                <Text>Course: {appState.courses.course.course_name}</Text>
                <Text>Professor: {appState.courses.course.professor.first_name} {appState.courses.course.professor.last_name}</Text>
            </Card>

            <View> 
                <Text>
                    Course Page { appState.courses.isInCourse ? appState.profile.usertype === "INSTR" ? '(teaching)' : '(enrolled)' : null}
                </Text>
                {
                    appState.profile.usertype !== "INSTR" ?    
                        <View>
                            {
                                !appState.courses.isInCourse ? 
                                    <Input
                                        placeholder='password'
                                        errorStyle={{ color: 'red' }}
                                        onChangeText={pw => appState.courses.password = pw }
                                        secureTextEntry
                                        placeholderTextColor="#003f5c"
                                        errorMessage={appState.ui.course.passwordError}
                                    /> : null
                            }
                            <Button onPress={async () => {
                                if (appState.courses.isInCourse) {
                                    await appState.courses.unenrollStudent();
                                } else {
                                    await appState.courses.enrollStudent();
                                }
                                await appState.courses.getEnrolledCourses();
                                await appState.courses.getCourse();
                            }} title={appState.courses.isInCourse ? "Unenroll" : "Enroll"}/> 
                        </View> : null
                }
            </View>

            <Text>
                Enrolled Students ({appState.courses.course.enrolled_students.length})
            </Text>
            { 
                appState.courses.course.enrolled_students.map(
                    student => {
                        console.log(student);
                        return (
                            <Card>
                                <Text>
                                    {student.first_name} - {student.last_name}
                                </Text>
                                <Button onPress={() => history.push(`/profile/${student.socials_link}`)} title="Link"/>
                            </Card>
                        )
                    }
            )}
 
        </View>
    )
})