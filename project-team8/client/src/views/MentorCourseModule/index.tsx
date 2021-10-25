import React, {useContext} from 'react';
import {AppContext} from '../../store/root';
import ModuleItemEditComponent from '../../components/ModuleItemEditComponent';
import {View, StyleSheet} from 'react-native';
import {Card, Button} from 'react-native-elements';

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

export default function MentorCourseModule() {
    const appState = useContext(AppContext);
    const courseData = appState.courses.getCourse();
    const moduleData = appState.courses.getModuleData();
    return (
        <View style={styles.container}>
            <View style={styles.sidebar}>
                {/* <Card>
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
                                    onPress={() => {appState.class.setTabID(item.id)}}
                                >
                                </Button>
                            )
                        }}
                    />
                    </Card> */}
               
            </View>

            <View style={styles.maintab}>
                <ModuleItemEditComponent/>
            </View>
        </View>
    )
    
}
