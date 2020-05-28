import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Floor } from 'src/app/models/floor';
import { Section } from 'src/app/models/section';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit {

  floorId: number;
  sectionId: number;
  products: Product[];

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.floorId = +params.floorId;
      this.sectionId = +params.sectionId;
      this.products = this.apiService.getProdductsForSection(this.floorId, this.sectionId);
   });
  }

  addFloor() {
    const f = new Floor();
    f.id = (new Date()).getMilliseconds();
    f.name = (new Date()).getMilliseconds().toString();
    console.log(this.apiService.search('11'));
  }

  addSection() {
    const f = new Section();
    f.id = new Date().getMilliseconds();
    f.name = new Date().getMilliseconds().toString();
    f.floorId = 1;
    this.apiService.addSection(f);
  }
}
