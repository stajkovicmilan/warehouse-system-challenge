import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { ProductsListComponent } from './components/products-list/products-list.component';


const routes: Routes = [{
  path: '', component: LayoutComponent, children: [
    { path: 'products/:floorId/:sectionId', component: ProductsListComponent },
    { path: 'add-floor', component: ProductsListComponent },
    { path: 'add-section', component: ProductsListComponent }
  ]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
