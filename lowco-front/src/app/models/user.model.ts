export interface ProfileModel {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    username: string;
}

export interface UserLoginModel {
    email: string;
    password: string;
}

export interface UserModel {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    username: string;
    isAdmin: boolean;
    metric: boolean;
}
