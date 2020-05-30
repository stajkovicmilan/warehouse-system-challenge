import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Floor } from 'src/app/models/floor';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  floors: Floor[];
  selectedFloor: number;
  selectedSection: number;

  constructor(
    private apiService: ApiService,
    private activeRoute: ActivatedRoute,
    private router: Router,
  ) { }

  async ngOnInit() {
    const data = await this.apiService.getFloors();
    this.subscription = data.subscribe((value) => {
      this.floors = value;
    });

    if (this.activeRoute.parent && this.activeRoute.parent.firstChild && this.activeRoute.parent.firstChild.firstChild) {
      this.activeRoute.parent.firstChild.firstChild.params.subscribe(async params => {
        this.selectedFloor = +params.floorId;
        this.selectedSection = +params.sectionId;
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  selectFloor(id: number): void {
    const existingFloor = this.floors.find((x) => x.id === id);
    if (!existingFloor) {
      console.error('Selected floor does not exists');
      return;
    }
    if (this.selectedFloor === id) {
      this.selectedFloor = null;
    } else {
      this.selectedFloor = id;
    }
    this.selectedSection = null;
  }

  selectSection(floorId: number, sectionId: number) {
    this.selectedSection = sectionId;
    this.router.navigateByUrl(`/products/${floorId}/${sectionId}`);
  }

  isActive(floorId, sectionId) {
    return parseInt(floorId, 10) === this.selectedFloor && parseInt(sectionId, 10) === this.selectedSection;
  }
}
