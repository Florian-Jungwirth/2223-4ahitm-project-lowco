import { Component, OnInit } from '@angular/core';
import { TitleService } from 'src/app/services/title.service';
import { CategoryService } from 'src/app/services/category.service';
import {CategoryModel} from "../../models/category.model";
import {SurveyService} from "../../services/survey.service";
import {SurveyModel} from "../../models/survey.model";

@Component({
  selector: 'app-category-selection',
  templateUrl: './category-selection.page.html',
  styleUrls: ['./category-selection.page.scss'],
})
export class ActivitySelectionPage implements OnInit {
  categories: CategoryModel[] = [];
  selectedCategories: any[] = [];
  loading = true;
  surveys: SurveyModel[];
  searchString: string = ""

  constructor(
    private categoryService: CategoryService,
    private titleService: TitleService,
    private surveyService: SurveyService
  ) {}

  ionViewWillEnter() {
    this.titleService.setTitle('Kategorien');
  }

  search() {
    this.selectedCategories = []
    this.selectedCategories = this.categoryService.getCategoriesWithSurveysByName(
      this.categories,
      this.surveys,
      this.searchString.toLowerCase()
    );
  }

  async ngOnInit() {
    this.categoryService.getAllActiveCategories().subscribe({
      next: (categories) => {
        this.selectedCategories = categories;
        for (const category of categories) {
          let categoryChanged: any = category
          categoryChanged.surveys = []
          this.categories.push(categoryChanged);
        }
        this.loading = false;
      }
    });

    this.surveyService.getAllActiveSurveys().subscribe((surveys) => {
      this.surveys = surveys;
    })
  }
}
