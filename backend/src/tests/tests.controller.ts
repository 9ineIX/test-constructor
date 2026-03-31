import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TestsService } from './tests.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('tests')
@Controller('tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new test' })
  @ApiResponse({ status: 201, description: 'Test created successfully' })
  create(@Body() createTestDto: CreateTestDto, @Request() req) {
    return this.testsService.create({
      ...createTestDto,
      authorId: req.user.id,
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all tests' })
  @ApiResponse({ status: 200, description: 'List of tests' })
  findAll(@Request() req) {
    return this.testsService.findAll(req.user.id, req.user.role);
  }

  @Get('available')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('STUDENT')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get available tests for student' })
  @ApiResponse({ status: 200, description: 'Available tests for student' })
  getAvailableTests(@Request() req) {
    return this.testsService.getAvailableTestsForStudent(req.user.id);
  }

  @Get('completed')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('STUDENT')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get completed tests for student' })
  @ApiResponse({ status: 200, description: 'Completed tests for student' })
  getCompletedTests(@Request() req) {
    return this.testsService.getStudentCompletedTests(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get test by id' })
  @ApiResponse({ status: 200, description: 'Test found' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.testsService.findById(id, req.user.id, req.user.role);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update test' })
  @ApiResponse({ status: 200, description: 'Test updated successfully' })
  update(@Param('id') id: string, @Body() updateTestDto: UpdateTestDto, @Request() req) {
    return this.testsService.update(id, updateTestDto, req.user.id, req.user.role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete test' })
  @ApiResponse({ status: 200, description: 'Test deleted successfully' })
  remove(@Param('id') id: string, @Request() req) {
    return this.testsService.delete(id, req.user.id, req.user.role);
  }
}
