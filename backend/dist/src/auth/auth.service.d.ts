import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { RolesService } from '../roles/roles.service';
export declare class AuthService {
    private usersService;
    private rolesService;
    private jwtService;
    private configService;
    constructor(usersService: UsersService, rolesService: RolesService, jwtService: JwtService, configService: ConfigService);
    register(data: {
        email: string;
        password: string;
        name?: string;
    }): Promise<{
        id: string;
        name: string;
        role: {
            id: string;
            name: string;
        };
        email: string;
        roleId: string;
    }>;
    login(email: string, password: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: string;
        };
    }>;
    refreshAccessToken(refreshToken: string): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: string;
        };
    }>;
    validateUser(email: string, password: string): Promise<any>;
}
