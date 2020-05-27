import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Floor } from '../models/floor';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private data: BehaviorSubject<Floor[]> = new BehaviorSubject<Floor[]>([]);

  constructor(
    private http: HttpClient
  ) { }

  async initData() {
    const floors: Floor[] = await this.http.get<Floor[]>('/assets/floors.json').toPromise();
    this.data.next(floors);
  }

  getData(): BehaviorSubject<Floor[]> {
    return this.data;
  }

  updateData(newData: Floor[]) {
    this.data.next(newData);
  }
}
