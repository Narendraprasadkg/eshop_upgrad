import React, { useCallback, useContext, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@material-ui/core/styles'; // Import from '@material-ui/core/styles' for Material-UI v4
import PageSetUp from './components/PageSetUp';
import { useDispatch } from 'react-redux';
import { initCatalog } from './store/actions/metadataAction';
import useAuthentication from './hooks/useAuthentication';

const theme = createTheme({ // Use createMuiTheme instead of createTheme for Material-UI v4
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    disabled: {
      main: '#56595c',
    },
  },
});

function App() {
  const { AuthCtx } = useAuthentication();
  const { accessToken } = useContext(AuthCtx);
  const dispatch = useDispatch();

  const initPageData = useCallback(() => {
    dispatch(initCatalog(accessToken));
  }, [dispatch, accessToken]);

  useEffect(() => {
    initPageData();
  }, [initPageData]);

  return (
    <ThemeProvider theme={theme}>
      <PageSetUp />
    </ThemeProvider>
  );
}

export default App;
