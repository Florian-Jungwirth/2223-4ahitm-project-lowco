export interface ProfileModel {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
    username: string;
}

export interface UserLogin {
    email: string;
    password: string;
}

export interface User {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    username: string;
    isAdmin: number;
    metrisch: number;
    quicks: Array<any>;
}