import { UserType } from "../store/Auth/auth";
import { UserData } from "../store/Profile/profile";

export type LoginRes = {
    email? : [string]
    password? : [string]
    non_field_errors? : [string]
    company_name? : string
    first_name? : string
    last_name? : string
    socials_link? : string
    user_type? : UserType
    token? : string
}

export type SignUpRes = {
    email? : [string] | string
    password? : [string] | string
    username? : [string] | string
    first_name? : [string] | string
    last_name? : [string] | string
    company_name? : [string] | string
    user_type? : [string] | string
    socials_link? : string
    token? : string
}

export type Error = {  
    detail : string
}


export type AccountRes = {
    count : number,
    next : string | null,
    previous : string | null,
    results : UserData[]
}


export type UserProfileRes = {
    id : number,
    email : string,
    first_name : string,
    last_name : string,
    user_type : UserType,
    company_name : string,
    description : string,
    socials_link : string | [string] | null,
    username : string | [string]
}

type Following = {
    id : number,
    following_user_id : number,
    created : string
}

type Follower = {
    id : number,
    user_id : number,
    created : string
}

export type FollowRes = {
    follower : Follower[],
    following  : Following[]
}

export type MessageRes = {
    message : string
}

export type CourseRes = {
    id : number,
    course_code: string,
    course_name: string,
    enrolled_students: UserData[],
    year: number
    semester : string,
    professor : UserData
}