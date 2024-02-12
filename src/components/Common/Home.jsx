import React, { useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import ProductCategory from '../Common/ProductCategory';
import ProductSorting from '../Product/ProductSorting';
import ProductListing from '../Product/ProductListing';
import useAuthentication from '../../hooks/useAuthentication';
import { ADMIN } from '../../common';

const Home = () => {
  const { AuthCtx } = useAuthentication();
  const { hasUserRole } = useContext(AuthCtx);
  const mode = hasUserRole([ADMIN]) ? 'EDIT' : 'VIEW';

  return (
    <Box style={{ flexGrow: 1 }}>
      <Grid container spacing={1}>
        <Grid container item spacing={3}>
          <Grid item xs={12}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ProductCategory />
            </div>
          </Grid>
          <Grid item xs={12}>
            <div style={{ display: 'flex', justifyContent: 'left', paddingLeft: '1%' }}>
              <ProductSorting />
            </div>
          </Grid>
          <ProductListing mode={mode} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
