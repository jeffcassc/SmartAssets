import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainPage } from './main.page';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { noAuthGuard } from 'src/app/guards/no-auth.guard';

const routes: Routes = [
  {
    path: '',
    component: MainPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then( m => m.HomePageModule), 
        //canActivate:[AuthGuard]
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule), 
        //canActivate:[noAuthGuard]
      },
      {
        path: 'requests',
        loadChildren: () => import('./request/request.module').then((m) => m.RequestPageModule),
        //canActivate: [AuthGuard],
      },
      {
        path: 'users',
        loadChildren: () => import('./users/users.module').then( m => m.UsersPageModule),
        //canActivate: [AuthGuard],
      },
      {
        path: 'borrowed-products',
        loadChildren: () => import('./borrowed-products/borrowed-products.module').then( m => m.BorrowedProductsPageModule)
      },
    ]
  },
  

  

  

 

  

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainPageRoutingModule {}
