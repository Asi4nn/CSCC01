import type { AuthUi, ProfileUi, CourseUi } from "./ui"; 
import { makeAutoObservable } from "mobx"
import { makePersistable } from "mobx-persist-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * @description Store responsible for how UI is render 
 *              use this for any state that is not stored in the backend
 */
export class UiStore {

    isauth : boolean = false;
    // ui state for auth page
    auth : AuthUi = {
        emailError : undefined,
        passwordError : undefined,
        companyError : undefined,
        usertypeError : undefined,
        firstnameError : undefined,
        lastnameError : undefined
    };
    profile : ProfileUi = {
        linkError : undefined,
        descriptionError : undefined,
        usernameError : undefined
    }
    serverError : string = '';

    course : CourseUi = {
        passwordError : undefined
    }

    constructor() {
        makeAutoObservable(this);
        makePersistable(this, {
            name : "UiStore",
            properties : ['auth', 'profile', 'isauth'],
            storage : AsyncStorage
        });
    }

    clearProfile() {
        this.profile = {
            linkError : undefined,
            descriptionError : undefined,
            usernameError : undefined
        }
    }
    clearAuth() {
        this.auth = {
            emailError : undefined,
            passwordError : undefined,
            companyError : undefined,
            usertypeError : undefined,
            firstnameError : undefined,
            lastnameError : undefined
        };
    }
}