export type pageSizeNumber = 5 | 10 | 15 | 25 | 50;

export type AuthUi = {
    emailError : string | undefined,
    passwordError : string | undefined,
    companyError : string | undefined,
    usertypeError : string | undefined,
    firstnameError : string | undefined
    lastnameError : string | undefined
}


export type ProfileUi = {
    linkError : string | undefined
    descriptionError : string | undefined
    usernameError : string | undefined
}


export type CourseUi = {
    passwordError : string | undefined
}