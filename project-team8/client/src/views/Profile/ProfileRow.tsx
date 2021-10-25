import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Linking } from 'react-native'
import { Icon, Divider } from 'react-native-elements'
import { AppContext } from '../../store/root'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 25,
  },
  emailNameColumn: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  emailNameText: {
    color: 'gray',
    fontSize: 14,
    fontWeight: '200',
  },
  emailRow: {
    flex: 8,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  rowText: {
    fontSize: 16,
  },
})

const ProfileRow = observer(() => {
  const appState = useContext(AppContext);
  const onPressEmail = (mail : string) => {
    Linking.openURL(`mailto://${mail}?subject=subject&body=body`).catch(err =>
      console.log(err)
    )
  }
  var usericon = 'black-tie';
  var label;
  if (appState.profile.usertype === "ENTRE") {
    usericon = 'black-tie';
    label = 'Entrepreneur';
  } else if (appState.profile.usertype === "INSTR") { 
    usericon = 'graduation-cap'
    label = 'Instructor'
  } else {
    usericon = 'money'
    label = 'Investor'
  }
  return (
      <View style={styles.container}>
          <TouchableOpacity onPress={() => onPressEmail(appState.profile.email)}>
            <Icon
                name="email"
                underlayColor="transparent"
            />
          </TouchableOpacity>
          <Text style={styles.rowText}>{appState.profile.email}</Text>
          <Icon
              name="building"
              type='font-awesome'
              underlayColor="transparent"
          />
          <Text style={styles.rowText}>{appState.profile.company}</Text>
          <Icon
            name={usericon}
            type='font-awesome'
            underlayColor="transparent"
          />
          <Text style={styles.rowText}>{label}</Text>
      </View>
  )
})


export default ProfileRow
