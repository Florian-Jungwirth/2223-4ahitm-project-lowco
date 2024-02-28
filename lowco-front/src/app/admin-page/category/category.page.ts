import { Component, ViewChild } from '@angular/core';
import { CategoryModel } from '../../models/category.model';
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

  setCategories: CategoryModel[] = [];
  allCategories: CategoryModel[] = [];
  edit = false;
  categoryId = 0;
  collapsed = true;
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
    let updatedCategory: CategoryModel = {
      title: formValues.categoryTitle || '', iconName: this.selectedIcon, id: this.categoryId, activated: true
    };

    this.categoryService
      .updateCategory(updatedCategory).subscribe(() => {
      for (let category of this.setCategories) {
        if (category.id == this.categoryId) {
          category.title = updatedCategory.title;
          category.iconName = updatedCategory.iconName
          break;
        }
      }
    });



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
    let createCategory: CategoryModel = { title: formValues.categoryTitle, iconName: this.selectedIcon, activated: true };
    this.categoryService.createNewCategory(createCategory).subscribe(() => {
      this.ngOnInit()
    })

    this.modal.dismiss();
  }

  deactivate(category: CategoryModel) {
    category.activated = false
    this.categoryService.updateCategory(category).subscribe();
    this.setCategories[this.setCategories.indexOf(category)].activated = false;
  }

  activate(category: CategoryModel) {
    category.activated = true
    this.categoryService.updateCategory(category).subscribe();
    this.setCategories[this.setCategories.indexOf(category)].activated = true;
  }

  async deleteCategory(category: CategoryModel) {
    const alert = await this.alertController.create({
      header: category.title + ' löschen? (Achtung, alle zugehörigen Abfragen werden auch gelöscht)',
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
            this.categoryService.deleteCategory(category.id).subscribe(() => {
              this.ngOnInit()
            });
          },
        },
      ],
    });

    await alert.present();
  }

  search(event: any) {
    let searched = event.target.value.toLowerCase();
    this.setCategories = this.categoryService.getCategoriesByName(
      this.allCategories,
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
