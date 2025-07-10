import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import reservaService from "../services/reserva.service";
import httpClient from "../http-common";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EmailIcon from "@mui/icons-material/Email";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Chip from "@mui/material/Chip";
import ConfirmDialog from "./common/ConfirmDialog";
import AppBreadcrumbs from "./common/AppBreadcrumbs";
import EventIcon from "@mui/icons-material/Event";

const ReservaList = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sendingEmail, setSendingEmail] = useState({});
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailDialog, setEmailDialog] = useState({ open: false, reservaId: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, reserva: null });
  const [deleting, setDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadReservas();
  }, []);

  const loadReservas = () => {
    setLoading(true);
    reservaService
      .getAll()
      .then((response) => {
        setReservas(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error al cargar las reservas. Por favor recarga la página.");
        setLoading(false);
        console.error("Error al cargar las reservas:", error);
      });
  };

  const handleEmailClick = (reservaId) => {
    setEmailDialog({ open: true, reservaId });
  };

  const handleEmailConfirm = () => {
    if (!emailDialog.reservaId) return;
    
    enviarComprobante(emailDialog.reservaId);
    setEmailDialog({ open: false, reservaId: null });
  };

  const handleEmailCancel = () => {
    setEmailDialog({ open: false, reservaId: null });
  };

  const enviarComprobante = (reservaId) => {
    setSendingEmail(prev => ({ ...prev, [reservaId]: true }));
    setEmailError("");
    
    httpClient.post(`/api/reservas/${reservaId}/enviar-comprobante`)
      .then((response) => {
        setEmailSuccess(true);
        setSendingEmail(prev => ({ ...prev, [reservaId]: false }));
      })
      .catch((error) => {
        setEmailError("Error al enviar el comprobante. Por favor intenta nuevamente.");
        setSendingEmail(prev => ({ ...prev, [reservaId]: false }));
      });
  };

  const handleDeleteClick = (reserva) => {
    setDeleteDialog({ open: true, reserva });
  };

  const handleDeleteConfirm = () => {
    if (!deleteDialog.reserva) return;
    
    setDeleting(true);
    reservaService
      .remove(deleteDialog.reserva.id)
      .then(() => {
        setDeleting(false);
        setDeleteDialog({ open: false, reserva: null });
        setDeleteSuccess(true);
        // Recargar la lista
        loadReservas();
      })
      .catch((error) => {
        setDeleting(false);
        setError("Error al eliminar la reserva. Por favor intenta nuevamente.");
        console.error("Error al eliminar:", error);
      });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, reserva: null });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  if (loading) {
    return (
      <>
        <AppBreadcrumbs />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
          <Box ml={2}>Cargando reservas...</Box>
        </Box>
      </>
    );
  }

  if (error) {
    return (
      <>
        <AppBreadcrumbs />
        <Box sx={{ p: 3 }}>
          <Alert 
            severity="error" 
            sx={{ mb: 2 }}
            action={
              <Button color="inherit" size="small" onClick={loadReservas}>
                Reintentar
              </Button>
            }
          >
            {error}
          </Alert>
        </Box>
      </>
    );
  }

  return (
    <Box>
      <AppBreadcrumbs />
      
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center' }}>
            <EventIcon sx={{ mr: 2 }} />
            Lista de Reservas
          </Typography>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate("/reservas/add")}
          >
            Crear Nueva Reserva
          </Button>
        </Box>

        {emailError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {emailError}
          </Alert>
        )}

        {/* Tabla */}
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }}>
                  ID
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }}>
                  Clientes
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }}>
                  Go-Karts
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }}>
                  Vueltas
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }}>
                  Precio Base
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }}>
                  Descuentos
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }}>
                  Precio Final
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }}>
                  Precio + IVA
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reservas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No hay reservas registradas
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => navigate("/reservas/add")}
                      sx={{ mt: 2 }}
                    >
                      Crear la Primera Reserva
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                reservas.map((reserva) => {
                  const iva = Math.round(reserva.precioFinal * 0.19);
                  const precioConIva = Math.round(reserva.precioFinal + iva);
                  const totalDescuentos = (reserva.descuentoPorVisitas || 0) + 
                                        (reserva.descuentoPorCumpleaños || 0) + 
                                        (reserva.descuentoPorPersonas || 0);

                  return (
                    <TableRow 
                      key={reserva.id}
                      sx={{ '&:nth-of-type(odd)': { bgcolor: 'action.hover' } }}
                    >
                      <TableCell sx={{ fontWeight: 'medium' }}>
                        #{reserva.id}
                      </TableCell>
                      <TableCell>
                        {reserva.clientes.map((cliente, index) => (
                          <Chip 
                            key={index}
                            label={cliente.nombre}
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </TableCell>
                      <TableCell>
                        {reserva.karts.map((kart, index) => (
                          <Chip 
                            key={index}
                            label={kart.codigo}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </TableCell>
                      <TableCell>{reserva.numeroVueltas}</TableCell>
                      <TableCell>{formatPrice(reserva.precioBase)}</TableCell>
                      <TableCell>
                        {totalDescuentos > 0 ? (
                          <Chip 
                            label={`${totalDescuentos}%`}
                            size="small"
                            color="success"
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Sin descuentos
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'medium' }}>
                        {formatPrice(reserva.precioFinal)}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>
                        {formatPrice(precioConIva)}
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<EditIcon />}
                            onClick={() => navigate(`/reservas/edit/${reserva.id}`)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => handleEmailClick(reserva.id)}
                            disabled={sendingEmail[reserva.id]}
                            startIcon={sendingEmail[reserva.id] ? <CircularProgress size={16} /> : <EmailIcon />}
                          >
                            {sendingEmail[reserva.id] ? "Enviando..." : "Enviar"}
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDeleteClick(reserva)}
                          >
                            Eliminar
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Dialog de confirmación para email */}
        <ConfirmDialog
          open={emailDialog.open}
          onClose={handleEmailCancel}
          onConfirm={handleEmailConfirm}
          title="¿Enviar Comprobante por Email?"
          message="Se enviará el comprobante de la reserva a todos los clientes asociados. ¿Deseas continuar?"
          type="info"
          confirmText="Sí, enviar"
          cancelText="Cancelar"
        />

        {/* Dialog de confirmación para eliminar */}
        <ConfirmDialog
          open={deleteDialog.open}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          loading={deleting}
          title="¿Eliminar Reserva?"
          message={`¿Estás seguro de que deseas eliminar la reserva #${deleteDialog.reserva?.id}? Esta acción no se puede deshacer.`}
          type="error"
          confirmText="Sí, eliminar"
          cancelText="Cancelar"
        />

        {/* Snackbars */}
        <Snackbar
          open={emailSuccess}
          autoHideDuration={3000}
          onClose={() => setEmailSuccess(false)}
        >
          <Alert severity="success" onClose={() => setEmailSuccess(false)}>
            Comprobante enviado exitosamente
          </Alert>
        </Snackbar>

        <Snackbar
          open={deleteSuccess}
          autoHideDuration={3000}
          onClose={() => setDeleteSuccess(false)}
        >
          <Alert severity="success" onClose={() => setDeleteSuccess(false)}>
            Reserva eliminada exitosamente
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default ReservaList;