import React, { useContext } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import {AppContext} from "../../store/root";
import { observer } from "mobx-react-lite";
import { useEffect } from 'react';
import { RouteComponentProps, useHistory } from '../../router';
import { Button, Card, Input } from 'react-native-elements';

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
    inputView: {
        width: "30%"
    }
});

type CourseID = {
    id : string
}

export const ModulesView = observer(({ match } : RouteComponentProps<CourseID>) => {
    const appState = useContext(AppContext);
    const history = useHistory();
    useEffect(() => {
        appState.courses.setCourseID(parseInt(match.params.id))
        appState.courses.getCourse();
    }, [])

    if (appState.profile.usertype == "INSTR") {
        return (
            <View style={styles.container}>
                <Text>
                    Modules page { appState.courses.isInCourse ? '(teaching)' : null}
                </Text>
                { appState.courses.isInCourse ? 
                    <View style={styles.inputView}>
                        <Text> Create a Module</Text>
                        <Input
                            placeholder='Name'
                            errorStyle={{ color: 'red' }}
                            onChangeText={name => appState.courses.moduleName = name }
                            placeholderTextColor="#003f5c"
                        />
                        <Input
                            placeholder='Description'
                            errorStyle={{ color: 'red' }}
                            onChangeText={desc => appState.courses.moduleDesc = desc }
                            placeholderTextColor="#003f5c"
                        />
                        <Button onPress={async () => {
                            await appState.courses.createModule();
                            await appState.courses.getCourse();
                        }} title="Create Module"/>
                    </View> : null
                }
                {
                    appState.courses.course.modules.map(i => {
                        return (
                            <Card key={i.id}>
                                <Text>
                                    {i.name} - {i.description}
                                </Text>
                                <Button title="View Module"
                                    onPress={() => {
                                        history.push(`/course/${appState.courses.course.id}/module/${i.id}`)
                                    }}
                                >
                                </Button>
                            </Card>
                        );
                    })
                }
            </View>
        )
    } else {
        return (
            <View style={styles.container}> 
                <Text>
                    Course Page { appState.courses.isInCourse ? '(enrolled)' : null}
                </Text>
                <View style={styles.inputView}>
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
                </View>
                {
                    appState.courses.isInCourse ? appState.courses.course.modules.map(i => {
                        return (
                            <Card key={i.id}>
                                <Text>
                                    {i.name} - {i.description}
                                </Text>
                            </Card>
                        );
                    }) : null
                }
            </View>
        )
    }
})
