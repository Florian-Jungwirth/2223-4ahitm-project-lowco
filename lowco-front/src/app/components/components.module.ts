import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { CategoryComponent } from "./categorycomponent/category.component";
import { ProgressbarComponent } from "./progressbar/progressbar.component";
import { SimpleComponent } from "./simple/simple.component";
import { SearchIconComponent } from "./search-icon/search-icon.component";
import { QuantityComponent } from "./quantity/quantity.component";
import { SurveyModalComponent } from "./surveyModal/survey-modal.component";
import {FormsModule} from "@angular/forms";

@NgModule({
    declarations: [ProgressbarComponent, SimpleComponent, CategoryComponent, SearchIconComponent, QuantityComponent, SurveyModalComponent],
    imports: [IonicModule, CommonModule, FormsModule],
    exports: [ProgressbarComponent, SimpleComponent, CategoryComponent, SearchIconComponent, QuantityComponent, SurveyModalComponent]
})

export class ComponentsModule{}
