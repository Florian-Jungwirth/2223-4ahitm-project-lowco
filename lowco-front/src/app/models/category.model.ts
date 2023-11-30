export interface CategoryModel {
    id: string;
    title: string;
    iconName: string;
    activated: number;
}

export interface CategorySaveModel {
    title: string;
    iconName: string;
}
