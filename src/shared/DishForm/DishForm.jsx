import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';

import Button from 'shared/Button/Button';
import Input from 'shared/Input/Input';
import Select from 'shared/Select/Select';
import Text from 'shared/Text/Text';
import Title from 'shared/Title/Title';
import DishIngredients from './DishIngridiens/DishIngridiens';

import { LiaWeightSolid } from 'react-icons/lia';
import { LiaMoneyBillSolid } from 'react-icons/lia';
import { GiWeight } from 'react-icons/gi';

import classes from './DishForm.module.scss';
import * as initialData from './InitialState';

const DishForm = () => {
  const [selectedIngredients, setSelectedIngredients] = useState(new Set());
  const [selectedType, setSelectedType] = useState('');
  const [filteredIngredients, setFilteredIngredients] = useState(initialData.ingredientsList);

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    shouldUseNativeValidation: false,
    mode: 'onSubmit',
  });

  const handleRemoveIngredient = (ingredientId) => {
    setSelectedIngredients((prevIngredients) => {
      const newIngredients = new Set(prevIngredients);
      newIngredients.delete(ingredientId);
      return newIngredients;
    });
  };

  const handleIngredientChange = (ingredientId) => {
    setSelectedIngredients((prevIngredients) => {
      if (prevIngredients.has(ingredientId)) {
        return prevIngredients;
      } else {
        const newIngredients = new Set(prevIngredients);
        newIngredients.add(ingredientId);
        return newIngredients;
      }
    });
  };

  const handleTypeChange = (event) => {
    const newType = event.target.value;
    setSelectedType(newType);

    if (!newType) {
      setFilteredIngredients(initialData.ingredientsList);
    } else {
      const filtered = initialData.ingredientsList.filter(
        (ingredient) => ingredient.type === newType
      );
      setFilteredIngredients(filtered);
    }
  };

  const onSubmit = async (data) => {
    console.log(data);
    console.log(selectedIngredients);
    reset();
    setSelectedIngredients(new Set());
    setSelectedType('');
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.form}>
        <Title mode="h2">Create dish</Title>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={classes.field__wrapper}>
            <Input
              name="name"
              placeholder="Dish name"
              size="sm"
              rules={{
                required: 'Dish name is required',
                minLength: {
                  value: 3,
                  message: 'Dish name must be at least 3 characters long',
                },
                maxLength: {
                  value: 50,
                  message: 'Dish name cannot exceed 50 characters',
                },
                pattern: {
                  value: /^[a-zA-Zа-яА-Я0-9\s]+$/,
                  message: 'Dish name can only contain letters, numbers, and spaces',
                },
              }}
              register={register}
            />
            {errors.name && (
              <Text
                mode="p"
                textAlign="center"
                fontSize={8}
                fontWeight={400}
                color="var(--color-danger)"
              >
                {errors.name.message}
              </Text>
            )}
          </div>
          <div className={classes.column__wrapper}>
            <div className={classes.column}>
              <div className={classes.field__wrapper}>Picture</div>
            </div>
            <div className={classes.column}>
              <div className={classes.field__wrapper}>
                <Select
                  name="type"
                  defaultValue=""
                  register={register}
                  size="sm"
                  rules={{
                    required: 'Dish type is required',
                  }}
                >
                  <option value="" disabled hidden style={{ color: 'var(--color-danger)' }}>
                    Select dish type
                  </option>
                  {initialData.typesOfDishes.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
                {errors.type && (
                  <Text
                    mode="p"
                    textAlign="center"
                    fontSize={8}
                    fontWeight={400}
                    color="var(--color-danger)"
                  >
                    {errors.type.message}
                  </Text>
                )}
              </div>
              <div className={classes.checkbox__wrapper}>
                <div>
                  <Input
                    type="checkbox"
                    label="vegetarian"
                    name="vegetarian"
                    register={register}
                    size={'sm'}
                  />
                </div>
                <div>
                  <Input
                    type="checkbox"
                    label="spicy"
                    name="spicy"
                    register={register}
                    size={'sm'}
                  />
                </div>
                <div>
                  <Input
                    type="checkbox"
                    label="pescatarian"
                    name="pescatarian"
                    register={register}
                    size={'sm'}
                  />
                </div>
              </div>

              <div className={classes.column__wrapper}>
                <div className={classes.column}>
                  <div className={classes.field__wrapper}>
                    <div className={classes.input_wrapper}>
                      <Input
                        type="number"
                        name="portionWeight"
                        placeholder="Weight (gram)"
                        size="sm"
                        rules={{
                          required: 'Dish weight is required',
                          pattern: {
                            value: /^[1-9]\d{0,3}$|^10000$/,
                            message: 'Dish weight must be a number between 1 and 10000',
                          },
                        }}
                        register={register}
                      />
                      <GiWeight className={classes.input_icon} />
                    </div>
                    {errors.portionWeight && (
                      <Text
                        mode="p"
                        textAlign="center"
                        fontSize={8}
                        fontWeight={400}
                        color="var(--color-danger)"
                      >
                        {errors.portionWeight.message}
                      </Text>
                    )}
                  </div>
                </div>
                <div className={classes.column}>
                  <div className={classes.field__wrapper}>
                    <div className={classes.input_wrapper}>
                      <Input
                        type="text"
                        name="price"
                        placeholder="Price"
                        size="sm"
                        rules={{
                          required: 'Dish price is required',
                          pattern: {
                            value: /^(?!0\d)\d+(\.\d{1,2})?$/,
                            message:
                              'Dish price must be a positive number with up to 2 decimal places',
                          },
                        }}
                        register={register}
                      />
                      <LiaMoneyBillSolid className={classes.input_icon} />
                    </div>
                    {errors.price && (
                      <Text
                        mode="p"
                        textAlign="center"
                        fontSize={8}
                        fontWeight={400}
                        color="var(--color-danger)"
                      >
                        {errors.price.message}
                      </Text>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={classes.column__wrapper}>
            <DishIngredients
              selectedIngredients={selectedIngredients}
              setSelectedIngredients={setSelectedIngredients}
              handleRemoveIngredient={handleRemoveIngredient}
              handleIngredientChange={handleIngredientChange}
              selectedType={selectedType}
              handleTypeChange={handleTypeChange}
              filteredIngredients={filteredIngredients}
              errors={errors}
            />
          </div>

          <div className={classes.button__wrapper}>
            <Button type="submit" size="sm">
              Create
            </Button>
            <Button type="button" onClick={() => reset()} size="sm">
              Clear
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

DishForm.propTypes = {
  initialState: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    vegetarian: PropTypes.bool,
    spicy: PropTypes.bool,
    pescatarian: PropTypes.bool,
    portionWeigh: PropTypes.number,
    price: PropTypes.number,
    ingredients: PropTypes.arrayOf(PropTypes.string),
  }),
  buttonText: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

DishForm.defaultProps = {
  initialState: {
    name: '',
    type: '',
    vegetarian: false,
    spicy: false,
    pescatarian: false,
    portionWeigh: 0,
    price: 0,
    ingredients: [],
  },
  size: 'sm',
};

export default DishForm;
