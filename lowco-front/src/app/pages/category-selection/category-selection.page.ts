import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { TitleService } from 'src/app/services/title.service';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-category-selection',
  templateUrl: './category-selection.page.html',
  styleUrls: ['./category-selection.page.scss'],
})
export class ActivitySelectionPage implements OnInit {
  categories: any;
  selectedCategories: any;
  loading = true;

  constructor(
    private categoryService: CategoryService,
    private navController: NavController,
    private titleService: TitleService
  ) {}

  ionViewWillEnter() {
    this.titleService.setTitle('Kateogrien');
  }

  search(event: any) {
    this.selectedCategories = this.categoryService.getCategoriesByName(
      this.categories,
      event.target.value.toLowerCase()
    );
  }

  async ngOnInit() {
    this.categoryService.getAllActivatedCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.selectedCategories = categories;
        this.loading = false;
      },
      error: () => {
        //TODO: Errorhandling
      },
    });
  }

  navigateTo(id: any) {
    this.navController.navigateForward('/lowco/category?id=' + id);
  }
}
