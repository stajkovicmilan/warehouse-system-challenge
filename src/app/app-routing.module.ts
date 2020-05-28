import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { ProductsListComponent } from './components/products-list/products-list.component';
import { ProductComponent } from './components/product/product.component';


const routes: Routes = [{
  path: '', component: LayoutComponent, children: [
    { path: 'products/:floorId/:sectionId', component: ProductsListComponent },
    { path: 'add-floor', component: ProductsListComponent },
    { path: 'add-section/:floorId', component: ProductsListComponent },
    { path: 'product', component: ProductComponent },
    { path: 'product/:code', component: ProductComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
