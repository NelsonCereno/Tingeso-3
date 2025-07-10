import { useState } from "react";
import clienteService from "../services/cliente.service";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CakeIcon from "@mui/icons-material/Cake";
import EmailIcon from "@mui/icons-material/Email";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CancelIcon from "@mui/icons-material/Cancel";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Box, Typography, Card, CardContent } from "@mui/material";
import ConfirmDialog from "./common/ConfirmDialog";
import AppBreadcrumbs from "./common/AppBreadcrumbs";

const AddEditCliente = () => {
  const [nombre, setNombre] = useState("");
  const [numeroVisitas, setNumeroVisitas] = useState(0);
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [email, setEmail] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorNombre, setErrorNombre] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (value) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(value)) {
      setErrorEmail("El correo debe ser una dirección válida de Gmail.");
      return false;
    }
    setErrorEmail("");
    return true;
  };

  const validateNombre = (value) => {
    if (!value.trim()) {
      setErrorNombre("El nombre es obligatorio.");
      return false;
    }
    setErrorNombre("");
    return true;
  };

  const handleFieldChange = (field, value) => {
    setHasUnsavedChanges(true);
    
    switch (field) {
      case 'nombre':
        setNombre(value);
        if (value) validateNombre(value);
        break;
      case 'email':
        setEmail(value);
        if (value) validateEmail(value);
        break;
      case 'numeroVisitas':
        setNumeroVisitas(value);
        break;
      case 'fechaNacimiento':
        setFechaNacimiento(value);
        break;
      default:
        break;
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setShowCancelDialog(true);
    } else {
      navigate("/clientes/list");
    }
  };

  const confirmCancel = () => {
    setShowCancelDialog(false);
    navigate("/clientes/list");
  };

  const handleBack = () => {
    navigate("/clientes/list");
  };

  const resetForm = () => {
    setNombre("");
    setNumeroVisitas(0);
    setFechaNacimiento("");
    setEmail("");
    setErrorEmail("");
    setErrorNombre("");
    setHasUnsavedChanges(false);
    setError(null);
  };

  const saveCliente = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const isNombreValid = validateNombre(nombre);
    const isEmailValid = validateEmail(email);

    if (!isNombreValid || !isEmailValid) {
      setLoading(false);
      setError("Por favor corrige los errores antes de continuar");
      return;
    }

    const cliente = { nombre, numeroVisitas, fechaNacimiento, email };
    clienteService
      .create(cliente)
      .then(() => {
        setLoading(false);
        setSuccess(true);
        setHasUnsavedChanges(false);
        setTimeout(() => navigate("/clientes/list"), 2000);
      })
      .catch((error) => {
        setLoading(false);
        setError("Error al guardar el cliente. Por favor intenta nuevamente.");
        console.error("Error al guardar el cliente:", error);
      });
  };

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
            <PersonAddIcon sx={{ mr: 2 }} />
            Registrar Nuevo Cliente
          </Typography>
        </Box>

        <Card>
          <CardContent>
            <form onSubmit={saveCliente}>
              {loading && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Registrando cliente en el sistema...
                </Alert>
              )}
              
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <TextField
                label="Nombre Completo *"
                value={nombre}
                onChange={(e) => handleFieldChange('nombre', e.target.value)}
                error={!!errorNombre}
                helperText={errorNombre || "Ingresa el nombre completo del cliente"}
                fullWidth
                margin="normal"
                disabled={loading}
                placeholder="Ej: Juan Pérez González"
              />
              
              <TextField
                label="Número de Visitas Anteriores"
                type="number"
                value={numeroVisitas}
                onChange={(e) => handleFieldChange('numeroVisitas', Number(e.target.value))}
                fullWidth
                margin="normal"
                disabled={loading}
                helperText="¿Cuántas veces ha venido antes? (0 si es primera vez)"
                inputProps={{ min: 0, max: 999 }}
              />
              
              <TextField
                label="Fecha de Nacimiento"
                type="date"
                value={fechaNacimiento}
                onChange={(e) => handleFieldChange('fechaNacimiento', e.target.value)}
                fullWidth
                margin="normal"
                disabled={loading}
                helperText="Para aplicar descuentos de cumpleaños"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <CakeIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
              
              <TextField
                label="Correo Electrónico (Gmail) *"
                type="email"
                value={email}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                error={!!errorEmail}
                helperText={errorEmail || "Para enviar comprobantes de reserva"}
                fullWidth
                margin="normal"
                disabled={loading}
                placeholder="ejemplo@gmail.com"
                InputProps={{
                  startAdornment: <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                }}
              />
              
              {/* Botones de acción */}
              <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    disabled={loading || !!errorEmail || !!errorNombre}
                    startIcon={loading ? <CircularProgress size={20} /> : success ? <CheckCircleIcon /> : <PersonAddIcon />}
                  >
                    {loading ? "Registrando..." : success ? "¡Cliente Registrado!" : "Registrar Cliente"}
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
          title="¿Deseas cancelar el registro?"
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
            Cliente registrado exitosamente. Redirigiendo a la lista...
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default AddEditCliente;