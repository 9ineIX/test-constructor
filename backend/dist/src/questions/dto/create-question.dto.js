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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateQuestionDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateQuestionDto {
}
exports.CreateQuestionDto = CreateQuestionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'What is 2+2?', description: 'Question text' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(5, { message: 'Question text must be at least 5 characters long' }),
    (0, class_validator_1.MaxLength)(1000, { message: 'Question text cannot exceed 1000 characters' }),
    __metadata("design:type", String)
], CreateQuestionDto.prototype, "text", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Question order in test' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(10),
    __metadata("design:type", Number)
], CreateQuestionDto.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-of-test', description: 'Test ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateQuestionDto.prototype, "testId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-of-question-type', description: 'Question type ID' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateQuestionDto.prototype, "typeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: [
            { text: '3', isCorrect: false },
            { text: '4', isCorrect: true },
            { text: '5', isCorrect: false },
            { text: '6', isCorrect: false }
        ],
        description: 'Question options'
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(2, { message: 'Question must have at least 2 options' }),
    (0, class_validator_1.ArrayMaxSize)(4, { message: 'Question cannot have more than 4 options' }),
    __metadata("design:type", Array)
], CreateQuestionDto.prototype, "options", void 0);
//# sourceMappingURL=create-question.dto.js.map