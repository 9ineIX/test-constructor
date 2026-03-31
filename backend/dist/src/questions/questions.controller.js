"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const questions_service_1 = require("./questions.service");
const create_question_dto_1 = require("./dto/create-question.dto");
const update_question_dto_1 = require("./dto/update-question.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let QuestionsController = class QuestionsController {
    constructor(questionsService) {
        this.questionsService = questionsService;
    }
    create(createQuestionDto, req) {
        return this.questionsService.create(createQuestionDto, req.user.id, req.user.role);
    }
    findAll(testId, req) {
        return this.questionsService.findAll(testId);
    }
    getQuestionTypes() {
        return this.questionsService.getQuestionTypes();
    }
    findOne(id, req) {
        return this.questionsService.findById(id, req.user.id, req.user.role);
    }
    update(id, updateQuestionDto, req) {
        return this.questionsService.update(id, updateQuestionDto, req.user.id, req.user.role);
    }
    remove(id, req) {
        return this.questionsService.delete(id, req.user.id, req.user.role);
    }
};
exports.QuestionsController = QuestionsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('TEACHER', 'ADMIN'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new question' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Question created successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_question_dto_1.CreateQuestionDto, Object]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all questions' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of questions' }),
    __param(0, (0, common_1.Query)('testId')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('types'),
    (0, swagger_1.ApiOperation)({ summary: 'Get question types' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of question types' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "getQuestionTypes", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get question by id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Question found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('TEACHER', 'ADMIN'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update question' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Question updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_question_dto_1.UpdateQuestionDto, Object]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('TEACHER', 'ADMIN'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete question' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Question deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], QuestionsController.prototype, "remove", null);
exports.QuestionsController = QuestionsController = __decorate([
    (0, swagger_1.ApiTags)('questions'),
    (0, common_1.Controller)('questions'),
    __metadata("design:paramtypes", [questions_service_1.QuestionsService])
], QuestionsController);
//# sourceMappingURL=questions.controller.js.map