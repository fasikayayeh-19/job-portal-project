
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from './entities/category.entity';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // =====================================================
  // CREATE CATEGORY
  // =====================================================

  async create(dto: CreateCategoryDto) {
    const category =
      this.categoryRepository.create(dto);

    return this.categoryRepository.save(category);
  }

  // =====================================================
  // GET ALL CATEGORIES
  // =====================================================

  async findAll() {
    return this.categoryRepository.find({
      order: {
        name: 'ASC',
      },
    });
  }

  // =====================================================
  // GET ONE CATEGORY
  // =====================================================

  async findOne(id: string) {
    const category =
      await this.categoryRepository.findOne({
        where: {
          id,
        },
      });

    if (!category) {
      throw new NotFoundException(
        'Category not found',
      );
    }

    return category;
  }

  // =====================================================
  // UPDATE CATEGORY
  // =====================================================

  async update(
    id: string,
    dto: UpdateCategoryDto,
  ) {
    const category =
      await this.findOne(id);

    Object.assign(category, dto);

    return this.categoryRepository.save(
      category,
    );
  }

  // =====================================================
  // DELETE CATEGORY
  // =====================================================

  async remove(id: string) {
    const category =
      await this.findOne(id);

    await this.categoryRepository.remove(
      category,
    );

    return {
      message: 'Category deleted successfully',
    };
  }
}

