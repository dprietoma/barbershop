export const MENU_BY_ROLE = {
    admin: [
        { title: 'Colaboradores', path: '/admin/collaborators', icon: 'bi bi-people-fill fs-4' },
        { title: 'Citas', path: '/admin/appointments', icon: 'bi bi-calendar-check fs-4' },
        { title: 'Turnos y Pausas', path: '/admin/shifts', icon: 'bi bi-person-workspace fs-4' },
        { title: 'Servicios', path: '/admin/servicios', icon: 'bi bi-scissors fs-4' },
    ],
    barber: [
        { title: 'Citas', path: '/barbers/appointments', icon: 'bi bi-calendar-check fs-4' },
        { title: 'Historial de Citas', path: '/admin/history', icon: 'bi bi-clock-history fs-4' },
        { title: 'Mi Agenda', path: '/admin/appointments', icon: 'bi bi-calendar-check fs-4' },
    ]
};
