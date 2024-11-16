import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, RouterStateSnapshot, UrlTree } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { UtilsService } from '../services/utils.service';
import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'  // Hace que el guard esté disponible globalmente
})

export class noAuthGuard implements CanActivate{
  firebaseSvc = inject(FirebaseService);
  utilsSVc = inject(UtilsService)
  
  canActivate(
    router:ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean| UrlTree {

      

      return new Promise((resolve) => {

        this.firebaseSvc.getAuth().onAuthStateChanged((auth) => {
          if (!auth) resolve(true);
          else {
            this.utilsSVc.routerLink('/main/home');
            resolve(false);
          }
        })
      });
    }
};

