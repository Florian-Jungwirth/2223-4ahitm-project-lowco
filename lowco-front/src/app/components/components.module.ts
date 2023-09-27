import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { CategoryComponent } from "./categorycomponent/category.component";
import { ProgressbarComponent } from "./progressbar/progressbar.component";
import { SimpleComponent } from "./simple/simple.component";
import { SearchIconComponent } from "./search-icon/search-icon.component";
import { QuantityComponent } from "./quantity/quantity.component";

@NgModule({
    declarations: [ProgressbarComponent, SimpleComponent, CategoryComponent, SearchIconComponent, QuantityComponent],
    imports: [IonicModule, CommonModule],
    exports: [ProgressbarComponent, SimpleComponent, CategoryComponent, SearchIconComponent, QuantityComponent]
})

export class ComponentsModule{}