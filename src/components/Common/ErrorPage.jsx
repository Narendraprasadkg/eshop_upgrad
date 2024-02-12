import React from 'react';
import Grid from '@material-ui/core/Grid';
import LocationOffOutlinedIcon from '@material-ui/icons/LocationOffOutlined';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const ErrorPage = () => {
  return (
    <Box style={{ flexGrow: 1 }}>
      <Grid container spacing={1}>
        <Grid container item spacing={3}>
          <Grid item xs={4} />
          <Grid item xs={4}>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10%' }}>
              <LocationOffOutlinedIcon
                style={{
                  display: 'inline-block',
                  borderRadius: '60px',
                  padding: '0.6em 0.6em',
                  color: '#ffffff',
                  background: '#f50057',
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Typography
                variant="subtitle1"
                noWrap
                style={{
                  fontSize: '25px',
                  color: 'inherit',
                }}
              >
                404 Not Found
              </Typography>
            </div>
          </Grid>
          <Grid item xs={4} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ErrorPage;
