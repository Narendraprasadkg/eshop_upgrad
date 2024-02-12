import React, { useState } from 'react';
import { alpha, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { InputBase } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: alpha(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
  }));

const Search = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchFor, setSearchFor] = useState(searchParams.get('searchFor') || '');

  const changeVal = (val) => {
    setSearchFor(val);
  };

  const blurVal = (val) => {
    if (val !== null && val.length > 0) {
      navigate('/home?searchFor=' + val);
    } else {
      navigate('/home');
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      blurVal(event.target.value);
    }
  };

  return (
    <div className={classes.search}>
        <div className={classes.searchIcon}>
            <SearchIcon />
        </div>
        <InputBase
            placeholder="Search…"
            id="search"
            value={searchFor}
            onChange={(event) => changeVal(event.target.value)}
            onBlur={(event) => blurVal(event.target.value)}
            onKeyDown={handleKeyDown}
            classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
            }}
            inputProps={{ 'aria-label': 'search' }}
        />
    </div>
  );
};

export default Search;
