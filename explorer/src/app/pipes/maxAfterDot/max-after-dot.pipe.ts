import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maxAfterDot'
})
export class MaxAfterDotPipe implements PipeTransform {

  transform(value: any, numberAfterDot: number): any {
    var num = Math.pow(10, numberAfterDot);
    var decimal = this.exponentialToDecimal(Math.round(value * num)/num);
    // var decimalAfterDot = decimal.substr(decimal.indexOf('.') + 1, decimal.length);
    // var arr = decimal.toString().split('.');
    // var decimalLength = 0;
    // if(arr[1]) {
    //   decimalLength = arr[1].length;
    // }
    // if(decimalLength && decimalLength > numberAfterDot) {
    //   var num = arr[0];
    //   var decimal = arr[1].substr(0, numberAfterDot);
    //   value = (num + '.' + decimal);
    // }
    return decimal;
  }

  exponentialToDecimal(exponential) {
    let decimal = exponential.toString().toLowerCase();
    if (decimal.includes('e+')) {
      const exponentialSplitted = decimal.split('e+');
      let postfix = '';
      for (
        let i = 0;
        i <
        +exponentialSplitted[1] -
        (exponentialSplitted[0].includes('.') ? exponentialSplitted[0].split('.')[1].length : 0);
        i++
      ) {
        postfix += '0';
      }
      const addCommas = text => {
        let j = 3;
        let textLength = text.length;
        while (j < textLength) {
          // text = `${text.slice(0, textLength - j)},${text.slice(textLength - j, textLength)}`;
          text = `${text.slice(0, textLength - j)}${text.slice(textLength - j, textLength)}`;
          textLength++;
          j += 3 + 1;
        }
        return text;
      };
      decimal = addCommas(exponentialSplitted[0].replace('.', '') + postfix);
    }
    if (decimal.toLowerCase().includes('e-')) {
      const exponentialSplitted = decimal.split('e-');
      let prefix = '0.';
      for (let i = 0; i < +exponentialSplitted[1] - 1; i++) {
        prefix += '0';
      }
      decimal = prefix + exponentialSplitted[0].replace('.', '');
    }
    return decimal;
  };

}
