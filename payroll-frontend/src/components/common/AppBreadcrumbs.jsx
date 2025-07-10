import React from 'react';
import { Breadcrumbs, Link, Typography, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const AppBreadcrumbs = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const pathMap = {
    '/home': 'Inicio',
    '/clientes': 'Clientes',
    '/clientes/list': 'Lista de Clientes',
    '/clientes/add': 'Registrar Cliente',
    '/karts': 'Go-Karts',
    '/karts/list': 'Lista de Go-Karts',
    '/karts/add': 'Registrar Go-Kart',
    '/reservas': 'Reservas',
    '/reservas/list': 'Lista de Reservas',
    '/reservas/add': 'Nueva Reserva',
    '/rack-semanal': 'Calendario Semanal',
    '/reportes': 'Informes',
    '/reporte-ingresos-personas': 'Ingresos por Personas',
    '/reporte-ingresos-vueltas': 'Ingresos por Vueltas'
  };

  const generateBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    
    if (pathnames.length === 0) {
      return [{ label: 'Inicio', path: '/home', isLast: true }];
    }

    const breadcrumbs = [
      { label: 'Inicio', path: '/home', isLast: false }
    ];

    let currentPath = '';
    pathnames.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathnames.length - 1;
      const label = pathMap[currentPath] || segment;
      
      breadcrumbs.push({
        label,
        path: currentPath,
        isLast
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="navegación"
      >
        {breadcrumbs.map((crumb, index) => (
          crumb.isLast ? (
            <Typography key={index} color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
              {index === 0 && <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />}
              {crumb.label}
            </Typography>
          ) : (
            <Link
              key={index}
              underline="hover"
              color="inherit"
              onClick={() => navigate(crumb.path)}
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                cursor: 'pointer',
                '&:hover': { color: 'primary.main' }
              }}
            >
              {index === 0 && <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />}
              {crumb.label}
            </Link>
          )
        ))}
      </Breadcrumbs>
    </Box>
  );
};

export default AppBreadcrumbs;