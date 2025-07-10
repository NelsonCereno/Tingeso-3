import React, { useEffect, useState } from "react";
import clienteService from "../services/cliente.service";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "./common/ConfirmDialog";
import AppBreadcrumbs from "./common/AppBreadcrumbs";
import PeopleIcon from "@mui/icons-material/People";

const ClienteList = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, cliente: null });
  const [deleting, setDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = () => {
    setLoading(true);
    clienteService
      .getAll()
      .then((response) => {
        setClientes(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error al cargar los clientes. Por favor recarga la página.");
        setLoading(false);
        console.error("Error al cargar los clientes:", error);
      });
  };

  const handleDeleteClick = (cliente) => {
    setDeleteDialog({ open: true, cliente });
  };

  const handleDeleteConfirm = () => {
    if (!deleteDialog.cliente) return;
    
    setDeleting(true);
    clienteService
      .remove(deleteDialog.cliente.id)
      .then(() => {
        setDeleting(false);
        setDeleteDialog({ open: false, cliente: null });
        setDeleteSuccess(true);
        // Recargar la lista
        loadClientes();
      })
      .catch((error) => {
        setDeleting(false);
        setError("Error al eliminar el cliente. Por favor intenta nuevamente.");
        console.error("Error al eliminar:", error);
      });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, cliente: null });
  };

  if (loading) {
    return (
      <>
        <AppBreadcrumbs />
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
          <Box ml={2}>Cargando clientes...</Box>
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
              <Button color="inherit" size="small" onClick={loadClientes}>
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
            <PeopleIcon sx={{ mr: 2 }} />
            Lista de Clientes
          </Typography>
          
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate("/clientes/add")}
          >
            Registrar Nuevo Cliente
          </Button>
        </Box>

        {/* Tabla */}
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }}>
                  ID
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }}>
                  Nombre
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }}>
                  Correo Electrónico
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }}>
                  Número de Visitas
                </TableCell>
                <TableCell sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }}>
                  Fecha de Nacimiento
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', bgcolor: 'primary.main', color: 'white' }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No hay clientes registrados
                    </Typography>
                    <Button
                      variant="outlined"
                      startIcon={<AddIcon />}
                      onClick={() => navigate("/clientes/add")}
                      sx={{ mt: 2 }}
                    >
                      Registrar el Primer Cliente
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                clientes.map((cliente) => (
                  <TableRow 
                    key={cliente.id}
                    sx={{ '&:nth-of-type(odd)': { bgcolor: 'action.hover' } }}
                  >
                    <TableCell>{cliente.id}</TableCell>
                    <TableCell sx={{ fontWeight: 'medium' }}>
                      {cliente.nombre || "Sin nombre"}
                    </TableCell>
                    <TableCell>{cliente.email || "Sin correo"}</TableCell>
                    <TableCell>{cliente.numeroVisitas || 0}</TableCell>
                    <TableCell>
                      {cliente.fechaNacimiento || "No especificada"}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => navigate(`/clientes/edit/${cliente.id}`)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleDeleteClick(cliente)}
                        >
                          Eliminar
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Dialog de confirmación para eliminar */}
        <ConfirmDialog
          open={deleteDialog.open}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          loading={deleting}
          title="¿Eliminar Cliente?"
          message={`¿Estás seguro de que deseas eliminar al cliente "${deleteDialog.cliente?.nombre}"? Esta acción no se puede deshacer.`}
          type="error"
          confirmText="Sí, eliminar"
          cancelText="Cancelar"
        />

        {/* Snackbar de éxito */}
        <Snackbar
          open={deleteSuccess}
          autoHideDuration={3000}
          onClose={() => setDeleteSuccess(false)}
        >
          <Alert severity="success" onClose={() => setDeleteSuccess(false)}>
            Cliente eliminado exitosamente
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default ClienteList;