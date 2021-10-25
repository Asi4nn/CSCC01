import type { UserType } from '../Auth/auth'; 
export type UserData =  {
        id : number,
        email : string,
        first_name : string,
        last_name : string,
        company_name : string,
        user_type : UserType,
        socials_link : string
}

