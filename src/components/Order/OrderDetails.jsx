import React from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
} from '@material-ui/core';

const OrderDetails = ({ quantity, product, address }) => {
  return (
    <Card style={{ width: '80%' }}>
      <CardContent>
        <Grid container style={{ paddingTop: '5%', paddingBottom: '5%' }}>
          <Grid item xs={7} style={{ paddingRight: '1%' }}>
            <div style={{ display: 'flex', justifyContent: 'left' }}>
              <Grid container>
                <Grid item xs={12}>
                  <Typography variant="h4">{product.name}</Typography>
                </Grid>
                <Grid item xs={12} style={{ paddingTop: '2%' }}>
                  <Typography variant="body1" style={{ fontSize: '15px' }}>
                    Quantity: <b>{quantity}</b>
                  </Typography>
                </Grid>
                <Grid item xs={12} style={{ paddingTop: '2%' }}>
                  <Typography variant="body1" style={{ fontSize: '15px' }}>
                    Category: <b>{product.category}</b>
                  </Typography>
                </Grid>
                <Grid item xs={12} style={{ paddingTop: '2%' }}>
                  <Typography
                    variant="body1"
                    style={{
                      fontSize: '15px',
                      color: '#666', // Add your disabled color
                    }}
                  >
                    <em>{product.description}</em>
                  </Typography>
                </Grid>
                <Grid item xs={12} style={{ paddingTop: '2%' }}>
                  <Typography
                    variant="body1"
                    style={{
                      fontSize: '25px',
                      color: '#f50057', // Add your secondary color
                    }}
                  >
                    Total Price : &#8377; {product.price * quantity}
                  </Typography>
                </Grid>
              </Grid>
            </div>
          </Grid>
          <Grid item xs={5}>
            <div style={{ display: 'flex', justifyContent: 'left' }}>
              <Grid container>
                <Grid item xs={12}>
                  <Typography variant="h4">Address Details :</Typography>
                </Grid>
                <Grid item xs={12} style={{ paddingTop: '2%' }}>
                  <Typography variant="body1" style={{ fontSize: '15px' }}>
                    {address.name}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1" style={{ fontSize: '15px' }}>
                    Contact Number: {address.contactNumber}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1" style={{ fontSize: '15px' }}>
                    {`${address.street}, ${address.landmark || ''}, ${address.city}`}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1" style={{ fontSize: '15px' }}>
                    {address.state}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body1" style={{ fontSize: '15px' }}>
                    {address.zipcode}
                  </Typography>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default OrderDetails;
