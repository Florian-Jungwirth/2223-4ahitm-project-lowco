export class CreateUserDto {
    firstname: string;
    lastname: string;
    email: string;
    username: string;
    password: string;
    isAdmin: number;
    metrisch: number;
    quicks: Array<any>;
}
