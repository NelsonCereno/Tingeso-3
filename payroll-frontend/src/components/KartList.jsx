import React, { useEffect, useState } from "react";
import kartService from "../services/kart.service";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";

const KartList = () => {
  const [karts, setKarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    kartService
      .getAll()
      .then((response) => {
        setKarts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("Error al cargar los karts. Por favor recarga la página.");
        setLoading(false);
        console.error("Error al cargar los karts:", error);
      });
  }, []);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
        <Box ml={2}>Cargando karts...</Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <div>
      <h2>Lista de Karts</h2>

      {/* Botón para agregar un nuevo kart */}
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => navigate("/karts/add")}
        style={{ marginBottom: "20px" }}
      >
        Nuevo Kart
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Código</TableCell>
              <TableCell>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {karts.map((kart) => (
              <TableRow key={kart.id}>
                <TableCell>{kart.id}</TableCell>
                <TableCell>{kart.codigo}</TableCell>
                <TableCell>{kart.estado}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default KartList;