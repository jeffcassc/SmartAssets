export interface User {
    uid: string,
    email: string,
    password: string,
    name: string,
    image: string,
    rol: 'admin' | 'user' ;

}
