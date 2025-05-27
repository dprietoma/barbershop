import Swal, { SweetAlertIcon } from 'sweetalert2';

export class ShowAlert {
    static viewAlert(title: string, text: string, icon: SweetAlertIcon): void {
        Swal.fire({
            title: title,
            text: text,
            icon: icon
        });
    }
}
