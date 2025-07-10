import React, { useState, useEffect } from "react";
import reservaService from "../services/reserva.service";
import clienteService from "../services/cliente.service";
import kartService from "../services/kart.service";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CancelIcon from "@mui/icons-material/Cancel";
import RefreshIcon from "@mui/icons-material/Refresh";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import ConfirmDialog from "./common/ConfirmDialog";
import AppBreadcrumbs from "./common/AppBreadcrumbs";

const AddEditReserva = () => {
  const [clientes, setClientes] = useState([]);
  const [karts, setKarts] = useState([]);
  const [selectedClientes, setSelectedClientes] = useState([]);
  const [selectedKarts, setSelectedKarts] = useState([]);
  const [numeroVueltas, setNumeroVueltas] = useState("");
  const [fechaReserva, setFechaReserva] = useState("");
  const [horaReserva, setHoraReserva] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const navigate = useNavigate();

  const planes = [
    { id: "10", vueltas: 10, tiempoMaximo: 10, precio: 15000, duracionTotal: 30 },
    { id: "15", vueltas: 15, tiempoMaximo: 15, precio: 20000, duracionTotal: 35 },
    { id: "20", vueltas: 20, tiempoMaximo: 20, precio: 25000, duracionTotal: 40 },
  ];

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = () => {
    setLoadingData(true);
    Promise.all([
      clienteService.getAll(),
      kartService.getAll()
    ])
    .then(([clientesResponse, kartsResponse]) => {
      setClientes(clientesResponse.data);
      setKarts(kartsResponse.data.filter(kart => kart.estado === 'disponible'));
      setLoadingData(false);
    })
    .catch((error) => {
      setError("Error al cargar los datos. Por favor recarga la página.");
      setLoadingData(false);
      console.error("Error al cargar datos:", error);
    });
  };

  const handleFieldChange = (field, value) => {
    setHasUnsavedChanges(true);
    
    switch (field) {
      case 'clientes':
        setSelectedClientes(value);
        break;
      case 'karts':
        setSelectedKarts(value);
        break;
      case 'plan':
        setNumeroVueltas(value);
        break;
      case 'fecha':
        setFechaReserva(value);
        break;
      case 'hora':
        setHoraReserva(value);
        break;
      default:
        break;
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setShowCancelDialog(true);
    } else {
      navigate("/reservas/list");
    }
  };

  const confirmCancel = () => {
    setShowCancelDialog(false);
    navigate("/reservas/list");
  };

  const handleBack = () => {
    navigate("/reservas/list");
  };

  const resetForm = () => {
    setSelectedClientes([]);
    setSelectedKarts([]);
    setNumeroVueltas("");
    setFechaReserva("");
    setHoraReserva("");
    setHasUnsavedChanges(false);
    setError(null);
  };

  const validateForm = () => {
    if (selectedClientes.length === 0) {
      setError("Debes seleccionar al menos un cliente.");
      return false;
    }

    if (selectedKarts.length === 0) {
      setError("Debes seleccionar al menos un go-kart.");
      return false;
    }

    if (selectedClientes.length !== selectedKarts.length) {
      setError("El número de clientes debe coincidir con el número de go-karts seleccionados.");
      return false;
    }

    if (!numeroVueltas) {
      setError("Debes seleccionar un plan de vueltas.");
      return false;
    }

    if (!fechaReserva) {
      setError("Debes seleccionar una fecha para la reserva.");
      return false;
    }

    if (!horaReserva) {
      setError("Debes seleccionar una hora para la reserva.");
      return false;
    }

    // Validar que la fecha no sea en el pasado
    const fechaSeleccionada = new Date(`${fechaReserva}T${horaReserva}`);
    const ahora = new Date();
    
    if (fechaSeleccionada < ahora) {
      setError("No puedes crear una reserva en el pasado.");
      return false;
    }

    return true;
  };

  const saveReserva = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const selectedPlan = planes.find((p) => p.id === numeroVueltas);

    const reserva = {
      clientes: selectedClientes.map((id) => ({ id })),
      karts: selectedKarts.map((id) => ({ id })),
      numeroVueltas: selectedPlan.vueltas,
      tiempoMaximo: selectedPlan.tiempoMaximo,
      precioBase: selectedPlan.precio,
      duracionTotal: selectedPlan.duracionTotal,
      fechaReserva,
      horaReserva,
    };

    reservaService
      .create(reserva)
      .then(() => {
        setLoading(false);
        setSuccess(true);
        setHasUnsavedChanges(false);
        setTimeout(() => navigate("/reservas/list"), 2000);
      })
      .catch((error) => {
        setLoading(false);
        setError("Error al crear la reserva. Por favor intenta nuevamente.");
        console.error("Error al crear la reserva:", error);
      });
  };

  if (loadingData) {
    return (
      <>
        <AppBreadcrumbs />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
          <Box ml={2}>Cargando datos para la reserva...</Box>
        </Box>
      </>
    );
  }

  return (
    <Box>
      <AppBreadcrumbs />
      
      <Box sx={{ p: 3 }}>
        {/* Header con botón volver */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mr: 2 }}
            variant="outlined"
          >
            Volver a Lista
          </Button>
          <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
            <EventAvailableIcon sx={{ mr: 2 }} />
            Crear Nueva Reserva
          </Typography>
        </Box>

        <Card>
          <CardContent>
            <form onSubmit={saveReserva}>
              {loading && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Creando reserva en el sistema...
                </Alert>
              )}
              
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {/* Información de ayuda */}
              <Alert severity="info" sx={{ mb: 2 }}>
                Recuerda: El número de clientes debe coincidir exactamente con el número de go-karts seleccionados.
              </Alert>

              <TextField
                select
                label="Seleccionar Clientes"
                value={selectedClientes}
                onChange={(e) => handleFieldChange('clientes', e.target.value)}
                fullWidth
                margin="normal"
                disabled={loading}
                helperText={`${selectedClientes.length} cliente(s) seleccionado(s)`}
                SelectProps={{
                  multiple: true,
                  renderValue: (selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const cliente = clientes.find(c => c.id === value);
                        return (
                          <Chip key={value} label={cliente?.nombre || value} size="small" />
                        );
                      })}
                    </Box>
                  ),
                }}
              >
                {clientes.map((cliente) => (
                  <MenuItem key={cliente.id} value={cliente.id}>
                    {cliente.nombre} - {cliente.email}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Seleccionar Go-Karts"
                value={selectedKarts}
                onChange={(e) => handleFieldChange('karts', e.target.value)}
                fullWidth
                margin="normal"
                disabled={loading}
                helperText={`${selectedKarts.length} go-kart(s) seleccionado(s) - Solo se muestran go-karts disponibles`}
                SelectProps={{
                  multiple: true,
                  renderValue: (selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const kart = karts.find(k => k.id === value);
                        return (
                          <Chip key={value} label={kart?.codigo || value} size="small" />
                        );
                      })}
                    </Box>
                  ),
                }}
              >
                {karts.map((kart) => (
                  <MenuItem key={kart.id} value={kart.id}>
                    {kart.codigo} - Disponible
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Seleccionar Plan"
                value={numeroVueltas}
                onChange={(e) => handleFieldChange('plan', e.target.value)}
                fullWidth
                margin="normal"
                disabled={loading}
                helperText="Elige el plan que mejor se adapte a tus necesidades"
              >
                {planes.map((plan) => (
                  <MenuItem key={plan.id} value={plan.id}>
                    Plan {plan.vueltas} vueltas - {plan.tiempoMaximo} min - ${plan.precio.toLocaleString('es-CL')}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Fecha de la Reserva"
                type="date"
                value={fechaReserva}
                onChange={(e) => handleFieldChange('fecha', e.target.value)}
                fullWidth
                margin="normal"
                disabled={loading}
                helperText="Selecciona el día de tu reserva"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: new Date().toISOString().split('T')[0] // No permitir fechas pasadas
                }}
              />

              <TextField
                label="Hora de la Reserva"
                type="time"
                value={horaReserva}
                onChange={(e) => handleFieldChange('hora', e.target.value)}
                fullWidth
                margin="normal"
                disabled={loading}
                helperText="Horario de atención: 09:00 - 17:00"
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: "09:00",
                  max: "17:00"
                }}
              />

              {/* Resumen de la reserva */}
              {selectedClientes.length > 0 && selectedKarts.length > 0 && numeroVueltas && (
                <Card sx={{ mt: 2, bgcolor: 'grey.50' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Resumen de la Reserva
                    </Typography>
                    <Typography variant="body2">
                      • {selectedClientes.length} cliente(s) y {selectedKarts.length} go-kart(s)
                    </Typography>
                    {numeroVueltas && (
                      <Typography variant="body2">
                        • Plan: {planes.find(p => p.id === numeroVueltas)?.vueltas} vueltas - 
                        ${planes.find(p => p.id === numeroVueltas)?.precio.toLocaleString('es-CL')}
                      </Typography>
                    )}
                    {fechaReserva && horaReserva && (
                      <Typography variant="body2">
                        • Fecha y hora: {fechaReserva} a las {horaReserva}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              )}
              
              {/* Botones de acción */}
              <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : success ? <CheckCircleIcon /> : <EventAvailableIcon />}
                  >
                    {loading ? "Creando..." : success ? "¡Reserva Creada!" : "Crear Reserva"}
                  </Button>
                  
                  <Button 
                    type="button"
                    variant="outlined"
                    onClick={resetForm}
                    disabled={loading || !hasUnsavedChanges}
                    startIcon={<RefreshIcon />}
                  >
                    Limpiar Formulario
                  </Button>
                </Box>

                <Button 
                  variant="text"
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancelar
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>

        {/* Dialog de confirmación para cancelar */}
        <ConfirmDialog
          open={showCancelDialog}
          onClose={() => setShowCancelDialog(false)}
          onConfirm={confirmCancel}
          title="¿Deseas cancelar la creación de reserva?"
          message="Se perderán todos los datos ingresados. ¿Estás seguro de que deseas salir sin guardar?"
          type="warning"
          confirmText="Sí, cancelar"
          cancelText="No, continuar editando"
        />

        {/* Snackbar para éxito */}
        <Snackbar
          open={success}
          autoHideDuration={3000}
          onClose={() => setSuccess(false)}
        >
          <Alert severity="success" onClose={() => setSuccess(false)}>
            Reserva creada exitosamente. Redirigiendo a la lista...
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default AddEditReserva;