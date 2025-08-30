export interface User {
    id: string;

    username: string;
    email: string;

    loginProvider: LoginProvider;
}

export enum LoginProvider {
    GOOGLE = "google",
    EMAIL = "email",
    GITHUB = "github",
}
