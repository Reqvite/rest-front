import PropTypes from 'prop-types';
import classes from './Menu.module.scss';
// import EmployeeCard from 'shared/EmployeeCard/EmployeeCard';
// import DishCard from 'shared/DishCard/DishCard';
import EmptyCard from 'shared/EmptyCard/EmptyCard';
import Title from 'shared/Title/Title';

const Menu = ({ mode, title = 'Menu', ...props }) => {
  // const fetchedListForRender = []; keep it here for future fetched data and send it via props to Card while mapping
  return (
    <>
      <Title>{title}</Title>
      <ul className={`${classes.menu_wrapper} ${classes[mode]}`}>
        {/*fetchedListForRender.map((item) => {
              return (
                <li className={classes.card_wrapper} key={item.id}>
                  <EmployeeCard data={item}></EmployeeCard> or <DishCard data={item}></DishCard>
                </li>
              );
            })
          : ''} */}
        <li className={classes.card_wrapper}>
          <EmptyCard></EmptyCard>
        </li>
      </ul>
    </>
  );
};

Menu.propTypes = {
  title: PropTypes.oneOf(['Menu', 'Employees']),
  mode: PropTypes.oneOf(['primary', 'outlined']),
};

export default Menu;