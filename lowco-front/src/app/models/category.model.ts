export interface CategoryModel {
    id: number;
    title: string;
    iconName: string;
    activated: number;
}

export interface CategorySaveModel {
    title: string;
    iconName: string;
}
