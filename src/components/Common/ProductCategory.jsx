import React, { useEffect, useState } from 'react';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { setFilter } from '../../store/actions/metadataAction';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { connect } from 'react-redux';
import { ALL } from '../../common';

const MaxItemsToShow = 7;

const ProductCategory = ({ filter, categories, changeFilter, removeFilter }) => {
  const [visibleCategories, setVisibleCategories] = useState([]);
  const [filterValue, setFilterValue] = useState(filter || ALL);
  const [startIndex, setStartIndex] = useState(0); // Add startIndex state

  // useEffect(() => {
  //   const exists = categories.includes(filterValue);
  //   if (!exists) {
  //     clearFilter();
  //   }
  // }, [filterValue, categories]);

  useEffect(() => {
    updateVisibleCategories();
  }, [categories, startIndex]);

  const updateVisibleCategories = () => {
    if (categories && categories.length > 0) {
      const endIndex = Math.min(startIndex + MaxItemsToShow, categories.length);
      const visible = categories.slice(startIndex, endIndex);
      setVisibleCategories(visible);
    }
  };

  const handleAlignment = (event, newAlignment) => {
    console.log(newAlignment);
    if (newAlignment != null) {
      setFilterValue(newAlignment);
      if (newAlignment === ALL) {
        removeFilter();
      } else {
        changeFilter(newAlignment);
      }
    }
  };

  const handleShowMore = () => {
    setStartIndex(startIndex + MaxItemsToShow);
  };

  return (
    <ToggleButtonGroup
      value={filterValue}
      exclusive
      onChange={handleAlignment}
      aria-label="categories">
      {startIndex > 0 && (
        <ToggleButton onClick={() => setStartIndex(startIndex - MaxItemsToShow)} key={`category_left`} aria-label="<" style={{fontSize:'10px'}}>
          <ChevronLeftIcon/>
        </ToggleButton>
      )}
      {categories && [ALL,...visibleCategories].map((element, index) => (
        <ToggleButton key={`category_${index}`} value={element} aria-label={element} style={{fontSize:'10px', textTransform:'capitalize'}}>
          {element.toUpperCase()}
        </ToggleButton>
      ))}
      {categories && startIndex + MaxItemsToShow < categories.length && (
        <ToggleButton onClick={handleShowMore} key={`category_right`} aria-label=">" style={{fontSize:'10px'}}>
          <ChevronRightIcon/>
        </ToggleButton>
      )}
    </ToggleButtonGroup>
  );
};

const mapStateToProps = (state) => ({
  filter: state.metadata.selectedCategory,
  categories: state.metadata.categories,
});

const mapDispatchToProps = (dispatch) => ({
  changeFilter: (category) => dispatch(setFilter(category)),
  removeFilter: () => dispatch(setFilter()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductCategory);
