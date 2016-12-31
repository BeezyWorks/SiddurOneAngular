import { Injectable } from '@angular/core';

@Injectable()
export class UserPrefsService {

nuschos: Nusach[]=[
  {key: 'ashkenaz', hebrewTitle: 'אשכנז'},
  {key: 'sfard', hebrewTitle: 'ספרד'},
  {key: 'mizrach', hebrewTitle: 'עדות המזרח'}
]

userNusach: Nusach = this.nuschos[0];
wedding: boolean = false;
  constructor() { }

}

export class Nusach{
  key: string;
  hebrewTitle: string;
}
