import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { User } from '../models/user';

import { AngularFirestore } from '@angular/fire/compat/firestore';

import { getFirestore, setDoc, doc, getDoc, addDoc, collection, collectionData, query,updateDoc, deleteDoc } from '@angular/fire/firestore'
import { UtilsService } from './utils.service';

import { AngularFireStorage } from '@angular/fire/compat/storage'
import { getStorage, uploadString, ref, getDownloadURL, deleteObject } from "firebase/storage"

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore)
  utilsSvc = inject(UtilsService)
  storage = inject(AngularFireStorage)

  //===================autentidicacion=================

  getAuth() {
    return getAuth();
  }
  //comprueba si un usuario esta en la base de datos
  //========Acceder=============
  signIn(user: User) {
    return signInWithEmailAndPassword(getAuth(), user.email, user.password)
  }

  //crear un usuario

  signUp(user: User) {
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password)
  }


  //==========Actualizar usuario========

  updateUser(displayName: string) {
    return updateProfile(getAuth().currentUser, { displayName })

  }
  

  //======== enviar email para restablecer contraseña =========
  sendRecoveryEmail(email: string) {
    return sendPasswordResetEmail(getAuth(), email)
  }

  //============ cerrar sesion ==============
  signOut() {
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/auth')
  }



  //======================base de datos=============

  //=== obtener documento de una colleccion
  getCollectionData(path: string, collectionQuery?: any) {
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, collectionQuery), { idField: 'id' });
  }

  //crear un nuevo documento si no exite y si existe modificarlo
  //======setear documento=========
  setDocument(path: string, data: any) {
    return setDoc(doc(getFirestore(), path), data)
  }

  //actualizar documentos
  UpdateDocument(path: string, data: any) {
    return updateDoc(doc(getFirestore(), path), data)
  }
  //eliminar documentos
  deleteDocument(path: string) {
    return deleteDoc(doc(getFirestore(), path))
  }

  async getDocument(path: string) {
    return (await (getDoc(doc(getFirestore(), path)))).data();
  }
  //========== agregar un documento ========
  addDocument(path: string, data: any) {
    return addDoc(collection(getFirestore(), path), data)
  }

  //============================ almacenamineto ================
  //=========== subir una imagen =======
  async uploadImage(path: string, data_url: string) {
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(() => {
      return getDownloadURL(ref(getStorage(), path))
    })
  }

  // ======= obtener ruta de la imagen con url
  async getfilePath(url: string) {
    return ref(getStorage(), url).fullPath;
  }
  
  //========eliminar archivo===============
  deleteFile(path: string){
    return deleteObject(ref(getStorage(), path))
  }

  
}
