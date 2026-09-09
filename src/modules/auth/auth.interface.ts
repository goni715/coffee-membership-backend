export interface ILogin {
    email: string;
    password: string;
    rememberMe: boolean;
}

export interface IVerifyOTp {
    email: string;
    otp: string;
}


export interface IChangePassword {
    currentPassword: string;
    newPassword: string;
}

export interface INewPassword {
    email: string;
    otp: string;
    password: string
}
