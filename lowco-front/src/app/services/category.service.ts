import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoryModel, CategorySaveModel } from '../models/category.model';
import { API2_URL, API_URL } from '../constants';
import { Observable } from 'rxjs';
import { SurveyModel } from "../models/survey.model";
import { SurveyService } from "./survey.service";

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private httpClient: HttpClient, private surveyService: SurveyService) {
  }

  getAllCategories(): Observable<CategoryModel[]> {
    return this.httpClient.get<CategoryModel[]>(`${ API_URL }category`);
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
    if (search == '') {
      for (const category of categories) {
        category.surveys = []
      }
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

  updateCategory(categoryId: number, category: CategorySaveModel) {
    return this.httpClient.patch(`${API_URL }category/${ categoryId }`, category);
  }

  deleteCategory(categoryId: number): Observable<CategoryModel> {
    return this.httpClient.delete<CategoryModel>(`${API_URL}category/${categoryId}`)
  }

  createNewCategory(category: CategoryModel): Observable<any> {
    return this.httpClient.post(`${API_URL}category`, category);
  }


  setActivateCategory(category: CategoryModel, state: number) {
    this.httpClient
      .patch(
        `${API_URL}category/activated/setOneActivated/${category.id}/${state}`,
        {}
      )
      .subscribe();
  }

  //--------------------------------------
  getAllActiveCategories(): Observable<CategoryModel[]> {
    return this.httpClient.get<CategoryModel[]>(
      `${ API2_URL }category/allActive`
    );
  }
}