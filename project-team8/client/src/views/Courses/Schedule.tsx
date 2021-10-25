import { observer } from "mobx-react-lite";
import React, {SyntheticEvent} from 'react';
import { StyleSheet, View } from 'react-native';
import { RouteComponentProps } from "../../router";

import ApiCalendar from 'react-google-calendar-api';


function handleItemClick(event: SyntheticEvent<any>, name: string): void {
        if (name === 'sign-in') {
            ApiCalendar.handleAuthClick();
        } else if (name === 'sign-out') {
            ApiCalendar.handleSignoutClick();
        }
}

export const Schedule = observer(() => {


      return (
          <View>
              <button
                  onClick={(e) => handleItemClick(e, 'sign-in')}
              >
                Sign-In
              </button>
              <button
                  onClick={(e) => handleItemClick(e, 'sign-out')}
              >
                Sign-Out
              </button>
          </View>
          );
})