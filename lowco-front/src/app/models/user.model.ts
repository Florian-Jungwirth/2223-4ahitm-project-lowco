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

export interface RegisterModel {
    id: string;
    metric: boolean;
}

export interface RegisterModelKeyCloak {
    email: string;
    firstname: string;
    lastname: string;
    username: string;
    password: string;
}