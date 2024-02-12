import React, { useState } from 'react';
import { connect } from 'react-redux';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import { setSortBy } from '../../store/actions/metadataAction';

const ProductSorting = ({ selectedSortBy, saveSortBy }) => {
  const [sortBy, setSortBy] = useState(selectedSortBy);

  const handleChange = (event) => {
    const selectedSortBy = event.target.value;
    setSortBy(selectedSortBy);
    saveSortBy(selectedSortBy);
  };

  const options = [
    { label: 'Default', value: 'DEFAULT' },
    { label: 'Price high to low', value: 'PRICE_DESC' },
    { label: 'Price low to high', value: 'PRICE_ASC' },
    { label: 'Newest', value: 'NEWEST' },
  ];

  return (
    <FormControl style={{ m: 1, minWidth: 240 }} size="small">
      <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={sortBy}
        label="Sort By"
        onChange={handleChange}
      >
        {options.map((element, index) => (
          <MenuItem key={`sortBy_${index}`} value={element.value}>
            {element.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const mapStateToProps = (state) => ({
  selectedSortBy: state.metadata.selectedSortBy,
});

const mapDispatchToProps = (dispatch) => ({
  saveSortBy: (sortBy) => dispatch(setSortBy(sortBy)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductSorting);
