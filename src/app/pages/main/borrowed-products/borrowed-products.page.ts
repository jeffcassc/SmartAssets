import { Component, inject, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Request } from 'src/app/models/request';

@Component({
  selector: 'app-borrowed-products',
  templateUrl: './borrowed-products.page.html',
  styleUrls: ['./borrowed-products.page.scss'],
})
export class BorrowedProductsPage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  loading: boolean = false;

  borrowedRequests: any[] = []; // Incluye datos del producto e información de la solicitud
  userName: string = '';
  intervalId: any;

  ngOnInit() {
    const user = this.utilsSvc.getFromLocalStorage('user');
    this.userName = user?.name || '';
    this.getBorrowedProducts();
  }

  // Obtener los productos prestados y sus datos
  async getBorrowedProducts() {
    const path = 'requests';
    
    // Obtén los datos desde Firebase
    this.firebaseSvc.getCollectionData(path).subscribe((data: any[]) => {
      // Mapea los datos al tipo Request
      const requests: Request[] = data.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.productName,
        userName: item.userName,
        area: item.area,
        duration: item.duration,
        requestDate: item.requestDate.toDate ? item.requestDate.toDate() : new Date(item.requestDate), // Convierte si es necesario
        status: item.status,
      }));
  
      // Filtra las solicitudes del usuario con estado "aceptada"
      const userRequests = requests.filter(
        (req) => req.userName === this.userName && req.status === 'aceptada'
      );
  
      // Obtiene los datos del producto para cada solicitud
      const promises = userRequests.map(async (req) => {
        const product = await this.firebaseSvc.getDocument(`products/${req.productId}`);
        return {
          ...req,
          product, // Adjunta los datos del producto
        };
      });
  
      Promise.all(promises).then((results) => {
        this.borrowedRequests = results;
        this.startCountdown(); // Inicia la cuenta regresiva
      });
    });
  }
  
  // Iniciar cuenta regresiva
  startCountdown() {
    this.intervalId = setInterval(() => {
      this.borrowedRequests.forEach((req) => {
        const elapsedTime = Math.floor(
          (new Date().getTime() - new Date(req.requestDate).getTime()) / 3600000
        );
        req.remainingTime = Math.max(req.duration - elapsedTime, 0); // Calcula el tiempo restante
      });
    }, 60000); // Actualiza cada minuto
  }

  // Devolver producto
  async returnProduct(request: any) {
    const productPath = `products/${request.productId}`;
    const requestPath = `requests/${request.id}`;
    try {
      // Actualiza el producto a su estado original
      await this.firebaseSvc.UpdateDocument(productPath, {
        state: 'sin prestar',
        borrowedBy: 'nadie',
      });

      // Cambia el estado de la solicitud a "finalizado"
      await this.firebaseSvc.UpdateDocument(requestPath, { status: 'finalizado' });

      this.utilsSvc.presentToast({
        message: 'Producto devuelto exitosamente',
        color: 'success',
        duration: 2000,
      });

      this.getBorrowedProducts(); // Refresca la lista
    } catch (error) {
      console.error('Error al devolver el producto:', error);
      this.utilsSvc.presentToast({
        message: 'Error al devolver el producto',
        color: 'danger',
        duration: 2000,
      });
    }
  }

  ngOnDestroy() {
    clearInterval(this.intervalId); // Detener el contador al destruir la página
  }
}
