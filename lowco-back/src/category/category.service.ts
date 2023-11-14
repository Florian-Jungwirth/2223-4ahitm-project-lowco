import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from 'src/schema/category.schema';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  async create(categoryDto: CreateCategoryDto): Promise<CategoryDocument> {
    const newCategory = new this.categoryModel(categoryDto);
    return newCategory.save();
  }

  findAll() {
    return this.categoryModel.find();
  }

  findOne(id: string) {
    return this.categoryModel.findOne({ _id: id });
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.categoryModel.updateOne({ _id: id }, updateCategoryDto);
  }

  remove(id: string) {
    return this.categoryModel.deleteOne({ _id: id });
  }

  setAllActivated() {
    return this.categoryModel.updateMany({}, {$set: {activated: 1}});
  }
  
  setOneActivated(id: string, state: number) {
    if(state == 1 || state == 0) {
      return this.categoryModel.updateOne({_id: id}, {$set: {activated: state}})
    } else {
      return new HttpException('Only values 0 or 1 allowed!', HttpStatus.BAD_REQUEST)
    }
  }
  
  getAllActivated() {
    return this.categoryModel.find({activated: 1});
  }

  getFortbewegung() {
    return this.categoryModel.findOne({title: 'Fortbewegung'});
  }
}
