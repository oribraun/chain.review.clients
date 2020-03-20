import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maxAfterDot'
})
export class MaxAfterDotPipe implements PipeTransform {

  transform(value: any, numberAfterDot: number): any {
    var arr = value.toString().split('.');
    var decimalLength = 0;
    if(arr[1]) {
      decimalLength = arr[1].length;
    }
    if(decimalLength && decimalLength > numberAfterDot) {
      var num = arr[0];
      var decimal = arr[1].substr(0, numberAfterDot);
      value = parseFloat(num + '.' + decimal);
    }
    return value;
  }

}
