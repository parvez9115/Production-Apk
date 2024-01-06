import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'deviceFilter',
})
export class DeviceFilterPipe implements PipeTransform {
  transform(items: any[], terms: string): any[] {
    if (!items) return [];
    if (!terms) return items;
    terms = terms.toLowerCase();
    return items.filter((it) => {
      if (it != null) {
        return it
          .replace(/ /g, '')
          .toLowerCase()
          .includes(terms.replace(/ /g, ''));
      } else return false;
    });
  }
}