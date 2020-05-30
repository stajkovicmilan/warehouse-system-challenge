import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
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
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe(async params => {
      this.floorId = +params.floorId;
      this.sectionId = +params.sectionId;
      this.products = await this.apiService.getProdductsForSection(this.floorId, this.sectionId);
   });
  }

  openAddProduct() {
    this.router.navigateByUrl(`/product/${this.floorId}/${this.sectionId}`);
  }
}
