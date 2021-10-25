import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import {AppContext} from "../../store/root";
import CreateClassComponent from "../../components/CreateClassComponent";
import { observer } from "mobx-react-lite";
import { useEffect } from 'react';
import { Route, RouteComponentProps } from "../../router";
import { useHistory } from "../../router";
import { Card, Text, Button} from 'react-native-elements';

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
    }
});

export const AllCourseView = observer(({ match } : RouteComponentProps) => {
    const appState = useContext(AppContext);
    const history = useHistory();
    useEffect(() => {
        appState.courses.getAllCourses();
        appState.courses.getEnrolledCourses();
    }, [])
    return (
        <View style={styles.container}>
            <View>
                { appState.profile.usertype === "INSTR" ? 
                    <View style={styles.createACourse}>
                        <Text style={{color: "green", fontWeight: "bold", marginRight: 15}}>
                            Create a Course
                        </Text>
                        <CreateClassComponent/> 
                    </View> : null
                }

                <View style={styles.container}>
                    <Text>
                        { appState.profile.usertype !== "INSTR" ? 'Enrolled Courses' : 'Courses Taught' }
                    </Text>
                    <div>
                        {appState.courses.enrolledCourses.length !== 0 ? appState.courses.enrolledCourses.map(i => {
                            return (
                                    <Card key={i.course_code}>
                                        <Text>
                                            {i.course_code} - {i.course_code} - Number Enrolled {i.enrolled_students.length}
                                        </Text>
                                        <Button 
                                            onPress={() => history.push(`/course/${i.id}`)}
                                            title="view details"
                                        />
                                    </Card>
                            );
                        }) : <Text>No Enrolled Courses</Text>}
                    </div> 
                </View>

                <View style={styles.container}>
                    <Text>
                        All Courses
                    </Text>
                    <div>
                        {appState.courses.course ? appState.courses.allCourses.map(i => {
                            return (
                                    <Card key={i.course_code}>
                                        <Text>
                                            {i.course_code} - {i.course_code} - Number Enrolled {i.enrolled_students.length}
                                        </Text>
                                        <Button 
                                            onPress={() => history.push(`/course/${i.id}`)}
                                            title="view details"
                                        />
                                    </Card>
                            );
                        }) : null}
                    </div>
                </View>
            </View>
        </View>
    );
})
