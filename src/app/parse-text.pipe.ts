import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parseText'
})
export class ParseTextPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    console.log(value);
    return null;
  }

}
