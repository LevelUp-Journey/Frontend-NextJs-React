import { User } from "./user.entity";
import { UserResponse } from "./user.response";

export class UserAssembler {
    static toResponse(user: User): UserResponse {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            loginProvider: user.loginProvider,
        };
    }
}
