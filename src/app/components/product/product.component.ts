import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  productForm: FormGroup;
  product: Product;
  mode: ProductModes;

  constructor(
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.mode = ProductModes.CREATE;

    this.productForm = this.fb.group({
      code: [null, [Validators.required]],
      floorId: [null, [Validators.required]],
      sectionId: [null, [Validators.required]],
      quantity: [null, [Validators.required]]
    });

    this.activeRoute.params.subscribe(params => {
      this.fillInFormData(params);
    });
  }

  async fillInFormData(routeParams: Params) {
    if (routeParams.code) {
      this.product = await this.apiService.getProduct(routeParams.code);

      if (this.product && this.productForm) {
        this.productForm.get('code').setValue(this.product.code);
        this.productForm.get('quantity').setValue(this.product.quantity);
        this.productForm.get('floorId').setValue(this.product.floorId);
        this.productForm.get('sectionId').setValue(this.product.sectionId);
        this.mode = ProductModes.EDIT;
      }
    }
    if (routeParams.sectionId) {
      if (this.productForm) {
        this.productForm.get('sectionId').setValue(routeParams.sectionId);
      }
    }
    if (routeParams.floorId) {
      if (this.productForm) {
        this.productForm.get('sectionId').setValue(routeParams.floorId);
      }
    }
  }

  save(): void {
    if (!this.productForm.valid) {
      return;
    }
    const data = this.productForm.value;
    if (this.mode === ProductModes.CREATE) {
      this.apiService.addProduct(data);
    } else {
      this.apiService.updateProduct(data);
    }
    this.router.navigateByUrl(`/products/${data.floorId}/${data.sectionId}`);
  }
}

export enum ProductModes {
  EDIT = 'edit',
  CREATE = 'create'
}
