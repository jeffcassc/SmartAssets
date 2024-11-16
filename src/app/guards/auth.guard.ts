import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, GuardResult, MaybeAsync, RouterStateSnapshot, UrlTree } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { Observable } from 'rxjs';
import { UtilsService } from '../services/utils.service';

@Injectable({
  providedIn: 'root'  // Hace que el guard esté disponible globalmente
})

export class AuthGuard implements CanActivate{
  firebaseSvc = inject(FirebaseService);
  utilsSVc = inject(UtilsService)
  
  canActivate(
    router:ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean| UrlTree {

      let user =localStorage.getItem('user')

      return new Promise((resolve) => {

        this.firebaseSvc.getAuth().onAuthStateChanged((auth) => {
          if (auth) {
            if (user) resolve(true);
          }
          else {
            this.firebaseSvc.signOut();
            resolve(false);
          }
        })
      });
    }
  
}