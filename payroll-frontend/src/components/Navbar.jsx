import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Drawer from "@mui/material/Drawer";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import Sidemenu from "./Sidemenu";

// Iconos familiares para cada sección
import PeopleIcon from "@mui/icons-material/People";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import EventIcon from "@mui/icons-material/Event";
import AssessmentIcon from "@mui/icons-material/Assessment";
import HomeIcon from "@mui/icons-material/Home";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  
  // Estados para los menús desplegables
  const [clientesAnchorEl, setClientesAnchorEl] = useState(null);
  const [kartsAnchorEl, setKartsAnchorEl] = useState(null);
  const [reservasAnchorEl, setReservasAnchorEl] = useState(null);
  const [reportesAnchorEl, setReportesAnchorEl] = useState(null);

  // Handlers para los menús desplegables
  const handleClientesMenuOpen = (event) => {
    setClientesAnchorEl(event.currentTarget);
  };

  const handleKartsMenuOpen = (event) => {
    setKartsAnchorEl(event.currentTarget);
  };

  const handleReservasMenuOpen = (event) => {
    setReservasAnchorEl(event.currentTarget);
  };

  const handleReportesMenuOpen = (event) => {
    setReportesAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setClientesAnchorEl(null);
    setKartsAnchorEl(null);
    setReservasAnchorEl(null);
    setReportesAnchorEl(null);
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menú principal"
            onClick={toggleDrawer(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Sistema de Gestión de Karting
          </Typography>

          {/* Botón Inicio */}
          <Button 
            color="inherit" 
            onClick={() => navigate("/home")}
            startIcon={<HomeIcon />}
            sx={{ mr: 1 }}
          >
            Inicio
          </Button>

          {/* Menú Clientes */}
          <Button
            color="inherit"
            onClick={handleClientesMenuOpen}
            endIcon={<ArrowDropDownIcon />}
            startIcon={<PeopleIcon />}
            sx={{ mr: 1 }}
          >
            Clientes
          </Button>
          <Menu
            anchorEl={clientesAnchorEl}
            open={Boolean(clientesAnchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => { navigate("/clientes/list"); handleMenuClose(); }}>
              Ver Todos los Clientes
            </MenuItem>
            <MenuItem onClick={() => { navigate("/clientes/add"); handleMenuClose(); }}>
              Registrar Nuevo Cliente
            </MenuItem>
          </Menu>

          {/* Menú Go-Karts */}
          <Button
            color="inherit"
            onClick={handleKartsMenuOpen}
            endIcon={<ArrowDropDownIcon />}
            startIcon={<DirectionsCarIcon />}
            sx={{ mr: 1 }}
          >
            Go-Karts
          </Button>
          <Menu
            anchorEl={kartsAnchorEl}
            open={Boolean(kartsAnchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => { navigate("/karts/list"); handleMenuClose(); }}>
              Ver Todos los Go-Karts
            </MenuItem>
            <MenuItem onClick={() => { navigate("/karts/add"); handleMenuClose(); }}>
              Registrar Nuevo Go-Kart
            </MenuItem>
          </Menu>

          {/* Menú Reservas */}
          <Button
            color="inherit"
            onClick={handleReservasMenuOpen}
            endIcon={<ArrowDropDownIcon />}
            startIcon={<EventIcon />}
            sx={{ mr: 1 }}
          >
            Reservas
          </Button>
          <Menu
            anchorEl={reservasAnchorEl}
            open={Boolean(reservasAnchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => { navigate("/reservas/list"); handleMenuClose(); }}>
              Ver Todas las Reservas
            </MenuItem>
            <MenuItem onClick={() => { navigate("/reservas/add"); handleMenuClose(); }}>
              Crear Nueva Reserva
            </MenuItem>
            <MenuItem onClick={() => { navigate("/rack-semanal"); handleMenuClose(); }}>
              Calendario Semanal
            </MenuItem>
          </Menu>

          {/* Menú Reportes */}
          <Button
            color="inherit"
            onClick={handleReportesMenuOpen}
            endIcon={<ArrowDropDownIcon />}
            startIcon={<AssessmentIcon />}
          >
            Informes
          </Button>
          <Menu
            anchorEl={reportesAnchorEl}
            open={Boolean(reportesAnchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => { navigate("/reporte-ingresos-personas"); handleMenuClose(); }}>
              Ingresos por Cantidad de Personas
            </MenuItem>
            <MenuItem onClick={() => { navigate("/reporte-ingresos-vueltas"); handleMenuClose(); }}>
              Ingresos por Cantidad de Vueltas
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Sidemenu open={drawerOpen} toggleDrawer={toggleDrawer} />
      </Drawer>
    </>
  );
}
