import type { Error } from '../../services/client'
import { makeAutoObservable } from "mobx"
import { UiStore } from '../UI'
import { HTTPClient } from "../../services/httpclient"
import { makePersistable } from 'mobx-persist-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * @description Store handling User Authentication
 */
export class DeletePostStore {

    modalVisible : boolean = false;
    ui: UiStore;
    client: HTTPClient;

    constructor(ui : UiStore, client : HTTPClient) {
        makeAutoObservable(this);
        makePersistable(this, {
            name : "DeletePostStore",
            properties : ['modalVisible'],
            storage : AsyncStorage
        });
        this.ui = ui;
        this.client = client;
    }
}