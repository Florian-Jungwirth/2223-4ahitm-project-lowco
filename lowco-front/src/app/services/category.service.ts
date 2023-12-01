import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CategoryModel, CategorySaveModel } from '../models/category.model';
import {API2_URL, API_URL} from '../constants';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private httpClient: HttpClient) {
  }

  getAllCategories(): Observable<CategoryModel[]> {
    return this.httpClient.get<CategoryModel[]>(`${API_URL}category`);
  }

  getCategoriesByName(categories: any, search: string): CategoryModel[] {
    let selectedCategories = [];
    for (const cateogry of categories) {
      if (cateogry.title.toLowerCase().includes(search.toLowerCase())) {
        selectedCategories.push(cateogry);
      }
    }
    return selectedCategories;
  }

  updateCategory(categoryId: number, category: CategorySaveModel) {
    return this.httpClient.patch(`${API_URL}category/${categoryId}`, category);
  }

  deleteCategory(categoryId: number): Observable<CategoryModel> {
    return this.httpClient.delete<CategoryModel>(`${API_URL}category/${categoryId}`)
  }

  createNewCategory(category: CategoryModel): Observable<any> {
    return this.httpClient.post(`${API_URL}category`, category);
  }

  getFortbewegung(): Observable<CategoryModel> {
    return this.httpClient.get<CategoryModel>(`${API_URL}category/specific/fortbewegung`);
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
      `${API2_URL}category/allActive`
    );
  }
}
