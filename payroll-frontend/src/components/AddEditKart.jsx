import { useState } from "react";
import kartService from "../services/kart.service";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CancelIcon from "@mui/icons-material/Cancel";
import RefreshIcon from "@mui/icons-material/Refresh";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import ConfirmDialog from "./common/ConfirmDialog";
import AppBreadcrumbs from "./common/AppBreadcrumbs";

const AddEditKart = () => {
  const [codigo, setCodigo] = useState("");
  const [estado, setEstado] = useState("disponible");
  const [errorCodigo, setErrorCodigo] = useState("");
  const [errorEstado, setErrorEstado] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const navigate = useNavigate();

  const estadosValidos = [
    { value: "disponible", label: "Disponible para usar" },
    { value: "no disponible", label: "No disponible (mantenimiento)" }
  ];
  
  const codigosValidos = Array.from({ length: 15 }, (_, i) => {
    const numero = i + 1;
    return {
      value: `K${String(numero).padStart(3, "0")}`,
      label: `Go-Kart #${numero} (K${String(numero).padStart(3, "0")})`
    };
  });

  const validateCodigo = (value) => {
    if (!value) {
      setErrorCodigo("Debes seleccionar un go-kart.");
      return false;
    }
    if (!codigosValidos.some(k => k.value === value)) {
      setErrorCodigo("Código de go-kart no válido.");
      return false;
    }
    setErrorCodigo("");
    return true;
  };

  const validateEstado = (value) => {
    if (!estadosValidos.some(e => e.value === value)) {
      setErrorEstado("Estado no válido.");
      return false;
    }
    setErrorEstado("");
    return true;
  };

  const handleFieldChange = (field, value) => {
    setHasUnsavedChanges(true);
    
    if (field === 'codigo') {
      setCodigo(value);
      if (value) validateCodigo(value);
    } else if (field === 'estado') {
      setEstado(value);
      validateEstado(value);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setShowCancelDialog(true);
    } else {
      navigate("/karts/list");
    }
  };

  const confirmCancel = () => {
    setShowCancelDialog(false);
    navigate("/karts/list");
  };

  const handleBack = () => {
    navigate("/karts/list");
  };

  const resetForm = () => {
    setCodigo("");
    setEstado("disponible");
    setErrorCodigo("");
    setErrorEstado("");
    setHasUnsavedChanges(false);
    setError(null);
  };

  const saveKart = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const isCodigoValid = validateCodigo(codigo);
    const isEstadoValid = validateEstado(estado);

    if (!isCodigoValid || !isEstadoValid) {
      setLoading(false);
      setError("Por favor corrige los errores antes de continuar");
      return;
    }

    const kart = { codigo, estado };
    kartService
      .create(kart)
      .then(() => {
        setLoading(false);
        setSuccess(true);
        setHasUnsavedChanges(false);
        setTimeout(() => navigate("/karts/list"), 2000);
      })
      .catch((error) => {
        setLoading(false);
        setError("Error al guardar el go-kart. Por favor intenta nuevamente.");
        console.error("Error al guardar el go-kart:", error);
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
            <DirectionsCarIcon sx={{ mr: 2 }} />
            Registrar Nuevo Go-Kart
          </Typography>
        </Box>

        <Card>
          <CardContent>
            <form onSubmit={saveKart}>
              {/* Indicador de progreso */}
              {loading && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Registrando go-kart en el sistema...
                </Alert>
              )}
              
              {/* Mensaje de error */}
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <TextField
                select
                label="Seleccionar Go-Kart"
                value={codigo}
                onChange={(e) => handleFieldChange('codigo', e.target.value)}
                error={!!errorCodigo}
                helperText={errorCodigo || "Elige el go-kart que deseas registrar"}
                fullWidth
                margin="normal"
                disabled={loading}
              >
                {codigosValidos.map((kart) => (
                  <MenuItem key={kart.value} value={kart.value}>
                    {kart.label}
                  </MenuItem>
                ))}
              </TextField>
              
              <TextField
                select
                label="Estado del Go-Kart"
                value={estado}
                onChange={(e) => handleFieldChange('estado', e.target.value)}
                error={!!errorEstado}
                helperText={errorEstado || "Indica si el go-kart está listo para usar"}
                fullWidth
                margin="normal"
                disabled={loading}
              >
                {estadosValidos.map((estado) => (
                  <MenuItem key={estado.value} value={estado.value}>
                    {estado.label}
                  </MenuItem>
                ))}
              </TextField>
              
              {/* Botones de acción */}
              <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                    disabled={loading || !!errorCodigo || !!errorEstado}
                    startIcon={loading ? <CircularProgress size={20} /> : success ? <CheckCircleIcon /> : <DirectionsCarIcon />}
                  >
                    {loading ? "Registrando..." : success ? "¡Go-Kart Registrado!" : "Registrar Go-Kart"}
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
            Go-kart registrado exitosamente. Redirigiendo a la lista...
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default AddEditKart;