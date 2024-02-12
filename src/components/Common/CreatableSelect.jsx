import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { createFilterOptions } from '@material-ui/lab/useAutocomplete';

const CreatableSelect = ({
  options,
  value,
  onChange,
  onBlur,
  id,
  label,
  error,
  helperText,
}) => {
  const filter = createFilterOptions();
  const [selectedValue, setSelectedValue] = useState(value || null);

  useEffect(() => {
    setSelectedValue(value || null);
  }, [value]);

  const handleOnChange = (event, newValue) => {
    if (newValue !== null && newValue.inputValue) {
      // Handle the case where a new option is being added
      newValue = newValue.inputValue;
    }
    setSelectedValue(newValue);
    onChange(newValue);
  };

  const handleOnBlur = () => {
    onBlur(selectedValue);
  };

  const getOptionLabel = (option) => {
    if (option.inputValue) {
      // Display the input value for a new option
      return option.inputValue;
    }
    return option;
  };

  const filterOptions = (options, params) => {
    const filtered = filter(options, params);
    const { inputValue } = params;

    if (inputValue !== '') {
      // Add a new option with the inputValue if it doesn't exist
      const isExisting = options.some((option) => inputValue === option);
      if (!isExisting) {
        filtered.push({ inputValue, label: `Add "${inputValue}"` });
      }
    }

    return filtered;
  };

  return (
    <Autocomplete
      value={selectedValue}
      onChange={handleOnChange}
      filterOptions={filterOptions}
      onBlur={handleOnBlur}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      id={id}
      options={options}
      getOptionLabel={getOptionLabel}
      renderOption={(option) => {
        if (typeof option === 'string') {
          return option;
        } else if (option.inputValue) {
          return option.inputValue;
        } else {
          return option.label || ''; // Handle other cases if needed
        }
      }}
      style={{ width: '100%' }}
      freeSolo
      renderInput={(params) => (
        <TextField {...params} label={label} error={error} helperText={helperText} />
      )}
    />
  );
};

export default CreatableSelect;
