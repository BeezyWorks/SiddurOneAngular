import { FirebaseListObservable } from 'angularfire2';

export class Tefila {
    title: string;
    subRoutes: string[] = [];
    firebaseRefs: FirebaseListObservable<any>[]=[]; 
}