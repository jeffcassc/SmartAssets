export interface Request {
    id?: string; // ID generado por Firebase
    productId: string;
    productName: string;
    userName: string;
    area: string;
    duration: number; // Duración en días
    requestDate: Date;
    status: 'pendiente' | 'aceptada' | 'rechazada'; // Estado de la solicitud
  }
  