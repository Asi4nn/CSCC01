import React from 'react';
import { View } from 'react-native';
import type { RouteComponentProps } from "../../router";
import { Route, Switch } from "../../router";
import { observer } from 'mobx-react-lite';
import { HomeScreen } from './HomeScreen';
import { Browse } from './Browse';

export const Profile = observer (({ match } : RouteComponentProps) => {

    return (
        <View>
            <Switch>
                <Route component={Browse} path={`${match.url}/browse/search`}/>
                <Route component={HomeScreen} path={`${match.url}/:socials_link`}/>
            </Switch>
        </View>
    )
})




