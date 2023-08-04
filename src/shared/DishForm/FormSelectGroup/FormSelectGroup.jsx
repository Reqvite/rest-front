import React, { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';

import { FaSearch } from 'react-icons/fa';
import { BiSolidTrash } from 'react-icons/bi';

import Select from 'shared/Select/Select';
import Input from 'shared/Input/Input';
import Text from 'shared/Text/Text';

import classes from './FormSelectGroup.module.scss';
import * as initialData from '../InitialState';

const FormSelectGroup = ({
  selectedType,
  handleTypeChange,
  filteredIngredients,
  control,
  fields,
  append,
  remove,
  setError,
  clearErrors,
  error,
  isSubmitted,
  isSubmitSuccessful,
}) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (isSubmitSuccessful) {
      clearErrors('ingredients');
      return;
    }

    if (fields.length === 0 && isSubmitted) {
      setError('ingredients', {
        type: 'manual',
        message: 'At least one ingredient is required',
      });
    } else {
      clearErrors('ingredients');
    }
  }, [fields, isSubmitted, isSubmitSuccessful, setError, clearErrors]);

  const AddIngredient = (ingredientId) => {
    const isAlreadyAdded = fields.some((field) => field === ingredientId);

    if (!isAlreadyAdded) {
      append(ingredientId.toString()); // Додаємо об'єкт із ідентифікатором
    }
  };

  const handleInputKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const enteredIngredient = event.target.value;
      const isAlreadyAdded = fields.some((field) => field === enteredIngredient);

      if (!isAlreadyAdded) {
        const matchedIngredient = filteredIngredients.find(
          (ingredient) => ingredient.name.toLowerCase() === enteredIngredient.toLowerCase()
        );

        if (matchedIngredient) {
          append(matchedIngredient.id.toString());
        }
      }

      setInputValue('');
    }
  };

  const handleAddIngredient = () => {
    const matchedIngredient = initialData.ingredientsList.find(
      (ingredient) => ingredient.name.toLowerCase() === inputValue.toLowerCase()
    );

    if (matchedIngredient) {
      setSelectedIngredients((prevIngredients) => [...prevIngredients, matchedIngredient]);
      setInputValue('');
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const filteredIngredientsToShow = filteredIngredients.filter((ingredient) => {
    const nameMatchesInput = ingredient.name.toLowerCase().includes(inputValue.toLowerCase());
    const isSelectedTypeAll = selectedType === '';
    const isSelectedTypeMatching = ingredient.type === selectedType;
    return (isSelectedTypeAll || isSelectedTypeMatching) && nameMatchesInput;
  });

  return (
    <>
      <div className={classes.column}>
        <div className={classes.field__wrapper}>
          <div className={classes.input__wrapper}>
            <Input
              type="text"
              name="ingredient"
              placeholder="Your ingredient"
              size="sm"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              autoComplete="off"
              isFullWidth={true}
            />
            <FaSearch onClick={handleAddIngredient} className={classes.input__icon} />
          </div>
        </div>
        <div className={classes.field__wrapper}>
          <Select id="type" value={selectedType} onChange={handleTypeChange} size="sm">
            <option value="">All</option>
            {initialData.typesOfIngredients.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </div>
        <div className={classes.field__wrapper}>
          <div className={classes.section__select}>
            <ul>
              {filteredIngredientsToShow.map((ingredient) => {
                return (
                  <li key={ingredient.id} onClick={() => AddIngredient(ingredient.id)}>
                    {ingredient.name}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
      <div className={classes.column}>
        {fields.map((field, index) => (
          <div key={field.id}>
            <Controller
              name={`ingredients[${index}]`}
              control={control}
              render={({ field }) => (
                <div>
                  <input {...field} type="hidden" />{' '}
                  {initialData.ingredientsList.find((ing) => ing.id === parseInt(field.value))
                    ?.name || 'Unknown Ingredient'}
                  <div className={classes.icon_wrapper} onClick={() => remove(index)}>
                    <BiSolidTrash />
                  </div>
                </div>
              )}
            />
          </div>
        ))}
        {error.ingredients && (
          <Text mode="p" textAlign="left" fontSize={8} fontWeight={400} color="var(--color-gray)">
            {error.ingredients.message}
          </Text>
        )}
      </div>
    </>
  );
};

export default FormSelectGroup;
