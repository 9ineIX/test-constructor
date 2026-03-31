import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(createCategoryDto: CreateCategoryDto): Promise<{
        _count: {
            tests: number;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
    }>;
    findAll(): Promise<({
        _count: {
            tests: number;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
    })[]>;
    findOne(id: string): Promise<{
        tests: ({
            _count: {
                questions: number;
                results: number;
            };
            author: {
                id: string;
                name: string;
                email: string;
            };
        } & {
            id: string;
            description: string | null;
            createdAt: Date;
            title: string;
            authorId: string;
            updatedAt: Date;
        })[];
        _count: {
            tests: number;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
    }>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<{
        _count: {
            tests: number;
        };
    } & {
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
    }>;
}
