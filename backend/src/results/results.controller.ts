import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ResultsService } from './results.service';
import { CreateResultDto } from './dto/create-result.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('results')
@Controller('results')
export class ResultsController {
  constructor(private readonly resultsService: ResultsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Submit test result' })
  @ApiResponse({ status: 201, description: 'Test result submitted successfully' })
  create(@Body() createResultDto: CreateResultDto, @Request() req) {
    console.log('Creating result with DTO:', createResultDto);
    console.log('User from request:', req.user);
    return this.resultsService.create({
      ...createResultDto,
      userId: req.user.id,
    });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all results' })
  @ApiResponse({ status: 200, description: 'List of results' })
  findAll(@Request() req) {
    return this.resultsService.findAll(req.user.id, req.user.role);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get result by id' })
  @ApiResponse({ status: 200, description: 'Result found' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.resultsService.findById(id, req.user.id, req.user.role);
  }

  @Get('test/:testId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('TEACHER', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get results for a specific test' })
  @ApiResponse({ status: 200, description: 'Test results' })
  getTestResults(@Param('testId') testId: string, @Request() req) {
    return this.resultsService.getTestResults(testId, req.user.id, req.user.role);
  }
}
