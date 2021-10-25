import AsyncStorage from "@react-native-async-storage/async-storage"
import { makeAutoObservable } from "mobx"
import { makePersistable } from "mobx-persist-store"
import { HTTPClient, isError } from "../../services/httpclient";
import { AppContext } from "../root";
import { UiStore } from "../UI";
import { CourseData, MarkData, ModuleData, ModuleItemData, ModuleItemType } from "./course";
import { CourseRes } from '../../services/client';


/**
 * @description Store handling User Profile and Users Profile Table
 */
export class CourseStore {
    modalVisible : boolean = false;
    isInCourse : boolean = false;
    ui : UiStore;
    client : HTTPClient;
    courseID : number = 0;
    moduleID : number = 0;
    tabID : number = 0;
    courseTab : number = 0;
    username : string = '';
    course : CourseData  = {
        id : 0,
        course_name : '',
        course_code : '',
        calendar_link: '',
        enrolled_students : [],
        year : 0,
        semester : '',
        modules : [],
        professor : {
            id : 0,
            email : '',
            first_name : '', 
            last_name : '', 
            company_name : '', 
            socials_link : '',
            user_type : 'INSTR'
        }
    };
    allCourses : CourseRes[] = [];
    enrolledCourses : CourseRes[] = [];
    password : string = '';
    markData : MarkData = {student: {id: 0, first_name: "", last_name: ""}, mark: 0};
    moduleName : string = "";
    moduleDesc : string = "";
    passwordError : string = '';
    moduleItemType : ModuleItemType = "ASN";
    moduleItemName : string = "";
    moduleItemNotes : string = "";
    moduleItemVideo : string = "";
    moduleItemDate : string = "";

    constructor(ui : UiStore, client : HTTPClient) {
        makeAutoObservable(this);
        makePersistable(this, {
            name : "ClassStore",
            properties : ['modalVisible', 'courseID', 
                           'moduleID', 'tabID', 'courseTab', 'username', 
                           'course', 'allCourses', 'enrolledCourses', 'isInCourse'],
            storage : AsyncStorage
        });
        this.ui = ui;
        this.client = client;
    }

    setCourseTab(value : number) {
        this.courseTab = value;
    }

    async getAllCourses() : Promise<boolean> {
        const res = await this.client.getAllCourses();
        if (isError(res)) {
            this.ui.serverError = res.detail;
            return false;
        } else {
            this.allCourses = res;
            return true;
        }
    }

    async getEnrolledCourses() : Promise<boolean> {
        const res = await this.client.getEnrolledCourses();
        if (isError(res)) {
            this.ui.serverError = res.detail;
            return false;
        } else {
            this.enrolledCourses = res;
            return true;
        }
    }

    setCourseID(id : number) {
        this.courseID = id;
    }

    async getCourse() : Promise<boolean> {
        const res = await this.client.getCourseData(this.courseID);
        console.log('courses');
        console.log(res);
        if (isError(res)) {
            this.ui.serverError = res.detail;
            return false;
        } else {
            this.isInCourse = this.enrolledCourses.findIndex( course => course.id === res.id) !== -1;
            this.course = res;
            return true;
        }
    }

    async createModule() : Promise<boolean> {
        const res = await this.client.createModule(this.courseID, this.moduleName, this.moduleDesc);
        if (isError(res)) {
            this.ui.serverError = res.detail;
            return false;
        } else {
            return true;
        }
    }

    async enrollStudent() {
        const res = await this.client.enrollStudent(this.courseID, this.password);
        console.log(res);
        // wrong password error
        if (Array.isArray(res.password)) {
            this.ui.course.passwordError = res.password[0];
        } else {
            this.isInCourse = true;
        }
    }

    async unenrollStudent() {
        const res = await this.client.unenrollStudent(this.courseID);
        console.log(res);
        this.isInCourse = false;
    }

    setModuleID(id : number) {
        this.moduleID = id;
    }

    getModuleData() : ModuleData | undefined {
        return this.course.modules.find( module => module.id == this.moduleID);
    }

    setTabID(id : number) {
        this.tabID = id;
    }

    getModuleItemData() : ModuleItemData | undefined {
        const module = this.getModuleData();
        return module?.items.find((item) => item.id === this.tabID);
    }

    async createModuleItem() : Promise<boolean> {
        const res = await this.client.createModuleItem(this.courseID, this.moduleID, this.moduleItemType, this.moduleItemName, 
                                                        this.moduleItemNotes, this.moduleItemDate, this.moduleItemVideo);
        if (isError(res)) {
            this.ui.serverError = res.detail;
            return false;
        } else {
            return true;
        }
    }

    async sendMarkGetRequest() {
        const res = await this.client.getMarkData(this.courseID, this.moduleID, this.tabID);
        //this.markData = res;
    }

    getMarkData() : MarkData | null {
        return this.markData;
    }

}