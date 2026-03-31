import { Controller, Get, Post, Body, Param, Patch, Delete, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('questions')
@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new question' })
  @ApiResponse({ status: 201, description: 'Question created successfully' })
  create(@Body() createQuestionDto: CreateQuestionDto, @Request() req) {
    return this.questionsService.create(createQuestionDto, req.user.id, req.user.role);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all questions' })
  @ApiResponse({ status: 200, description: 'List of questions' })
  findAll(@Query('testId') testId?: string, @Request() req?: any) {
    return this.questionsService.findAll(testId);
  }

  @Get('types')
  @ApiOperation({ summary: 'Get question types' })
  @ApiResponse({ status: 200, description: 'List of question types' })
  getQuestionTypes() {
    return this.questionsService.getQuestionTypes();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get question by id' })
  @ApiResponse({ status: 200, description: 'Question found' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.questionsService.findById(id, req.user.id, req.user.role);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update question' })
  @ApiResponse({ status: 200, description: 'Question updated successfully' })
  update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto, @Request() req) {
    return this.questionsService.update(id, updateQuestionDto, req.user.id, req.user.role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete question' })
  @ApiResponse({ status: 200, description: 'Question deleted successfully' })
  remove(@Param('id') id: string, @Request() req) {
    return this.questionsService.delete(id, req.user.id, req.user.role);
  }
}
