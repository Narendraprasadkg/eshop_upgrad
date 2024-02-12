import React from 'react';
import Button from '@material-ui/core/Button';
import { useNavigate } from 'react-router-dom';
import useAuthentication from '../../hooks/useAuthentication';
import { useContext } from 'react';
import { clearAllMetadata } from '../../store/actions/metadataAction';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Logout = ({ sx, resetMetadata }) => {
  const { AuthCtx } = useAuthentication();
  const { logoutUser } = useContext(AuthCtx);
  const navigate = useNavigate();

  const performLogout = async () => {
    resetMetadata();
    try {
      await logoutUser();
      navigate('/login');
    } catch (error) {
      // Handle logout error if needed
      console.error('Logout failed:', error);
    }
  };

  return (
    <Button
      style={sx}
      variant="contained"
      color="secondary"
      onClick={performLogout}
    >
      LOGOUT
    </Button>
  );
};

Logout.propTypes = {
  sx: PropTypes.object,
  resetMetadata: PropTypes.func.isRequired,
};

Logout.defaultProps = {
  sx: {},
};

const mapStateToProps = (state) => {
  return {
    sortBy: state.metadata.selectedSortBy,
    category: state.metadata.selectedCategory,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    resetMetadata: () => dispatch(clearAllMetadata()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Logout);
