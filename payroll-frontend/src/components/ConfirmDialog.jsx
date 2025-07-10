import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import CircularProgress from '@mui/material/CircularProgress';

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  type = 'warning', // 'warning', 'error', 'info'
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  loading = false
}) => {
  const getIcon = () => {
    switch (type) {
      case 'error':
        return <ErrorIcon color="error" sx={{ fontSize: 40 }} />;
      case 'info':
        return <InfoIcon color="info" sx={{ fontSize: 40 }} />;
      default:
        return <WarningIcon color="warning" sx={{ fontSize: 40 }} />;
    }
  };

  const getConfirmColor = () => {
    switch (type) {
      case 'error':
        return 'error';
      case 'info':
        return 'primary';
      default:
        return 'warning';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={!loading ? onClose : undefined}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {getIcon()}
        {title}
      </DialogTitle>
      
      <DialogContent>
        <DialogContentText>
          {message}
        </DialogContentText>
      </DialogContent>
      
      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={onClose} 
          disabled={loading}
          variant="outlined"
        >
          {cancelText}
        </Button>
        <Button 
          onClick={onConfirm} 
          disabled={loading}
          variant="contained"
          color={getConfirmColor()}
          autoFocus
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Procesando...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;