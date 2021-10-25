import React, { useContext } from 'react';
import { StyleSheet, Text, View} from "react-native";
import { Link, useHistory } from "react-router-native";
import { AppContext } from '../store/root';
import { Button, Icon, Image } from 'react-native-elements';
import { observer } from 'mobx-react-lite';
const logo = require('../../assets/logo.png');
const styles = StyleSheet.create({
    nav: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: "rgb(249, 183, 77)"
    },
    authItem : {
      padding: 10,
      width : "30%",
      display: "flex",
      flexDirection: "row",
      justifyContent : 'flex-end',
      alignItems: 'center'
    },
    navItem : {
        padding: 10,
        display: "flex",
        flexDirection: "row",
        alignItems: 'center'
    }
});

export default observer(function Navbar() {
    const appState = useContext(AppContext);
    const history = useHistory();
    return (
        <View style={styles.nav}>
            <View style={styles.navItem}>
                <Link to="/" underlayColor="#f0f4f7">
                    <Image source={{uri : logo}} style={{ width: 100, height: 100, resizeMode : "contain" }}>
                    </Image>
                </Link>
                {appState.ui.isauth ? [
                    <Button
                        key='Homepage'
                        titleStyle={{ color : "black"}}
                        type="clear"
                        title="Homepage"
                        onPress={() => history.push(`/profile/${appState.auth.socials_link}`)}
                    />,
                    <Button
                        key='Browse'
                        titleStyle={{ color : "black"}}
                        type="clear"
                        title="Browse"
                        onPress={() => history.push("/profile/browse/search")}
                    />,
                    <Button
                        key='Courses'
                        titleStyle={{ color : "black"}}
                        type="clear"
                        title="Courses"
                        onPress={() => history.push("/courses")}
                    />
                ] : null}
            </View>

            {  appState.ui.isauth ? 
                <View style={styles.authItem}>
                    <Text>
                        Welcome: {appState.profile.firstname}
                    </Text>
                    <Button
                        icon={
                            <Icon
                                name="sign-out"
                                type='font-awesome'
                                size={15}
                                color="black"
                            />
                        }
                        titleStyle={{ color : "black"}}
                        type="clear"
                        title="Signout"
                        onPress={async () => {
                            const success = await appState.auth.logout();
                            if (success) {
                                history.push("/")
                            }
                        }}
                    />
                </View>
            :
            <View style={styles.authItem}>
                <Button
                    icon={
                        <Icon
                            name="sign-in"
                            type='font-awesome'
                            size={15}
                            color="black"
                        />
                    }
                    titleStyle={{ color : "black"}}
                    type="clear"
                    title="Login"
                    onPress={() => history.push("/auth/login")}
                />
                <Button
                        icon={
                            <Icon
                                name="user-plus"
                                type='font-awesome'
                                size={15}
                                color="black"
                            />
                        }
                        titleStyle={{ color : "black" }}
                        type="clear"
                        title="Get Started"
                        onPress={() => history.push("/auth/register")}
                />
            </View>
            }
        </View>
    )
})