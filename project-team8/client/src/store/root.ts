import { UiStore } from './UI'
import { AuthStore } from './Auth'
import { createContext } from 'react'
import { HTTPClient } from '../services/httpclient'
import { ProfileStore } from './Profile';
import { CourseStore } from "./Course";
import { DeletePostStore } from './DeletePostMenu';

export class RootStore {

    ui: UiStore;
    auth : AuthStore;
    profile : ProfileStore;
    client : HTTPClient;
    courses : CourseStore;
    delete : DeletePostStore;

    constructor(client : HTTPClient) {
        this.client = client;
        this.ui= new UiStore()
        this.auth = new AuthStore(this.ui, this.client);
        this.profile = new ProfileStore(this.auth, this.ui, this.client);
        this.courses = new CourseStore(this.ui, this.client);
        this.delete = new DeletePostStore(this.ui, this.client);
    }
}
export const AppContext = createContext<RootStore>(undefined!);
