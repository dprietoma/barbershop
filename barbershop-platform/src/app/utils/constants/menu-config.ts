export const MENU_BY_ROLE = {
    admin: [
        { title: 'Dashboard', path: '/admin/dashboard', icon: 'bi bi-grid' },
        { title: 'Usuarios', path: '/admin/users', icon: 'bi bi-people' },
        { title: 'Servicios', path: '/admin/services', icon: 'bi bi-scissors' },
        { title: 'Configuración', path: '/admin/settings', icon: 'bi bi-gear' }
    ],
    barber: [
        { title: 'Mi Agenda', path: '/admin/schedule', icon: 'bi bi-calendar-check fs-4' },
        { title: 'Perfil', path: '/admin/profile', icon: 'bi bi-person fs-4' }
    ]
};
