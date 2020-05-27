import { Product } from './product';

export class Section {
  id: number;
  name: string;
  floorId: number;
  products: Product[];
}
