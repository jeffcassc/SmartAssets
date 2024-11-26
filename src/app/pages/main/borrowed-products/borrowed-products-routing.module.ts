import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BorrowedProductsPage } from './borrowed-products.page';

const routes: Routes = [
  {
    path: '',
    component: BorrowedProductsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BorrowedProductsPageRoutingModule {}
