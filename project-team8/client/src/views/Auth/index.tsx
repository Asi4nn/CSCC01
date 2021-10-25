import React, { useContext, useEffect } from 'react';
import { AppContext } from '../../store/root';
import type { RouteComponentProps } from "../../router";
import { useLocation, useHistory  } from "../../router";
import { Link } from "../../router";
import { Input, Text, CheckBox } from 'react-native-elements';
import { observer } from 'mobx-react-lite';
import { View, TouchableOpacity, StyleSheet } from "react-native";

type AuthMatch = {
    page : string
}

export const Auth = observer(({ match } : RouteComponentProps<AuthMatch>) => {
    const appState = useContext(AppContext);
    const location = useLocation();
    const history = useHistory();
    const page = match.params.page
    const login = page === "login";
    useEffect(() => { appState.ui.clearAuth()}, [location]);
    return (
        <View style={styles.container}>
            <br/>
            <Text style={styles.logo}>{login ? "Welcome to the African Impact Initiative" : "Sign Up"}</Text>
            { 
            login ? 
            <View style={styles.inputView}>
                <Input
                    placeholder='Email'
                    style={{width : "30%"}}
                    leftIcon={{ type: 'font-awesome', name: 'envelope' }}
                    errorStyle={{ color: 'red' }}
                    onChangeText={email => appState.auth.email = email }
                    errorMessage={appState.ui.auth.emailError}
                    placeholderTextColor="#003f5c"
                />
                <Input
                    placeholder='Password'
                    style={{width : "30%"}}
                    leftIcon={{ type: 'font-awesome', name: 'user' }}
                    errorStyle={{ color: 'red' }}
                    secureTextEntry={true}
                    onChangeText={pw => appState.auth.password = pw }
                    errorMessage={appState.ui.auth.passwordError}
                    placeholderTextColor="#003f5c"
                />
            </View>
            : 
            <View style={styles.inputView}>
                <Input
                    placeholder='Email'
                    leftIcon={{ type: 'font-awesome', name: 'envelope' }}
                    errorStyle={{ color: 'red' }}
                    onChangeText={email => appState.auth.email = email }
                    errorMessage={appState.ui.auth.emailError}
                    placeholderTextColor="#003f5c"
                />
                <Input
                    placeholder='Password'
                    leftIcon={{ type: 'font-awesome', name: 'user' }}
                    errorStyle={{ color: 'red' }}
                    secureTextEntry={true}
                    onChangeText={pw => appState.auth.password = pw }
                    errorMessage={appState.ui.auth.passwordError}
                    placeholderTextColor="#003f5c"
                />
                <Input
                    placeholder='Confirm password'
                    errorStyle={{ color: 'red' }}
                    leftIcon={{ type: 'font-awesome', name: 'check-circle' }}
                    onChangeText={pw => appState.auth.confirmPassword = pw }
                    secureTextEntry={true}
                />
                <Input
                    placeholder='First name'
                    errorStyle={{ color: 'red' }}
                    onChangeText= {first => appState.auth.firstname = first }
                    errorMessage={appState.ui.auth.firstnameError}
                />
                <Input
                    placeholder='Last name'
                    errorStyle={{ color: 'red' }}
                    onChangeText= {last => appState.auth.lastname = last }
                    errorMessage={appState.ui.auth.lastnameError}
                />
                <Input
                    placeholder='Company'
                    errorStyle={{ color: 'red' }}
                    leftIcon={{ type: 'font-awesome', name: 'building' }}
                    onChangeText= {company => appState.auth.company = company }
                    errorMessage={appState.ui.auth.companyError}
                />
                <View style={styles.userRadioView}>
                    <CheckBox  title='Entrepreneur' checkedIcon='dot-circle-o' uncheckedIcon='circle-o' 
                                checked={appState.auth.usertype === "ENTRE"} 
                                onPress={() => appState.auth.usertype = "ENTRE"}/>
                    <CheckBox  title='Instructor' checkedIcon='dot-circle-o' uncheckedIcon='circle-o' 
                                checked={appState.auth.usertype === "INSTR"}  
                                onPress={() => appState.auth.usertype = "INSTR"}/>
                    <CheckBox  title='Investor' checkedIcon='dot-circle-o' uncheckedIcon='circle-o' 
                                checked={appState.auth.usertype === "INVES"} 
                                onPress={() => appState.auth.usertype = "INVES"}/>      
                </View>
            </View>
            
            }

            <TouchableOpacity
                onPress={async () => {
                    appState.ui.clearAuth()
                    const success = login ? await appState.auth.login() : await appState.auth.signup();
                    if (success) {
                        history.push(`/profile/${appState.auth.socials_link}`)
                    }
                    console.log(success)
                }}
                style={styles.loginBtn}
            >
                <Text style={styles.loginText}>{login ? "Login" : "Sign Up"}</Text>
            </TouchableOpacity>
            
            <Text style={styles.forgot}>
                { login ? "Don't have an account? " : "Already have an account? " }
                <Link
                    to={`/auth/${login ? 'register' : 'login'}`}
                >
                    <Text style={styles.forgot}>
                        {login ? "Signup here." : "Login here."}
                    </Text>
                </Link>
            </Text>
        </View>
    )
})

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        backgroundColor: '#DDD8D8',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft : "20%",
        marginRight : "20%",
        marginTop : "1%",
        paddingBottom : "5%",
    },
    logo: {
        fontWeight:"bold",
        fontSize:32,
        color:"#000",
        marginBottom:50,
        alignItems: 'center'
    },

    inputView: {
        width: "30%"
    },

    userRadioView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    inputText: {
        height:50,
        color:"white"
    },

    loginBtn:{
        width:"30%",
        backgroundColor:"#000",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop:40,
        marginBottom:10
    },

    loginText: {
        color: "#fff",
        fontSize: 20
    },

    forgot:{
        color: "#000",
        fontSize: 11
    },
      
});