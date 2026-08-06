import { Injectable, NotFoundException } from '@nestjs/common';
// import { constructor } from 'supertest/lib/cookies';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm/browser/repository/Repository.js';

import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
   

constructor(
  @
  InjectRepository(Category)
   private categoryRepository: Repository<Category>,
) {}

async create(dto: CreateCategoryDto) {

  const category = this.categoryRepository.create(dto);

  return this.categoryRepository.save(category);

}

async findAll() {

  return this.categoryRepository.find({
    order: {
      name: 'ASC',
    },
  });

}

async findOne(id: string) {

  const category = await this.categoryRepository.findOne({
    where: { id },
  });

  if (!category) {
    throw new NotFoundException('Category not found');
  }

  return category;

}


async update(
  id: string,
  dto: UpdateCategoryDto,
) {

  const category = await this.findOne(id);

  Object.assign(category, dto);

  return this.categoryRepository.save(category);

}
async remove(id: string) {

  const category = await this.findOne(id);

  await this.categoryRepository.remove(category);

  return {
    message: 'Category deleted successfully',
  };

}
}
