import type { UserType } from "./auth" 
import { makeAutoObservable } from "mobx"
import { UiStore } from '../UI'
import { HTTPClient } from "../../services/httpclient"
import { makePersistable } from 'mobx-persist-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * @description Store handling User Authentication
 */
export class AuthStore {

    email : string = ''
    password : string = ''
    confirmPassword : string = ''
    socials_link : string = ''
    company : string = ''
    firstname : string = ''
    lastname : string = ''
    usertype : UserType = 'ENTRE'
    ui : UiStore;
    client : HTTPClient;

    constructor(ui : UiStore, client : HTTPClient) {
        makeAutoObservable(this);
        makePersistable(this, {
            name : "AuthStore",
            properties : ['email', 'password', 'confirmPassword', 'company', 'firstname', 'lastname', 'usertype', 'socials_link'],
            storage : AsyncStorage
        });
        this.ui = ui;
        this.client = client;
    }

    async login() : Promise<Boolean> {
        const { email, password, non_field_errors, token, 
                first_name = '', last_name = '',
                company_name = '', user_type = 'ENTRE',
                socials_link = '' } = await this.client.login(this.email, this.password);
        if (email) {
            this.ui.auth.emailError = email[0];
        }
        if (password) {
            this.ui.auth.passwordError  = password[0];
        }
        if (non_field_errors) {
            this.ui.auth.passwordError  = non_field_errors[0];
        }
        if (token) {
            console.log('login')
            this.ui.isauth = true;      
            // token being generated gurantee login success implying user info will also be passed 
            this.socials_link = socials_link; 
            this.company = company_name;
            this.firstname = first_name;
            this.lastname = last_name;
            this.usertype = user_type;
            return true
        }
        return false;
    }


    async signup() : Promise<Boolean> {

        if (this.password !== this.confirmPassword) {
            this.ui.auth.passwordError = "passwords do not match"
            return false;
        }
        const res = await this.client.signup(this.email, this.password, this.firstname, this.lastname, this.company, this.usertype);
        if (Array.isArray(res.email)) {
            this.ui.auth.emailError = res.email[0];
        }
        if (Array.isArray(res.password)) {
            this.ui.auth.passwordError  = res.password[0];
        }
        if (Array.isArray(res.first_name)) {
            this.ui.auth.firstnameError  = res.first_name[0];
        }
        if (Array.isArray(res.last_name)) {
            this.ui.auth.lastnameError  = res.last_name[0];
        }
        if (Array.isArray(res.company_name)) {
            this.ui.auth.companyError  = res.company_name[0];
        }

        if (res.token && res.socials_link) {
            this.socials_link = res.socials_link;
            console.log('signup')
            this.ui.isauth = true;
            return true
        }
        return false;
    }


    async logout() : Promise<Boolean> {
        const res = await this.client.logout();
        if (typeof res !== "undefined") {
            return false;
        }
        this.ui.isauth = false;
        this.reset();
        return true;
    }


    reset() {
        this.email  = '';
        this.password = '';
        this.confirmPassword  = '';
        this.socials_link = '';
        this.company = '';
        this.firstname = '';
        this.lastname  = '';
        this.usertype = 'ENTRE';
    }

}