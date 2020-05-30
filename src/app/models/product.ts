export class Product {
  code: string;
  quantity: number;
  floorId: number;
  floorName: string;
  sectionName: string;
  sectionId: number;
}

export enum ProductModes {
  EDIT = 'edit',
  CREATE = 'create'
}
