import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoryModel } from '../models/category.model';
import { API2_URL } from '../constants';
import { Observable, firstValueFrom } from 'rxjs';
import { SurveyModel } from "../models/survey.model";
import { SurveyService } from "./survey.service";

@Injectable({
  providedIn: 'root',
})
export class CategoryService {

  constructor(private httpClient: HttpClient, private surveyService: SurveyService) {
  }

  getAllActiveCategories(): Observable<CategoryModel[]> {
    return this.httpClient.get<CategoryModel[]>(
      `${ API2_URL }category/allActive`
    );
  }

  deleteCategory(categoryId: number): Observable<CategoryModel> {
    return this.httpClient.delete<CategoryModel>(`${API2_URL}category/deleteWithSurveys/${categoryId}`)
  }

  getAllCategories(): Observable<CategoryModel[]> {
    return this.httpClient.get<CategoryModel[]>(
      `${ API2_URL }category/all`
    );
  }

  updateCategory(category: CategoryModel) {
    return this.httpClient.put(`${API2_URL }category/updateCategory`, category);
  }

  createNewCategory(category: CategoryModel) {
    return this.httpClient.post(`${API2_URL}category`, category);
  }


  getCategoriesByName(categories: CategoryModel[], search: string): CategoryModel[] {
    let selectedCategories = [];

    for (const cateogry of categories) {
      if (cateogry.title.toLowerCase().includes(search.toLowerCase())) {
        selectedCategories.push(cateogry);
      }
    }
    return selectedCategories;
  }

  getCategoriesWithSurveysByName(categories: any, surveys: SurveyModel[], search: string): any {
    for (const category of categories) {
      category.surveys = []
    }
    if (search == '') {
      return categories;
    }
    let selectedCategories = [];
    let selectedSurveys = this.surveyService.getSurveysByName(surveys, search)

    for (const cateogry of categories) {
      if (cateogry.title.toLowerCase().includes(search.toLowerCase())) {
        selectedCategories.push(cateogry);
      }
    }

    for (const selectedSurvey of selectedSurveys) {
      let added = false;
      for (const selectedCategory of selectedCategories) {
        if (selectedCategory.id == selectedSurvey.category.id) {
          selectedCategory.surveys.push(selectedSurvey);
          added = true;
          break;
        }
      }
      if (!added) {
        let category: any = selectedSurvey.category
        category.surveys = [selectedSurvey]
        selectedCategories.push(category)
      }
    }
    return selectedCategories;
  }

  async getHours() {
    return firstValueFrom(this.httpClient.get<number>(`${API2_URL}category/getHours`))
  }
}
