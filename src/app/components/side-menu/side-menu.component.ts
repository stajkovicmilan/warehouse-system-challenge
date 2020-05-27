import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Floor } from 'src/app/models/floor';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  floors: Floor[];
  currentFloor: number;

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.subscription = this.apiService
      .getData()
      .subscribe((value) => {
        this.floors = value;
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  selectFloor(id: number) {
    const existingFloor = this.floors.find((x) => x.id === id);
    if (!existingFloor) {
      console.error('Selected floor does not exists');
      return;
    }
    this.currentFloor = id;
  }
}
