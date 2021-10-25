import { makeAutoObservable } from "mobx";
import { HTTPClient, isError } from "../../services/httpclient";
import { UiStore } from "../UI";
import type { UserData } from "./profile" 
import type { UserType } from "../Auth/auth" 
import { AuthStore } from "../Auth";
import { pageSizeNumber } from "../UI/ui";
import { makePersistable } from "mobx-persist-store";
import AsyncStorage from "@react-native-async-storage/async-storage";


/**
 * @description Store handling User Profile and Users Profile Table 
 */
export class ProfileStore {
    ui : UiStore;
    auth : AuthStore;
    client : HTTPClient;
    followerid : number[] = []
    followingid : number[] = []
    data : UserData[] = [];
    description : string = '';
    socials_link : string = '';
    username : string = '';
    company : string = '';
    firstname : string = '';
    lastname : string = '';
    usertype : UserType = 'ENTRE';
    email : string = '';
    edit : boolean = false;
    isHomePage : boolean = true;
    isFollowing : boolean = false;
    isFollower : boolean = false;
    count : number = 0;
    page : number = 0;
    from : number = 0;
    to : number = 0;
    id : number = 0;
    pageSize : pageSizeNumber = 5;
    options = [5, 10, 15, 25, 50];


    constructor(auth : AuthStore, ui : UiStore, client : HTTPClient) {
        makeAutoObservable(this)
        makePersistable(this, {
            name : "ProfileStore",
            properties : ['id', 'data', 
                          'description', 'socials_link', 
                          'username', 'company', 
                          'firstname', 'lastname', 
                          'usertype', 'email', 
                          'edit', 'isHomePage',
                           'followerid', 'followingid'],
            storage : AsyncStorage
        });
        this.auth = auth;
        this.client = client;
        this.ui = ui;
    }

    toggleEdit() {
        this.edit = !this.edit;
    }

    setPage(page : number) {
        this.page = page;
        this.from = this.page * this.pageSize;
        this.to = Math.min((this.page + 1) * this.pageSize, this.count);
    }

    async getUsers() {
        const res = await this.client.getUserAccounts(this.page + 1, this.pageSize);
        console.log(res);
        if (!isError(res)) {
            this.count = res.count;
            this.data = res.results;
        }    
    }

    async getUserProfile( socials_link : string ) : Promise<boolean> {
        this.socials_link = socials_link;
        this.isHomePage = this.socials_link === this.auth.socials_link;
        if (!this.isHomePage) {
            this.edit = false;
        }
        const profile = await this.client.getUserProfile(this.socials_link);
        if (isError(profile)) {
            this.ui.serverError = profile.detail;
            return false;
        }
        this.description = profile.description;
        this.username = !Array.isArray(profile.username)  ? profile.username : '';
        this.socials_link = profile.socials_link !== null && !Array.isArray(profile.socials_link) ?  profile.socials_link : '';
        this.email = profile.email;
        this.company = profile.company_name;
        this.firstname = profile.first_name;
        this.lastname = profile.last_name;
        this.usertype = profile.user_type;
        this.id = profile.id;
        return true;
    }

    async updateUserProfile() : Promise<boolean> {
        const update = await this.client.updateProfile(this.description, this.auth.socials_link, this.socials_link, this.username);
        if (isError(update)) {
            this.ui.serverError = update.detail;
            return false;
        }
        var error = false;
        if (Array.isArray(update.socials_link)) {
            this.ui.profile.linkError = update.socials_link[0];
            error = true;
        } else {
            this.socials_link = update.socials_link !== null ? update.socials_link : '';
            this.auth.socials_link = this.socials_link;
        }
        if (Array.isArray(update.username)) {
            this.ui.profile.usernameError = update.username[0];
            error = true;
        } else {
            this.username = update.username;
        }
        if (error) {
            return false;
        }
        this.description = update.description;
        return true;
        
    }


    async followUser() : Promise<boolean> {
        const res = await this.client.addToNetwork(this.socials_link);
        if (isError(res)) {
            this.ui.serverError = res.detail;
            return false;
        }
        this.isFollowing = true;
        return true;
    }

    async unfollowUser() : Promise<boolean> {
        const res = await this.client.removeFromNetwork(this.socials_link);
        if (isError(res)) {
            this.ui.serverError = res.detail;
            return false;
        }
        this.isFollowing = false;
        return true;
    }

    async getUserNetwork() {
        const res = await this.client.getNetwork();
        if (isError(res)) {
            this.ui.serverError = res.detail;
            return false;
        }
        const followerid = res.follower.map( f =>  f.user_id );
        const followingid = res.following.map( f => f.following_user_id );
        if (!this.isHomePage) {
            this.isFollower = followerid.includes(this.id);
            this.isFollowing = followingid.includes(this.id);
        } else {
            this.isFollower = false;
            this.isFollowing = false;
        }
        return true;
    }

    async createAPost() {
        const res = await this.client.createAPost();
    }

}