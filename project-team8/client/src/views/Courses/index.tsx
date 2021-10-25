import React, { useRef, useEffect, useState } from 'react';
import { View, Animated } from 'react-native';
import { Link, RouteComponentProps, Redirect } from "../../router";
import { Route, Switch } from "../../router";
import { observer } from 'mobx-react-lite';
import { ModulesView } from './Modules';
import { Schedule } from './Schedule';
import  { HomePage } from './HomePage';
import { Text } from "react-native-elements";


const AnimatedChild = ({ children, animating, anim, atParent} : any) => {
    const [state, setState] = useState({
        prevChild : null,
        prevAnimating : animating,
        prevAtParent : atParent
    });
    useEffect(() => {
        // nextProp not null
        console.log(atParent);
        const navigationToParent = state.prevAtParent && atParent;
        const animationEnded = state.prevAnimating && animating;
        if (navigationToParent) {
            setState({
                ...state,
                prevChild : children
            });
        } else if (animationEnded) {
            setState({
                ...state,
                prevChild : null
            });
        }
    }, [ children, animating, anim, atParent]);

    return (
        <Animated.View 
            style={{
                transform : [
                    {
                        translateX : anim
                    }
            ]}}
        >
            {/* render the old ones if we have them */}
            {state.prevChild}
            {children}
        </Animated.View>
    )
}

type CourseID = {
    id : string
}
export const Courses = observer (({ match, location } : RouteComponentProps<CourseID>) => {
    const [isAnim, setAnim] = useState(false)
    const [xVal, setVal] = useState(new Animated.Value(-100));
    
    useEffect(() => {
        setAnim(true);
        console.log('started');
        console.log(xVal);
        Animated.spring(xVal,
            {
              toValue: 0,
              delay : 100,
              useNativeDriver : true
            }
        ).start(() => {
            setAnim(false);
            console.log('end')
        })
    }, [location, xVal])

    return (
        <View>
            <Link to={`/course/${match.params.id}/home`}><Text> HomePage </Text></Link>
            <Link to={`/course/${match.params.id}/modules`}><Text> Modules </Text></Link>
            <Link to={`/course/${match.params.id}/schedule`}><Text> Schedule </Text></Link>
            <AnimatedChild animating={isAnim} anim={xVal} atParent={match.isExact}>
                <Switch location={location}>
                    <Route component={ModulesView} path={`/course/:id/modules`}/>
                    <Route component={Schedule} path={`/course/:id/schedule`}/>
                    <Route component={HomePage} path={`/course/:id`}/>
                </Switch>
            </AnimatedChild>
        </View>
    )
})




