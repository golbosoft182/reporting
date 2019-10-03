import { Pipe, PipeTransform } from '@angular/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({name: 'ArrayPipe'})
export class ClientArrayPipe implements PipeTransform {
  transform(items: any[], name: string): number {
        if(items!=null){
            var result=items.find(function(item){ 
                return item.name === name;
            });
            return result == null?0:result.value;
        }
        
  }
}