import { Component, inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss'],
})
export class UserModalComponent  implements OnInit {

  @Input() user: User;
  @Input() viewOnly = false;

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  form = new FormGroup({
    uid: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    image: new FormControl(''),
    rol: new FormControl('', Validators.required),
  });

  ngOnInit() {
    if (this.user) {
      // Cargar los datos del usuario en el formulario
      this.form.patchValue(this.user);
    }
  }

  async submit() {
    if (this.form.valid && !this.viewOnly) {
      const path = `users/${this.form.value.uid}`;
      await this.firebaseSvc.UpdateDocument(path, this.form.value);
      this.utilsSvc.presentToast({
        message: 'Usuario actualizado exitosamente',
        color: 'success',
        duration: 2500,

      });
      this.utilsSvc.dismissModal(true); // Cierra el modal y pasa "true" para indicar éxito
    }
  }
}