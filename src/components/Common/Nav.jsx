import React from 'react';
import { alpha, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MoreIcon from '@material-ui/icons/MoreVert';
import Search from './GlobalSearch';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { Link } from 'react-router-dom';
import Logout from '../Auth/Logout';
import useAuthentication from '../../hooks/useAuthentication';
import { ADMIN } from '../../common';
import { createProduct } from '../../api/productAPIs';
import { Button } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  grow2: {
    flexGrow: 2,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
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
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

export default function PrimarySearchAppBar() {
  const classes = useStyles();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const { AuthCtx } = useAuthentication();
  const { loggedInUser, hasUserRole } = React.useContext(AuthCtx);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const pages = [
    { id: '2', label: 'Add Product', url: '/product/add', visible: loggedInUser && hasUserRole([ADMIN]) },
    { id: '1', label: 'Home', url: '/home', visible: true },
    { id: '3', label: 'Login', url: '/login', visible: !loggedInUser },
    { id: '4', label: 'Sign Up', url: '/signup', visible: !loggedInUser },
  ];

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const addProduct = async () => {
      const mockProduct = {
          "name": "as cma sdv",
          "category": "ALL",
          "manufacturer": "vkmasdvm",
          "availableItems": "123",
          "price": "12313",
          "imageUrl": "https://www.gstatic.com/webp/gallery3/1.sm.png",
          "description": "ckcmkasdmv"
      };

      try {
          const r_product = await createProduct(mockProduct);
          console.log(r_product.data);
      } catch (error) {
          console.error("Error adding product:", error);
      }
  };

    
  const all_menus = (colour) => (<>
    {pages.filter(f => f.visible).map((element)=>{
      return (
        <MenuItem key={element.id} onClick={handleCloseNavMenu}>
          <Link to={element.url} style={{color:colour,textDecoration:'none'}}>
            <Typography align="center">{element.label}</Typography>
          </Link>
        </MenuItem>
      );
    })}
    {loggedInUser && (
      <MenuItem key="5" onClick={handleCloseNavMenu}>
        <Logout />
      </MenuItem>
    )}
    </>
  );
    
  const menuRenderer = (anchor,id,isMenuOpen,closeHandler) => {
    <Menu
      anchorEl={anchor}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={id}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={closeHandler}>
        {all_menus('black')}
    </Menu>
  }
  
  const menuId = 'primary-search-account-menu';
	const renderMenu = menuRenderer(anchorEl,menuId,isMenuOpen,handleMenuClose);

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = menuRenderer(mobileMoreAnchorEl,mobileMenuId,isMobileMenuOpen,handleMobileMenuClose);

  return (
    <div className={classes.grow}>
        <AppBar position="fixed">
            <Toolbar>
                <IconButton
                    edge="start"
                    className={classes.menuButton}
                    color="inherit"
                    aria-label="open drawer"
                    onClick={addProduct}>
                    <ShoppingCartIcon/>
                </IconButton>
                <Typography className={classes.title} variant="h6" noWrap >
                    upGrad E-Shop
                </Typography>
                <div className={classes.grow}/>
                <Search className={classes.grow2}/>
                <div className={classes.grow}/>
                <div className={classes.sectionDesktop}>
					        {all_menus('white')}
                </div>
                <div className={classes.sectionMobile}>
                    <IconButton
                        aria-label="show more"
                        aria-controls={mobileMenuId}
                        aria-haspopup="true"
                        onClick={handleMobileMenuOpen}
                        color="inherit">
                        <MoreIcon />
                    </IconButton>
                </div>
            </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
    </div>
  );
}