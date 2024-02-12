import React from 'react';
import { Card, CardActions, CardContent, CardMedia, Typography, Button, Grid, IconButton } from '@material-ui/core';
import { Delete, Edit } from '@material-ui/icons';

const ProductCard = ({ mode, deleteProduct, modifyProduct, buyProduct, ...details }) => {
  const truncateText = (text) => (text.length > 150 ? `${text.substring(0, 150)}...` : text);

  const checkAdminMode = () => {
    if (mode === 'EDIT') {
      return (
        <>
          <Grid item xs={2}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <IconButton aria-label="Modify" onClick={() => modifyProduct(details)}>
                <Edit />
              </IconButton>
            </div>
          </Grid>
          <Grid item xs={2}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <IconButton aria-label="Delete" onClick={() => deleteProduct(details)}>
                <Delete />
              </IconButton>
            </div>
          </Grid>
        </>
      );
    }
    return <></>;
  };

  return (
    <Card style={{width:'400px'}}>
      <CardMedia
          component="img"
          alt={`Image of ${details.name}`}
          height="300"
          image={details.imageUrl}
          title={details.name}
        />
      <CardContent>
        <Grid container>
          <Grid item xs={9}>
            <div style={{ display: 'flex', justifyContent: 'left' }}>
              <Typography gutterBottom variant="h6" component="div" className="ud-pc-wrap_text" title={details.name}>
                {details.name}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={3}>
            <div style={{ display: 'flex', justifyContent: 'right' }}>
              <Typography gutterBottom variant="h6" component="div" className="ud-pc-wrap_text" title={`\u20B9 ${details.price}`}>
                {`\u20B9 ${details.price}`}
              </Typography>
            </div>
          </Grid>
        </Grid>
        <Typography variant="body2" color="textPrimary" style={{ minHeight: 60 }}>
          {truncateText(details.description)}
        </Typography>
      </CardContent>
      <CardActions>
        <Grid container>
          <Grid item xs={8}>
            <div style={{ display: 'flex', justifyContent: 'left' }}>
              <Button variant="contained" color="primary" onClick={() => buyProduct(details)}>
                BUY
              </Button>
            </div>
          </Grid>
          {checkAdminMode()}
        </Grid>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
