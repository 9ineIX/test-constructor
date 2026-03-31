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
exports.TestsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tests_service_1 = require("./tests.service");
const create_test_dto_1 = require("./dto/create-test.dto");
const update_test_dto_1 = require("./dto/update-test.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let TestsController = class TestsController {
    constructor(testsService) {
        this.testsService = testsService;
    }
    create(createTestDto, req) {
        return this.testsService.create({
            ...createTestDto,
            authorId: req.user.id,
        });
    }
    findAll(req) {
        return this.testsService.findAll(req.user.id, req.user.role);
    }
    getAvailableTests(req) {
        return this.testsService.getAvailableTestsForStudent(req.user.id);
    }
    getCompletedTests(req) {
        return this.testsService.getStudentCompletedTests(req.user.id);
    }
    findOne(id, req) {
        return this.testsService.findById(id, req.user.id, req.user.role);
    }
    update(id, updateTestDto, req) {
        return this.testsService.update(id, updateTestDto, req.user.id, req.user.role);
    }
    remove(id, req) {
        return this.testsService.delete(id, req.user.id, req.user.role);
    }
};
exports.TestsController = TestsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('TEACHER', 'ADMIN'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new test' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Test created successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_test_dto_1.CreateTestDto, Object]),
    __metadata("design:returntype", void 0)
], TestsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all tests' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of tests' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TestsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('available'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('STUDENT'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get available tests for student' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Available tests for student' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TestsController.prototype, "getAvailableTests", null);
__decorate([
    (0, common_1.Get)('completed'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('STUDENT'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get completed tests for student' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Completed tests for student' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TestsController.prototype, "getCompletedTests", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get test by id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Test found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TestsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('TEACHER', 'ADMIN'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update test' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Test updated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_test_dto_1.UpdateTestDto, Object]),
    __metadata("design:returntype", void 0)
], TestsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('TEACHER', 'ADMIN'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Delete test' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Test deleted successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TestsController.prototype, "remove", null);
exports.TestsController = TestsController = __decorate([
    (0, swagger_1.ApiTags)('tests'),
    (0, common_1.Controller)('tests'),
    __metadata("design:paramtypes", [tests_service_1.TestsService])
], TestsController);
//# sourceMappingURL=tests.controller.js.map