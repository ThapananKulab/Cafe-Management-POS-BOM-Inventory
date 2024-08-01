import axios from 'axios';
import React, { useState, useEffect } from 'react';

import {
  List,
  Select,
  MenuItem,
  ListItem,
  InputLabel,
  FormControl,
  ListItemText,
} from '@mui/material';

function MenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const [selectedServingOption, setSelectedServingOption] = useState('');

  useEffect(() => {
    axios
      .get('https://cafe-management-pos-bom-inventory-api.vercel.app/api/menus/allMenus')
      .then((response) => setMenuItems(response.data))
      .catch((error) => console.error('There was an error!', error));
  }, []);

  const handleMenuItemChange = (event) => {
    const menuItemId = event.target.value;
    const menuItem = menuItems.find((item) => item._id === menuItemId);
    setSelectedMenuItem(menuItem);
    setSelectedServingOption('');
  };

  const handleServingOptionChange = (event) => {
    setSelectedServingOption(event.target.value);
  };

  return (
    <div>
      <FormControl fullWidth>
        <InputLabel id="menu-item-select-label">Select Menu Item</InputLabel>
        <Select
          labelId="menu-item-select-label"
          id="menu-item-select"
          value={selectedMenuItem?._id || ''}
          label="Select Menu Item"
          onChange={handleMenuItemChange}
        >
          {menuItems.map((item) => (
            <MenuItem key={item._id} value={item._id}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {selectedMenuItem && (
        <FormControl fullWidth margin="normal">
          <InputLabel id="serving-option-select-label">Serving Option</InputLabel>
          <Select
            labelId="serving-option-select-label"
            id="serving-option-select"
            value={selectedServingOption}
            label="Serving Option"
            onChange={handleServingOptionChange}
          >
            {selectedMenuItem.recipe.servingVariations.map((variation, index) => (
              <MenuItem key={index} value={variation.servingOption}>
                {variation.servingOption}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {selectedMenuItem && selectedServingOption && (
        <List dense>
          {selectedMenuItem.recipe.baseIngredients.map((ingredient) => (
            <ListItem key={ingredient.inventoryItemId}>
              <ListItemText
                primary={`Ingredient: ${ingredient.inventoryItemId.name}, Quantity: ${ingredient.quantity}`}
              />
            </ListItem>
          ))}
          {selectedMenuItem.recipe.servingVariations
            .find((variation) => variation.servingOption === selectedServingOption)
            ?.adjustments.map((adjustment, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`Adjustment: ${
                    adjustment.inventoryItemId?.name || 'N/A'
                  }, Quantity Adjustment: ${adjustment.quantityAdjustment}`}
                />
              </ListItem>
            ))}
        </List>
      )}
    </div>
  );
}

export default MenuPage;
