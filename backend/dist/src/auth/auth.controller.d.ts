import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        user: {
            id: string;
            name: string;
            role: {
                id: string;
                name: string;
            };
            email: string;
            roleId: string;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: string;
        };
    }>;
    refresh(refreshTokenDto: RefreshTokenDto): Promise<{
        accessToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: string;
        };
    }>;
    getProfile(req: any): Promise<any>;
}
