import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'Role created successfully' })
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({ status: 200, description: 'List of all roles' })
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get role by id' })
  @ApiResponse({ status: 200, description: 'Role found' })
  findOne(@Param('id') id: string) {
    return this.rolesService.findById(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update role' })
  @ApiResponse({ status: 200, description: 'Role updated successfully' })
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete role' })
  @ApiResponse({ status: 200, description: 'Role deleted successfully' })
  remove(@Param('id') id: string) {
    return this.rolesService.delete(id);
  }
}
