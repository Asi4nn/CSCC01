import { UserData } from "../Profile/profile"
export type CourseData = {
    id : number,
    course_name : string,
    course_code : string,
    enrolled_students : UserData[],
    year : number,
    semester : string,
    modules : ModuleData[],
    professor : UserData
}

export type ModuleData = {
    id : number,
    name : string,
    description : string,
    items : ModuleItemData[],
}

export type ModuleItemData = {
    id : number,
    name : string,
    type : ModuleItemType,
    date : Date,
    lecture : LectureData,
    assignment : AssignmentData
}

export type LectureData = {
    video : string,
    notes : string
}

export type AssignmentData = {
    notes : string,
    mark_visible : boolean,
    marks : MarkData[]
}

export type MarkData = {
    student : StudentData,
    mark : number
}

export type StudentData = {
    id : number,
    first_name : string,
    last_name : string
}

export type ModuleItemType = "ASN" | "LEC";

