export interface ILogin {
    email: string;
    password: string;
    isRememberMe: boolean;
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
    token: string;
    password: string
}
