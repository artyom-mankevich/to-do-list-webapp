import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateTransformer'
})
export class DateTransformerPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): string {
    return new Date(value).toLocaleString();
  }

}
