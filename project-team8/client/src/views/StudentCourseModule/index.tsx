import React, {useContext} from 'react';
import {AppContext} from '../../store/root';
import {StyleSheet, View, FlatList} from 'react-native';
import {Card, Button} from 'react-native-elements';
import ModuleItemViewComponent from '../../components/ModuleItemViewComponent';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    sidebar: {
        flex: 3,
        flexDirection: 'column',
    },
    maintab: {
        flex: 7,
    },
});

export default function StudentCourseModule() {
    const appState = useContext(AppContext);
    const courseData = appState.courses.course;
    const moduleData = appState.courses.getModuleData();

    if (courseData !== null && moduleData !== null) {
        return (
            <View style={styles.container}>
                <View style={styles.sidebar}>
                    {/*
                        <Card>
                            <Card.Title>{courseData.course_code}: {courseData.course_name}</Card.Title>
                            <Card.FeaturedSubtitle>{moduleData.name}</Card.FeaturedSubtitle> 
                            <Card.Divider/>
                            <FlatList
                                data={moduleData.items}
                                keyExtractor={(item) => `${item.id}`}
                                renderItem={({item}) => {
                                    return(
                                        <Button
                                            title={item.name}
                                            onPress={() => {appState.courses.setTabID(item.id)}}
                                        >
                                        </Button>
                                    )
                                }}
                            />
                        </Card>
                    */}
                </View>
    
                <View style={styles.maintab}>
                    <ModuleItemViewComponent/>
                </View>
            </View>
        )
    }
}
