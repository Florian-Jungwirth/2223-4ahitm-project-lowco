import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }

  @Get('specific/fortbewegung')
  getFortbewegung() {
    return this.categoryService.getFortbewegung();
  }

  // @Patch('activated/all')
  // activateAll() {
  //   return this.categoryService.setAllActivated();
  // }

  @Get('activated/all')
  getActivated() {
    return this.categoryService.getAllActivated();
  }

  @Patch('activated/setOneActivated/:id/:state')
  setOneActivated(@Param('id') id: string, @Param('state') state: number) {
    return this.categoryService.setOneActivated(id, state);
  }
}
