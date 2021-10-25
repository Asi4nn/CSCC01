import axios from 'axios'
import url from '../config/urls'
import type { UserType } from '../store/Auth/auth'
import type { pageSizeNumber } from '../store/UI/ui';
import type { LoginRes, SignUpRes, Error, AccountRes, UserProfileRes, CourseRes, FollowRes, MessageRes} from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AssignmentData, CourseData, MarkData, ModuleItemData, ModuleItemType } from '../store/Course/course';


export function isError(profile: UserProfileRes | AccountRes | SignUpRes | LoginRes | CourseRes | CourseRes[] | FollowRes | MessageRes | Error): profile is Error {
    return (profile as Error).detail !== undefined;
}

export class HTTPClient {

    constructor() {
        axios.interceptors.request.use(async function (config) {
            const token = await AsyncStorage.getItem("token");
            config.headers.Authorization =  token;
            return config;
        });
    }

    async getUserAccounts(page : number, pagesize : pageSizeNumber) : Promise<AccountRes | Error>{
        try {
            const res = await axios.get(`${url}/api/users/`, {
                params : {
                    page,
                    pagesize
                }
            });
            return res.data;
        } catch (error) {
            return error.response.data;
        }
    }

    async getUserProfile( userid : string ) : Promise<UserProfileRes | Error> {
        try {
            const res = await axios.get(`${url}/api/profile/${userid}/`)
            return res.data;
        } catch (error) {
            return error.response.data;
        }
    }


    async updateProfile( description : string, original_link : string, socials_link : string, username : string) : Promise<UserProfileRes | Error> {
        try {
            const res = await axios.put(`${url}/api/profile/${original_link}/`,
                {
                    username,
                    socials_link,
                    description
                }
            )
            return res.data;
        } catch (error) {
            return error.response.data;
        }
    }

    async login(email : string, password : string) : Promise<LoginRes> {
        try {
            // django calls its user primary identifier username so we have to pass email as username
            const res = await axios.post(`${url}/api/auth/login/`, {
                username : email,
                password 
            });
            AsyncStorage.setItem("token", `Token ${res.data.token}`);
            return res.data
        } catch (error) {
            return error.response.data;
        }
    }

    async signup (email : string, password : string, first_name : string, last_name : string, company_name: string, user_type : UserType) : Promise<SignUpRes> {
        try {
            const res = await axios.post(`${url}/api/auth/register/`, {
                email,
                username : email,
                password,
                first_name,
                last_name,
                company_name,
                user_type
            });
            AsyncStorage.setItem("token", `Token ${res.data.token}`);
            return res.data;

        } catch (error) {
            return error.response.data;
        }
    }


    async logout () : Promise<Error | void> {
        try {
            await axios.get(`${url}/api/auth/logout/`)
            AsyncStorage.removeItem("token");
        } catch (error) {
            return error.response.data;
        }
    }


    async createAPost () : Promise<any> {
        try {
            return await axios.post(`${url}/api/user/post/create/`, {
                content : 'content'
            })
        } catch (error) {
            return error.response.data;
        }
    }


    async getEnrolledCourses() : Promise<CourseRes[] | Error> {
        try {
            const res = await axios.get(`${url}/api/course/`);
            return res.data;
        } catch (error) {
            return error.response.data;
        }
    }


    async getAllCourses() : Promise<CourseRes[] | Error> {
        try {
            const res = await axios.get(`${url}/api/course/browse/`);
            return res.data;
        } catch (error) {
            return error.response.data;
        }
    }


    async getCourseData (id : number) : Promise<CourseData> {
        try {
            const res = await axios.get(`${url}/api/course/${id}/`);
            return res.data;
        } catch (error) {
            return error.response.data;
        }
    }


    async enrollStudent(courseID : number, password : string) {
        try {
            return await axios.post(`${url}/api/course/${courseID}/enroll/`, {
                password
            });
        } catch (error) {
            return error.response.data;
        }
    }

    async unenrollStudent(courseID : number) {
        try {
            return await axios.delete(`${url}/api/course/${courseID}/unenroll/`);
        } catch (error) {
            return error.response.data;
        }
    }

    async getMarkData (course_id : number, module_id : number, item_id : number) : Promise<MarkData | AssignmentData> {
        try {
            return await axios.get(`${url}/api/course/${course_id}/module/${module_id}/${item_id}/mark/`)
        } catch (error) {
            return error.response.data;
        }
    }

    async createModule (course_id : number, name : string, description : string) {
        try {
            return await axios.post(`${url}/api/course/${course_id}/module/create/`, {
                name : name,
                description : description
            })
        } catch (error) {
            return error.response.data;
        }
    }

    async createModuleItem (course_id : number, module_id : number, type : ModuleItemType, name : string, notes : string, date : string, video : string | undefined) {
        try {
            let res;
            if (type === "ASN") {
                res = await axios.post(`${url}/api/course/${course_id}/module/${module_id}/create/`, {
                    type,
                    name,
                    assignment : {
                        notes
                    },
                    date
                })
            }
            else if (type === "LEC") {
                res = await axios.post(`${url}/api/course/${course_id}/module/${module_id}/create/`, {
                    type,
                    name,
                    lecture : {
                        video,
                        notes
                    },
                    date
                })
            }
            return res?.data;
        } catch (error) {
            console.log(error.response.data)
            return error.response.data;
        }
    }

    async patchAssignmentMark (course_id : number, module_id : number, item_id : number, marks : MarkData[], mark_visible : boolean) {
        try {
            let mark_list : any = [];
            marks.forEach((mark) => {
                mark_list.push({
                    student : {
                        first_name : mark.student.first_name,
                        last_name : mark.student.last_name,
                        id : mark.student.id
                    },
                    mark : mark.mark
                });
            })

            return await axios.patch(`${url}/api/course/${course_id}/module/${module_id}/${item_id}/edit/`, {
                marks : mark_list,
                mark_visible : mark_visible
            })
        } catch (error) {
            return error.response.data;
        }
    }


    async addToNetwork(socials_link : string) : Promise<MessageRes | Error>{
        try {
            const res = await axios.post(`${url}/api/user/network/${socials_link}/`);
            return res.data;
        } catch (error) {
            return error.response.data;
        }
    }

    async removeFromNetwork(socials_link : string) : Promise<MessageRes | Error>{
        try {
            const res = await axios.delete(`${url}/api/user/network/${socials_link}/`);
            return res.data;
        } catch (error) {
            return error.response.data;
        }
    }

    async getNetwork() : Promise<FollowRes | Error> {
        try {
            const res = await axios.get(`${url}/api/user/network/`);
            return res.data;
        } catch (error) {
            return error.response.data;
        }

    }

}