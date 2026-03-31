import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    create(createRoleDto: CreateRoleDto): Promise<{
        id: string;
        name: string;
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
    }>;
    update(id: string, updateRoleDto: UpdateRoleDto): Promise<{
        id: string;
        name: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
    }>;
}
