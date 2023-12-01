import { Component, ViewChild } from '@angular/core';
import { CategoryModel, CategorySaveModel } from '../../models/category.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, IonModal } from '@ionic/angular';
import { TitleService } from 'src/app/services/title.service';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage {
  constructor(
    private categoryService: CategoryService,
    private alertController: AlertController,
    private titleService: TitleService
  ) { }

  ionViewWillEnter() {
    this.titleService.setTitle('Kategorien')
  }

  setCategories: CategoryModel[] = new Array();
  allCategories: CategoryModel[] = new Array();
  edit = false;
  categoryId = 0;
  collapsed = true;
  categories: any;
  @ViewChild('modal') modal!: any;

  async ngOnInit() {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.setCategories = categories;
        this.allCategories = categories;
      },
      error: () => {
        //TODO: Errorhandling
      }
    })
  }

  selectedIcon = "";

  categoryForm = new FormGroup({
    categoryTitle: new FormControl('', [Validators.required]),
  });

  async editModal(category: CategoryModel) {
    this.categoryId = category.id;
    this.selectedIcon = category.iconName;

    this.categoryForm.setValue({
      categoryTitle: category.title
    });
    this.edit = true;
    this.modal.present();
  }

  async updateCategory() {
    let formValues = this.categoryForm.value;
    let updatedCategory: CategorySaveModel = {
      title: formValues.categoryTitle || '', iconName: this.selectedIcon,
    };
    this.categoryService
      .updateCategory(this.categoryId, updatedCategory).subscribe({
        next: (data) => {

        },
        error: () => {
          //TODO: Errorhandling
        }
      });

    for (const category of this.setCategories) {
      if (category.id == this.categoryId) {
        category.title = updatedCategory.title;
        category.iconName = updatedCategory.iconName;
        break;
      }
    }

    this.modal.dismiss();
  }

  async createModal() {
    this.categoryForm.reset();
    this.selectedIcon = ""
    this.edit = false;
    this.modal.present();
  }

  async createCategory() {
    let formValues = this.categoryForm.value;
    //@ts-ignore
    let createCategory: CategoryModel = { title: formValues.categoryTitle, iconName: this.selectedIcon };
    this.categoryService.createNewCategory(createCategory).subscribe({
      next: (category) => {
        this.setCategories.push(category)
      },
      error: () => {
        //TODO: Errorhandling
      }
    })

    this.modal.dismiss();
  }

  deactivate(category: CategoryModel) {
    this.categoryService.setActivateCategory(category, 0);
    this.setCategories[this.setCategories.indexOf(category)].activated = 0;
  }

  activate(category: CategoryModel) {
    this.categoryService.setActivateCategory(category, 1);
    this.setCategories[this.setCategories.indexOf(category)].activated = 1;
  }

  async deleteCategory(category: CategoryModel) {
    const alert = await this.alertController.create({
      header: category.title + ' löschen?',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Nein',
          cssClass: 'alert-button-cancel',
          role: 'cancel',
        },
        {
          text: 'Ja',
          cssClass: 'alert-button-confirm',
          handler: () => {
            this.categoryService.deleteCategory(category.id).subscribe();
            this.setCategories.splice(this.setCategories.indexOf(category), 1);
          },
        },
      ],
    });

    await alert.present();
  }

  async search(event: any) {
    let searched = event.target.value.toLowerCase();
    this.categories = await this.categoryService.getCategoriesByName(
      this.categories,
      searched
    );
  }

  @ViewChild('modal2', { static: true }) modal2!: IonModal;

  iconSelectionChange(icon: string) {
    this.selectedIcon = icon;
    this.modal2.dismiss();
  }

  changeCollapsed() {
    this.collapsed = !this.collapsed;
  }
}
