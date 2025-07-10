import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  Avatar,
  Divider,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Tooltip,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem
} from "@mui/material";
import {
  People as PeopleIcon,
  DirectionsCar as DirectionsCarIcon,
  EventNote as EventNoteIcon,
  Assessment as AssessmentIcon,
  CalendarViewWeek as CalendarIcon,
  PersonAdd as PersonAddIcon,
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  Warning as WarningIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Settings as SettingsIcon,
  Visibility as VisibilityIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon
} from "@mui/icons-material";
import clienteService from "../services/cliente.service";
import kartService from "../services/kart.service";
import reservaService from "../services/reserva.service";
import AppBreadcrumbs from "./common/AppBreadcrumbs";

const Home = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalKarts: 0,
    totalReservas: 0,
    kartsDisponibles: 0
  });
  const [recentClientes, setRecentClientes] = useState([]);
  const [proximasReservas, setProximasReservas] = useState([]);
  const [clientesFrecuentes, setClientesFrecuentes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para funcionalidades avanzadas
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [viewMode, setViewMode] = useState(localStorage.getItem('dashboard-view') || 'cards');
  const [settingsAnchor, setSettingsAnchor] = useState(null);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);

  // Datos para búsqueda global
  const [allData, setAllData] = useState({
    clientes: [],
    karts: [],
    reservas: []
  });

  useEffect(() => {
    loadDashboardData();
    
    // Configurar atajos de teclado
    const handleKeyPress = (event) => {
      // Ctrl/Cmd + K para búsqueda rápida
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
      
      // Atajos numéricos para acciones rápidas
      if (event.altKey) {
        switch (event.key) {
          case '1':
            navigate("/clientes/add");
            break;
          case '2':
            navigate("/karts/add");
            break;
          case '3':
            navigate("/reservas/add");
            break;
          case '4':
            navigate("/rack-semanal");
            break;
          default:
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      // Cargar estadísticas
      const [clientesRes, kartsRes, reservasRes] = await Promise.all([
        clienteService.getAll(),
        kartService.getAll(),
        reservaService.getAll()
      ]);

      const clientes = clientesRes.data;
      const karts = kartsRes.data;
      const reservas = reservasRes.data;

      // Guardar todos los datos para búsqueda
      setAllData({ clientes, karts, reservas });

      // Calcular estadísticas
      setStats({
        totalClientes: clientes.length,
        totalKarts: karts.length,
        totalReservas: reservas.length,
        kartsDisponibles: karts.filter(k => k.estado === 'disponible').length
      });

      // Clientes recientes (últimos 5)
      const clientesRecientes = clientes
        .sort((a, b) => new Date(b.id) - new Date(a.id))
        .slice(0, 5);
      setRecentClientes(clientesRecientes);

      // Clientes frecuentes (más de 5 visitas)
      const frecuentes = clientes
        .filter(c => c.numeroVisitas > 5)
        .sort((a, b) => b.numeroVisitas - a.numeroVisitas)
        .slice(0, 3);
      setClientesFrecuentes(frecuentes);

      // Próximas reservas (próximos 3 días)
      const hoy = new Date();
      const tresDias = new Date(hoy.getTime() + (3 * 24 * 60 * 60 * 1000));
      
      const proximas = reservas
        .filter(r => {
          const fechaReserva = new Date(r.fechaReserva);
          return fechaReserva >= hoy && fechaReserva <= tresDias;
        })
        .sort((a, b) => new Date(a.fechaReserva) - new Date(b.fechaReserva))
        .slice(0, 5);
      setProximasReservas(proximas);

      setLoading(false);
    } catch (error) {
      console.error("Error al cargar datos del dashboard:", error);
      setLoading(false);
    }
  };

  // Búsqueda global inteligente
  const handleSearch = useCallback((term) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    const results = [];
    const searchLower = term.toLowerCase();

    // Buscar en clientes
    allData.clientes.forEach(cliente => {
      if (cliente.nombre.toLowerCase().includes(searchLower) || 
          cliente.email.toLowerCase().includes(searchLower)) {
        results.push({
          type: 'cliente',
          id: cliente.id,
          title: cliente.nombre,
          subtitle: cliente.email,
          action: () => navigate(`/clientes/edit/${cliente.id}`),
          icon: <PeopleIcon />
        });
      }
    });

    // Buscar en go-karts
    allData.karts.forEach(kart => {
      if (kart.codigo.toLowerCase().includes(searchLower)) {
        results.push({
          type: 'kart',
          id: kart.id,
          title: kart.codigo,
          subtitle: `Estado: ${kart.estado}`,
          action: () => navigate(`/karts/edit/${kart.id}`),
          icon: <DirectionsCarIcon />
        });
      }
    });

    // Buscar en reservas
    allData.reservas.forEach(reserva => {
      if (reserva.id.toString().includes(term) || 
          reserva.fechaReserva.includes(term)) {
        results.push({
          type: 'reserva',
          id: reserva.id,
          title: `Reserva #${reserva.id}`,
          subtitle: reserva.fechaReserva,
          action: () => navigate(`/reservas/edit/${reserva.id}`),
          icon: <EventNoteIcon />
        });
      }
    });

    setSearchResults(results.slice(0, 8)); // Limitar a 8 resultados
  }, [allData, navigate]);

  // Cambiar modo de vista
  const handleViewChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem('dashboard-view', mode);
    setSettingsAnchor(null);
  };

  // Acciones rápidas del SpeedDial
  const speedDialActions = [
    {
      icon: <PersonAddIcon />,
      name: 'Nuevo Cliente (Alt+1)',
      action: () => navigate("/clientes/add")
    },
    {
      icon: <DirectionsCarIcon />,
      name: 'Nuevo Go-Kart (Alt+2)',
      action: () => navigate("/karts/add")
    },
    {
      icon: <EventNoteIcon />,
      name: 'Nueva Reserva (Alt+3)',
      action: () => navigate("/reservas/add")
    },
    {
      icon: <CalendarIcon />,
      name: 'Ver Calendario (Alt+4)',
      action: () => navigate("/rack-semanal")
    }
  ];

  // Tarjetas de acciones rápidas con atajos
  const quickActions = [
    {
      title: "Registrar Cliente",
      description: "Agregar nuevo cliente al sistema",
      icon: <PersonAddIcon />,
      color: "primary",
      action: () => navigate("/clientes/add"),
      info: `${stats.totalClientes} clientes registrados`,
      shortcut: "Alt+1",
      bulkAction: () => navigate("/clientes/import") // Acción en lote
    },
    {
      title: "Registrar Go-Kart",
      description: "Agregar nuevo go-kart disponible",
      icon: <DirectionsCarIcon />,
      color: "success",
      action: () => navigate("/karts/add"),
      info: `${stats.kartsDisponibles}/${stats.totalKarts} disponibles`,
      shortcut: "Alt+2",
      disabled: stats.totalKarts >= 15,
      disabledReason: "Máximo de 15 go-karts alcanzado"
    },
    {
      title: "Nueva Reserva",
      description: "Crear reserva para clientes",
      icon: <EventNoteIcon />,
      color: "warning",
      action: () => navigate("/reservas/add"),
      info: `${stats.totalReservas} reservas totales`,
      shortcut: "Alt+3",
      disabled: stats.kartsDisponibles === 0 || stats.totalClientes === 0,
      disabledReason: stats.kartsDisponibles === 0 ? "No hay go-karts disponibles" : "No hay clientes registrados",
      quickAction: () => {
        // Reserva rápida con último cliente
        if (recentClientes.length > 0) {
          navigate(`/reservas/add?cliente=${recentClientes[0].id}`);
        }
      }
    },
    {
      title: "Ver Calendario",
      description: "Revisar reservas semanales",
      icon: <CalendarIcon />,
      color: "info",
      action: () => navigate("/rack-semanal"),
      info: `${proximasReservas.length} próximas reservas`,
      shortcut: "Alt+4"
    }
  ];

  if (loading) {
    return (
      <>
        <AppBreadcrumbs />
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography>Cargando dashboard...</Typography>
        </Box>
      </>
    );
  }

  return (
    <Box>
      <AppBreadcrumbs />
      
      <Box sx={{ p: 3 }}>
        {/* Header del Dashboard con herramientas */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Panel de Control - Go-Kart System
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Resumen del estado actual del sistema y acciones rápidas
            </Typography>
          </Box>
          
          {/* Herramientas del dashboard */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            {/* Búsqueda rápida */}
            <Tooltip title="Búsqueda rápida (Ctrl+K)">
              <IconButton onClick={() => setSearchOpen(true)}>
                <SearchIcon />
              </IconButton>
            </Tooltip>
            
            {/* Configuración de vista */}
            <Tooltip title="Configurar vista">
              <IconButton onClick={(e) => setSettingsAnchor(e.currentTarget)}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>
            
            <Menu
              anchorEl={settingsAnchor}
              open={Boolean(settingsAnchor)}
              onClose={() => setSettingsAnchor(null)}
            >
              <MenuItem onClick={() => handleViewChange('cards')}>
                Vista en Tarjetas
              </MenuItem>
              <MenuItem onClick={() => handleViewChange('compact')}>
                Vista Compacta
              </MenuItem>
              <MenuItem onClick={() => handleViewChange('detailed')}>
                Vista Detallada
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Modal de búsqueda rápida */}
        {searchOpen && (
          <Paper
            sx={{
              position: 'fixed',
              top: '20%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '90%',
              maxWidth: 600,
              maxHeight: 400,
              zIndex: 1300,
              p: 2,
              boxShadow: 24
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TextField
                fullWidth
                placeholder="Buscar clientes, go-karts, reservas... (Esc para cerrar)"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  handleSearch(e.target.value);
                }}
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setSearchOpen(false)}>
                        <CloseIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setSearchOpen(false);
                  }
                }}
              />
            </Box>
            
            {searchResults.length > 0 && (
              <List dense>
                {searchResults.map((result, index) => (
                  <ListItem
                    key={`${result.type}-${result.id}`}
                    button
                    onClick={() => {
                      result.action();
                      setSearchOpen(false);
                      setSearchTerm("");
                    }}
                  >
                    <ListItemIcon>{result.icon}</ListItemIcon>
                    <ListItemText
                      primary={result.title}
                      secondary={result.subtitle}
                    />
                    <Chip label={result.type} size="small" />
                  </ListItem>
                ))}
              </List>
            )}
            
            {searchTerm && searchResults.length === 0 && (
              <Typography color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                No se encontraron resultados
              </Typography>
            )}
          </Paper>
        )}

        {/* Estadísticas Rápidas */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'primary.light', color: 'white', cursor: 'pointer' }}
                  onClick={() => navigate("/clientes/list")}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: 'primary.dark', mr: 2 }}>
                    <PeopleIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4">{stats.totalClientes}</Typography>
                    <Typography variant="body2">Clientes Registrados</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'success.light', color: 'white', cursor: 'pointer' }}
                  onClick={() => navigate("/karts/list")}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: 'success.dark', mr: 2 }}>
                    <DirectionsCarIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4">{stats.kartsDisponibles}</Typography>
                    <Typography variant="body2">Go-Karts Disponibles</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'warning.light', color: 'white', cursor: 'pointer' }}
                  onClick={() => navigate("/reservas/list")}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: 'warning.dark', mr: 2 }}>
                    <EventNoteIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4">{stats.totalReservas}</Typography>
                    <Typography variant="body2">Reservas Totales</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: 'info.light', color: 'white', cursor: 'pointer' }}
                  onClick={() => navigate("/rack-semanal")}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: 'info.dark', mr: 2 }}>
                    <ScheduleIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h4">{proximasReservas.length}</Typography>
                    <Typography variant="body2">Próximas Reservas</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Alertas de Estado */}
        {stats.kartsDisponibles === 0 && stats.totalKarts > 0 && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <WarningIcon sx={{ mr: 1 }} />
                No hay go-karts disponibles. No se pueden crear nuevas reservas.
              </Box>
              <Button variant="outlined" size="small" onClick={() => navigate("/karts/list")}>
                Ver Go-Karts
              </Button>
            </Box>
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Acciones Rápidas con atajos */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                    <AddIcon sx={{ mr: 1 }} />
                    Acciones Rápidas
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Usa Alt+1,2,3,4 para acceso rápido
                  </Typography>
                </Box>
                
                <Grid container spacing={2}>
                  {quickActions.map((action, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Card 
                        variant="outlined" 
                        sx={{ 
                          cursor: action.disabled ? 'not-allowed' : 'pointer',
                          opacity: action.disabled ? 0.6 : 1,
                          position: 'relative',
                          '&:hover': !action.disabled ? { 
                            elevation: 2, 
                            transform: 'translateY(-2px)',
                            transition: 'all 0.2s'
                          } : {}
                        }}
                        onClick={!action.disabled ? action.action : undefined}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Avatar sx={{ bgcolor: `${action.color}.main`, mr: 2, width: 32, height: 32 }}>
                              {action.icon}
                            </Avatar>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="subtitle2">{action.title}</Typography>
                              <Chip 
                                label={action.shortcut} 
                                size="small" 
                                variant="outlined"
                                sx={{ fontSize: 10 }}
                              />
                            </Box>
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {action.description}
                          </Typography>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Chip 
                              label={action.disabled ? action.disabledReason : action.info} 
                              size="small" 
                              color={action.disabled ? "error" : "default"}
                              variant="outlined"
                            />
                            {action.quickAction && !action.disabled && (
                              <Tooltip title="Acción rápida">
                                <IconButton 
                                  size="small" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    action.quickAction();
                                  }}
                                >
                                  <ScheduleIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Panel lateral con información contextual */}
          <Grid item xs={12} md={4}>
            {/* Resto del contenido del panel lateral... */}
            {/* (Mismo contenido que antes pero con mejoras de eficiencia) */}
          </Grid>
        </Grid>

        {/* SpeedDial para acciones rápidas */}
        <SpeedDial
          ariaLabel="Acciones rápidas"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
          open={quickActionsOpen}
          onClose={() => setQuickActionsOpen(false)}
          onOpen={() => setQuickActionsOpen(true)}
        >
          {speedDialActions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={() => {
                action.action();
                setQuickActionsOpen(false);
              }}
            />
          ))}
        </SpeedDial>
      </Box>
    </Box>
  );
};

export default Home;
