import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Floor } from '../models/floor';
import { HttpClient } from '@angular/common/http';
import { Section } from '../models/section';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private dataInitialized = false;
  private data: BehaviorSubject<Floor[]> = new BehaviorSubject<Floor[]>([]);

  constructor(
    private http: HttpClient
  ) { }

  async ensureData() {
    if (!this.dataInitialized) {
      const floors: Floor[] = await this.http.get<Floor[]>('/assets/data/floors.json').toPromise();
      this.data.next(floors);
      this.dataInitialized = true;
    }
  }

  async getData(): Promise<BehaviorSubject<Floor[]>> {
    this.ensureData();
    return this.data;
  }

  addFloor(floor: Floor) {
    this.ensureData();
    const currentData: Floor[] = this.data.value;
    currentData.push(floor);
    this.data.next(currentData);
  }

  addSection(section: Section) {
    this.ensureData();
    const currentData: Floor[] = this.data.value;
    const floor = currentData.find((x) => x.id === section.floorId);
    if (!floor) {
      // throw something
    }
    floor.sections.push(section);
    this.data.next(currentData);
  }

  addProduct(product: Product) {
    this.ensureData();
    const currentData: Floor[] = this.data.value;
    const floor = currentData.find((x) => x.id === product.floorId);
    if (!floor) {
      // throw something
    }
    const section = floor.sections.find((x) => x.id === product.sectionId);
    if (!section) {
      // do something
    }
    section.products.push(product);
    this.data.next(currentData);
  }

  getProdductsForSection(floorId: number, sectionId: number) {
    this.ensureData();
    const currentData: Floor[] = this.data.value;
    const floor = currentData.find((x) => x.id === floorId);
    if (!floor) {
      // throw something
    }
    const section = floor.sections.find((x) => x.id === sectionId);
    if (!section) {
      // do something
    }
    return section.products;
  }

  search(text: string): Product[] {
    let findedProducts: Product[] = this.searchProductsByCode(text);
    if (!isNaN(+text)) {
      let tempProducts = this.searchProductsByFloor(+text);
      findedProducts = this.excludeMatchingProducts(findedProducts, tempProducts);

      tempProducts = this.searchProductsBySection(+text);
      findedProducts = this.excludeMatchingProducts(findedProducts, tempProducts);
    }
    return findedProducts;
  }

  searchProductsByFloor(floorId: number): Product[] {
    this.ensureData();
    const floor: Floor = this.data.value.find((x) => x.id === floorId);
    if (!floor) {
      return [];
    }
    let productsByFloor: Product[] = [];
    floor.sections.forEach(section => {
      productsByFloor = [...productsByFloor, ...section.products];
    });
    return productsByFloor;
  }

  searchProductsBySection(sectionId: number): Product[] {
    this.ensureData();
    let section: Section;
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.data.value.length; i++) {
      if (section) { break; }
      if (this.data.value[i].sections.length) {
        section = this.data.value[i].sections.find((x) => x.id === sectionId);
      }
    }
    return section.products.length ? section.products : [];
  }

  searchProductsByCode(text: string): Product[] {
    this.ensureData();
    const products: Product[] = [];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.data.value.length; i++) {
      if (this.data.value[i].sections.length) {
        // tslint:disable-next-line: prefer-for-of
        for (let p = 0; p < this.data.value[i].sections.length; p++) {
          if (this.data.value[i].sections[p].products.length) {
            // tslint:disable-next-line:prefer-for-of
            for (let s = 0; s < this.data.value[i].sections[p].products.length; s++) {
              if (this.data.value[i].sections[p].products[s].code.includes(text)) {
                products.push(this.data.value[i].sections[p].products[s]);
              }
            }
          }
        }
      }
    }
    return products;
  }

  excludeMatchingProducts(firstProductList: Product[], secoundProductList: Product[]): Product[] {
    const filteredProductList: Product[] = [...firstProductList];
    secoundProductList.forEach(product => {
      if (!firstProductList.find((x) => x.code === product.code)) {
        filteredProductList.push(product);
      }
    });
    return filteredProductList;
  }
}
