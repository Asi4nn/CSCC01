import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { AppContext } from '../../store/root';

export const ErrorPage = observer(() => {
    const appState = useContext(AppContext);
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text> Error Page {appState.ui.serverError}</Text>
        </View>
    )
});