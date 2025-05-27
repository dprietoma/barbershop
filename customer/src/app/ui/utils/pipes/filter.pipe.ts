import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter',
    standalone: true
})
export class FilterPipe implements PipeTransform {
    transform(lista: any[], campo: string, texto: string): any[] {
        if (!lista || !campo || !texto) return lista;
        return lista.filter(item =>
            item[campo].toLowerCase().includes(texto.toLowerCase())
        );
    }
}
