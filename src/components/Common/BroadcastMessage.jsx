import React, { useContext, useEffect, useState } from 'react';
import { Snackbar } from '@material-ui/core';
import useServices from '../../hooks/useServices';
import Alert from '@material-ui/lab/Alert';

const BroadcastMessage = () => {
  const [showInfo, setShowInfo] = useState(false);
  const { ServicesCtx } = useServices();
  const { message, level, broadcastMessage } = useContext(ServicesCtx);

  useEffect(() => {
    setShowInfo(message !== null && level !== null);
  }, [message, level]);

  const hideAndResetMessage = () => {
    setShowInfo(false);
    broadcastMessage(null, null);
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={showInfo}
      autoHideDuration={4000}
      onClose={hideAndResetMessage}
    >
      <Alert onClose={hideAndResetMessage} severity={level} style={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default BroadcastMessage;
