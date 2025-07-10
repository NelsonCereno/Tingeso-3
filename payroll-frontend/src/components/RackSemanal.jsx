import React, { useState, useEffect } from "react";
import reservaService from "../services/reserva.service";
import { format, startOfWeek, addDays } from "date-fns";
import { es } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Chip
} from "@mui/material";
import CalendarViewWeekIcon from "@mui/icons-material/CalendarViewWeek";
import RefreshIcon from "@mui/icons-material/Refresh";
import AppBreadcrumbs from "./common/AppBreadcrumbs";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const RackSemanal = () => {
  const [rackSemanal, setRackSemanal] = useState({});
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentWeekDates, setCurrentWeekDates] = useState([]);
  const [lastLoadedWeek, setLastLoadedWeek] = useState("");

  const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  const bloquesHorario = [
    "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", 
    "14:00-15:00", "15:00-16:00", "16:00-17:00"
  ];

  useEffect(() => {
    loadRackSemanal(selectedDate);
  }, []);

  const loadRackSemanal = (date) => {
    setLoading(true);
    setError(null);
    
    const selectedDateObj = new Date(date);
    const startOfWeekDate = startOfWeek(selectedDateObj, { weekStartsOn: 1 });
    const endOfWeekDate = addDays(startOfWeekDate, 6);

    const fechaInicio = format(startOfWeekDate, 'yyyy-MM-dd');
    const fechaFin = format(endOfWeekDate, 'yyyy-MM-dd');

    // Generar fechas de la semana
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      weekDates.push(addDays(startOfWeekDate, i));
    }
    setCurrentWeekDates(weekDates);
    setLastLoadedWeek(`${fechaInicio} - ${fechaFin}`);

    reservaService
      .getRackSemanal(fechaInicio, fechaFin)
      .then((response) => {
        setRackSemanal(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error al cargar el rack semanal. Por favor intenta nuevamente.");
        setLoading(false);
        console.error("Error al cargar el rack semanal:", error);
      });
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleLoadWeek = () => {
    if (!selectedDate) {
      setError("Por favor selecciona una fecha válida.");
      return;
    }
    loadRackSemanal(selectedDate);
  };

  const formatDayHeader = (date) => {
    return format(date, 'dd/MM', { locale: es });
  };

  const getReservaInfo = (dia, bloque) => {
    const reservas = rackSemanal[dia]?.[bloque] || [];
    if (reservas.length === 0) {
      return { disponible: true, info: "Disponible" };
    }
    
    return {
      disponible: false,
      info: reservas.map(r => `Reserva #${r.id} - ${r.clientes.length} cliente(s)`).join(", ")
    };
  };

  return (
    <Box>
      <AppBreadcrumbs />
      
      <Box sx={{ p: 3 }}>
        {/* Header con botón volver */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/reservas/list")}
            sx={{ mr: 2 }}
            variant="outlined"
          >
            Volver a Reservas
          </Button>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 0 }}>
            <CalendarViewWeekIcon sx={{ mr: 2 }} />
            Calendario Semanal
          </Typography>
        </Box>

        {/* Controles de fecha */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <TextField
                label="Seleccionar fecha"
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                InputLabelProps={{ shrink: true }}
                disabled={loading}
                sx={{ minWidth: 200 }}
              />
              <Button
                variant="contained"
                onClick={handleLoadWeek}
                disabled={loading || !selectedDate}
                startIcon={loading ? <CircularProgress size={20} /> : <RefreshIcon />}
              >
                {loading ? "Cargando..." : "Cargar Semana"}
              </Button>
              {lastLoadedWeek && (
                <Chip 
                  label={`Semana: ${lastLoadedWeek}`} 
                  variant="outlined" 
                  color="primary"
                />
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Estados de carga y error */}
        {loading && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Cargando información del rack semanal...
            </Box>
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Tabla del rack */}
        {!loading && currentWeekDates.length > 0 && (
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }}>
                    Horario
                  </TableCell>
                  {diasSemana.map((dia, index) => (
                    <TableCell 
                      key={dia} 
                      align="center" 
                      sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }}
                    >
                      {dia}
                      <br />
                      <Typography variant="caption">
                        {formatDayHeader(currentWeekDates[index])}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {bloquesHorario.map((bloque) => (
                  <TableRow key={bloque}>
                    <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }}>
                      {bloque}
                    </TableCell>
                    {diasSemana.map((dia, index) => {
                      const reservaInfo = getReservaInfo(dia, bloque);
                      return (
                        <TableCell 
                          key={`${dia}-${bloque}`} 
                          align="center"
                          sx={{
                            backgroundColor: reservaInfo.disponible 
                              ? 'success.light' 
                              : 'warning.light',
                            color: reservaInfo.disponible 
                              ? 'success.contrastText' 
                              : 'warning.contrastText'
                          }}
                        >
                          <Typography variant="body2">
                            {reservaInfo.info}
                          </Typography>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Estado vacío */}
        {!loading && !error && currentWeekDates.length === 0 && (
          <Alert severity="info" sx={{ textAlign: 'center' }}>
            Selecciona una fecha y haz clic en "Cargar Semana" para ver el rack semanal.
          </Alert>
        )}

        {/* Leyenda */}
        {!loading && currentWeekDates.length > 0 && (
          <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Chip 
              label="Disponible" 
              sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}
            />
            <Chip 
              label="Ocupado" 
              sx={{ bgcolor: 'warning.light', color: 'warning.contrastText' }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default RackSemanal;