import { Pipe, PipeTransform } from '@angular/core';
import { Suggestion } from '../../core/models/suggestions.interface';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform(value: Suggestion[], searchWord: string): Suggestion[] {
    return value.filter((item) =>
      item.name.toLocaleLowerCase().includes(searchWord.toLocaleLowerCase()),
    );
  }
}
