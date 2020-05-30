import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Product, ProductModes } from 'src/app/models/product';
import { Floor } from 'src/app/models/floor';
import { Section } from 'src/app/models/section';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  productForm: FormGroup;
  product: Product;
  mode: ProductModes;
  isSubmitted: boolean;

  constructor(
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.mode = ProductModes.CREATE;

    this.productForm = this.fb.group({
      codePrefix: [null, [Validators.required, this.productCodePrefixValidator]],
      codeSuffix: [null, [Validators.required, this.productCodeSuffixValidator]],
      floorId: [null, [Validators.required]],
      sectionId: [null, [Validators.required]],
      quantity: [null, [Validators.required]]
    });

    this.activeRoute.params.subscribe(params => {
      this.fillInFormData(params);
    });
  }

  async fillInFormData(routeParams: Params): Promise<void> {
    if (routeParams.code) {
      this.product = await this.apiService.getProduct(routeParams.code);

      if (this.product && this.productForm) {
        const codeArray = this.product.code.split(' ');
        this.productForm.get('codePrefix').setValue(codeArray[0]);
        this.productForm.get('codeSuffix').setValue(codeArray[1]);
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
        this.productForm.get('floorId').setValue(routeParams.floorId);
      }
    }
  }

  async save(): Promise<void> {
    if (!this.productForm.valid) {
      return;
    }
    const data: any = this.productForm.value;
    const floor: Floor = await this.apiService.getFloor(+data.floorId);
    const section: Section = await this.apiService.getSection(+data.floorId, +data.sectionId);
    const newProduct: Product = {
      floorId: +data.floorId,
      sectionId: +data.sectionId,
      code: `${data.codePrefix} ${data.codeSuffix}`,
      quantity: data.quantity,
      floorName: floor.name,
      sectionName: section.name,
    };

    if (this.mode === ProductModes.CREATE) {
      this.apiService.addProduct(newProduct);
    } else {
      this.apiService.updateProduct(newProduct);
    }
    this.isSubmitted = false;
    this.router.navigateByUrl(`/products/${data.floorId}/${data.sectionId}`);
  }

  productCodePrefixValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (
      !control.value ||
      control.value.length < 2 ||
      control.value.length > 4 ||
      !RegExp(('[A-Z]+$')).test(control.value)) {
      return { invalidCodePrefix: true };
    }
    return null;
  }

  productCodeSuffixValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (!control.value || control.value.length < 4 || control.value.length > 6 || RegExp(('[a-zA-Z]+')).test(control.value)) {
      return { invalidCodePrefix: true };
    }
    return null;
  }
}
