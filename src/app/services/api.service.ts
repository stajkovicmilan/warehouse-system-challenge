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
  private floorsData: BehaviorSubject<Floor[]> = new BehaviorSubject<Floor[]>([]);
  private productsData: Product[];

  constructor(
    private http: HttpClient
  ) { }

  async ensureData() {
    if (!this.dataInitialized) {
      const floors: Floor[] = await this.http.get<Floor[]>('/assets/data/floors.json').toPromise();
      this.productsData = await this.http.get<Product[]>('/assets/data/products.json').toPromise();
      this.floorsData.next(floors);
      this.dataInitialized = true;
    }
  }

  async getFloors(): Promise<BehaviorSubject<Floor[]>> {
    await this.ensureData();
    return this.floorsData;
  }

  async addFloor(floor: Floor) {
    await  this.ensureData();
    const currentData: Floor[] = this.floorsData.value;
    currentData.push(floor);
    this.floorsData.next(currentData);
  }

  async addSection(section: Section) {
    await this.ensureData();
    const currentData: Floor[] = this.floorsData.value;
    const floor = currentData.find((x) => x.id === section.floorId);
    if (!floor) {
      // throw something
    }
    if (!floor.sections) {
      floor.sections = [];
    }
    floor.sections.push(section);
    this.floorsData.next(currentData);
  }

  async addProduct(product: Product) {
    await this.ensureData();
    const existing = this.productsData.find((x) => x.code === product.code);
    if (existing) {
      throw new Error('Product already exists');
    }
    this.productsData.push(product);
  }

  async updateProduct(product: Product) {
    await  this.ensureData();
    const existing = this.productsData.find((x) => x.code === product.code);
    if (!existing) {
      throw new Error('Product does not exists');
    }
    existing.quantity = product.quantity;
  }

  async getProdductsForSection(floorId: number, sectionId: number) {
    await  this.ensureData();
    return this.productsData.filter((x) => x.floorId === floorId && x.sectionId === sectionId);
  }

  async getProduct(code): Promise<Product> {
    await this.ensureData();
    return this.productsData.find((x) => x.code === code);
  }

  search(text: string): Product[] {
    const searchableFields = ['code', 'floorName', 'sectionName'];
    return this.productsData.filter((x) => {
      for (const field of searchableFields) {
        if (x[field] && x[field].includes(text)) {
          return true;
        }
      }
      return false;
    });
  }
}
