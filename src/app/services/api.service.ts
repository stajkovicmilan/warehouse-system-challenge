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

  async ensureData(): Promise<void> {
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

  async addFloor(floor: Floor): Promise<void> {
    await  this.ensureData();
    const currentData: Floor[] = this.floorsData.value;
    currentData.push(floor);
    this.floorsData.next(currentData);
  }

  async getFloor(floorId: number): Promise<Floor> {
    await  this.ensureData();
    const floor: Floor = this.floorsData.value.find((x) => x.id === floorId);
    if (!floor) {
      console.log('Error: Floor not found!');
      return null;
    }
    return floor;
  }

  async addSection(section: Section): Promise<void> {
    await this.ensureData();
    const currentData: Floor[] = this.floorsData.value;
    const floor = currentData.find((x) => x.id === section.floorId);
    if (!floor) {
      console.log('Error: Floor not found!');
    }
    if (!floor.sections) {
      floor.sections = [];
    }
    floor.sections.push(section);
    this.floorsData.next(currentData);
  }

  async getSection(floorId: number, sectionId: number): Promise<Section> {
    await this.ensureData();
    const sectionFloor: Floor = await this.getFloor(floorId);
    if (!sectionFloor) {
      console.log('Error: Floor not found!');
      return null;
    }
    const section = sectionFloor.sections.find((x) => x.id === sectionId);
    if (!section) {
      console.log('Error: Section not found!');
      return null;
    }
    return section;
  }

  async addProduct(product: Product): Promise<void> {
    await this.ensureData();
    const existing = this.productsData.find((x) => x.code === product.code);
    if (existing) {
      throw new Error('Error: Product already exists');
    }
    this.productsData.push(product);
  }

  async updateProduct(product: Product): Promise<void> {
    await  this.ensureData();
    const existing = this.productsData.find((x) => x.code === product.code);
    if (!existing) {
      throw new Error('Error: Product does not exists');
    }
    existing.quantity = product.quantity;
  }

  async getProdductsForSection(floorId: number, sectionId: number): Promise<Product[]> {
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
