import { FirebaseListObservable } from 'angularfire2';

export class Tefila {
    name: string;
    subRoutes: string[] = [];
    firebaseRefs: FirebaseListObservable<any>[]=[]; 
}