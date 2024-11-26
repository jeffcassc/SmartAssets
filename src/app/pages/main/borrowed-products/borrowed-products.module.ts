import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BorrowedProductsPageRoutingModule } from './borrowed-products-routing.module';

import { BorrowedProductsPage } from './borrowed-products.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BorrowedProductsPageRoutingModule,
    SharedModule
  ],
  declarations: [BorrowedProductsPage]
})
export class BorrowedProductsPageModule {}
