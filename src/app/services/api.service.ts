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
}
