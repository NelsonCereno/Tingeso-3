import React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

// Iconos familiares del mundo real
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AddIcon from "@mui/icons-material/Add";
import EventIcon from "@mui/icons-material/Event";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CalendarViewWeekIcon from "@mui/icons-material/CalendarViewWeek";
import AssessmentIcon from "@mui/icons-material/Assessment";
import GroupIcon from "@mui/icons-material/Group";
import SpeedIcon from "@mui/icons-material/Speed";

const Sidemenu = ({ open, toggleDrawer }) => {
  const navigate = useNavigate();

  const menuItems = [
    {
      section: "Principal",
      items: [
        { 
          text: "Página Principal", 
          icon: <HomeIcon />, 
          path: "/home",
          description: "Ir al inicio del sistema"
        }
      ]
    },
    {
      section: "Gestión de Clientes",
      items: [
        { 
          text: "Lista de Clientes", 
          icon: <PeopleIcon />, 
          path: "/clientes/list",
          description: "Ver todos los clientes registrados"
        },
        { 
          text: "Registrar Cliente", 
          icon: <PersonAddIcon />, 
          path: "/clientes/add",
          description: "Agregar un nuevo cliente"
        }
      ]
    },
    {
      section: "Gestión de Go-Karts",
      items: [
        { 
          text: "Lista de Go-Karts", 
          icon: <DirectionsCarIcon />, 
          path: "/karts/list",
          description: "Ver todos los go-karts disponibles"
        },
        { 
          text: "Registrar Go-Kart", 
          icon: <AddIcon />, 
          path: "/karts/add",
          description: "Agregar un nuevo go-kart"
        }
      ]
    },
    {
      section: "Gestión de Reservas",
      items: [
        { 
          text: "Lista de Reservas", 
          icon: <EventIcon />, 
          path: "/reservas/list",
          description: "Ver todas las reservas realizadas"
        },
        { 
          text: "Nueva Reserva", 
          icon: <EventAvailableIcon />, 
          path: "/reservas/add",
          description: "Crear una nueva reserva"
        },
        { 
          text: "Calendario Semanal", 
          icon: <CalendarViewWeekIcon />, 
          path: "/rack-semanal",
          description: "Ver disponibilidad por semana"
        }
      ]
    },
    {
      section: "Informes y Reportes",
      items: [
        { 
          text: "Ingresos por Personas", 
          icon: <GroupIcon />, 
          path: "/reportes/ingresos-personas",
          description: "Reporte de ingresos por cantidad de personas"
        },
        { 
          text: "Ingresos por Vueltas", 
          icon: <SpeedIcon />, 
          path: "/reportes/ingresos-vueltas",
          description: "Reporte de ingresos por cantidad de vueltas"
        }
      ]
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    toggleDrawer(false)();
  };

  return (
    <Box
      sx={{ width: 280 }}
      role="navigation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h6" component="div">
          Menú de Navegación
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          Sistema de Gestión de Karting
        </Typography>
      </Box>

      {menuItems.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
            <Typography variant="subtitle2" color="primary" fontWeight="bold">
              {section.section}
            </Typography>
          </Box>
          
          <List disablePadding>
            {section.items.map((item, itemIndex) => (
              <ListItem key={itemIndex} disablePadding>
                <ListItemButton 
                  onClick={() => handleNavigation(item.path)}
                  sx={{ 
                    py: 1.5,
                    '&:hover': {
                      bgcolor: 'primary.light',
                      color: 'white',
                      '& .MuiListItemIcon-root': {
                        color: 'white'
                      }
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    secondary={item.description}
                    secondaryTypographyProps={{
                      variant: 'caption',
                      color: 'text.secondary'
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          
          {sectionIndex < menuItems.length - 1 && <Divider />}
        </div>
      ))}
    </Box>
  );
};

export default Sidemenu;
