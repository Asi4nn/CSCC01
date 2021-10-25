import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useContext } from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import { Card, Button, Input, CheckBox } from "react-native-elements";
import { RouteComponentProps, useHistory } from "react-router-dom";
import ModuleItemEditComponent from "../../components/ModuleItemEditComponent";
import ModuleItemViewComponent from "../../components/ModuleItemViewComponent";
import { AppContext } from "../../store/root";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    sidebar: {
        flex: 3,
        flexDirection: 'column',
        marginTop: "1em",
        marginLeft: "1em",
    },
    maintab: {
        flex: 7,
    },
    inputView: {
        width: "50%",
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: "2em",
    },
    userRadioView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

type ModuleID = {
    mid : string
}

export const ModuleDetails = observer(({ match } : RouteComponentProps<ModuleID>) => {
    const appState = useContext(AppContext);
    const history = useHistory();
    useEffect(() => {
        appState.courses.moduleID = parseInt(match.params.mid);
        appState.courses.getCourse();
    }, [])
    const moduleData = appState.courses.getModuleData();

    return (
        <View style={styles.container}>

            <View style={styles.sidebar}>
                { appState.courses.isInCourse && appState.profile.usertype === "INSTR" ? 
                    <View style={styles.inputView}>
                        <Text> Create a Module Item</Text>
                        <Input
                            placeholder='Name'
                            errorStyle={{ color: 'red' }}
                            onChangeText={name => appState.courses.moduleItemName = name }
                            placeholderTextColor="#003f5c"
                        />
                        <Input
                            placeholder='Date'
                            errorStyle={{ color: 'red' }}
                            onChangeText={date => appState.courses.moduleItemDate = date }
                            placeholderTextColor="#003f5c"
                        />
                        <Input
                            placeholder='Notes link'
                            errorStyle={{ color: 'red' }}
                            onChangeText={notes => appState.courses.moduleItemNotes = notes }
                            placeholderTextColor="#003f5c"
                        />

                        { appState.courses.moduleItemType === "LEC" ?
                            <Input
                                placeholder='Video link'
                                errorStyle={{ color: 'red' }}
                                onChangeText={video => appState.courses.moduleItemVideo = video }
                                placeholderTextColor="#003f5c"
                            /> : null
                        }
                        <View style={styles.userRadioView}>
                            <CheckBox  title='Assignment' checkedIcon='dot-circle-o' uncheckedIcon='circle-o' 
                                        checked={appState.courses.moduleItemType === "ASN"} 
                                        onPress={() => appState.courses.moduleItemType = "ASN"}/>
                            <CheckBox  title='Lecture' checkedIcon='dot-circle-o' uncheckedIcon='circle-o' 
                                        checked={appState.courses.moduleItemType === "LEC"}  
                                        onPress={() => appState.courses.moduleItemType = "LEC"}/>   
                        </View>

                        <Button onPress={async () => {
                            await appState.courses.createModuleItem();
                            await appState.courses.getCourse();
                        }} title="Create Module Item"/>
                    </View> : null
                }

                <Card>
                    <Card.Title>{moduleData?.name}</Card.Title>
                    <Text>
                        { moduleData?.description }
                    </Text>
                    <Card.FeaturedSubtitle>{moduleData?.name}</Card.FeaturedSubtitle>
                    <Card.Divider/>
                    <FlatList
                        data={moduleData?.items}
                        keyExtractor={(item) => `${item.id}`}
                        renderItem={({item}) => {
                            return(
                                <Button
                                    title={item.name}
                                    onPress={() => {appState.courses.tabID = item.id}}
                                >
                                </Button>
                            )
                        }}
                    />
                </Card>
            </View>

            <View style={styles.maintab}>
                { appState.profile.usertype === "INSTR" ?   
                    <ModuleItemEditComponent/>
                :
                    <ModuleItemViewComponent/>
                }
            </View>
        </View>
    )
})