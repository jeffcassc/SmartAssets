import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { CustomInputComponent } from './custom-input/custom-input.component';
import { LogoComponent } from './logo/logo.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddUpdateProductComponent } from './add-update-product/add-update-product.component';
import { RequestLoanComponent } from './request-loan/request-loan.component';
import { UserModalComponent } from './user-modal/user-modal.component';





@NgModule({
  declarations: [
    HeaderComponent,
    CustomInputComponent,
    LogoComponent, 
    AddUpdateProductComponent,
    RequestLoanComponent,
    UserModalComponent
  ],
  exports: [
    HeaderComponent,
    CustomInputComponent,
    LogoComponent,
    ReactiveFormsModule, 
    AddUpdateProductComponent,
    RequestLoanComponent,
    UserModalComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SharedModule { }
