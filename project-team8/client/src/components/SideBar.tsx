import React, { useState, useEffect } from 'react';
import { StyleSheet, Animated, Text, View} from "react-native";
import { Link, useHistory } from "react-router-native";
import { AppContext } from '../store/root';
import { Button, Icon, Image } from 'react-native-elements';
import { observer } from 'mobx-react-lite';

const styles = StyleSheet.create({
    nav: {
        backgroundColor: '#c34a36',
        width : '250px',
        height: '100vh'
    },
    sidebarItem : {
        padding : '16px 24px'
    }
});


const AnimatedChild = ({ children, x, atParent, nextProps} : any) => {
    const [prevChild, setPrevChild] = useState(null);
    useEffect(() => {
        // nextProp not null
        if (nextProps) {
            const navigationToParent = nextProps.atParent && atParent;
            const animationEnded = animating && !nextProps.animating;
            if (navigationToParent) {
                setPrevChild(children);
            } else if (animationEnded) {
                setPrevChild(null);
            }
        }
    }, [nextProps])
    return (
        <Animated.View 
            style={{
            position: "absolute",
            left: 0,
            right: 0,
            transform : [
                {
                    translateX : 
                }
            ]
            }}
        >
            {/* render the old ones if we have them */}
            {prevChild}
            {children}
        </Animated.View>
    )
}



export default observer(function SideBar() {

    const [x, setX] = useState(new Animated.Value(-100));


    const slide = () => {

    }

    return (
        <View style={styles.nav}>
        </View>
    )
})