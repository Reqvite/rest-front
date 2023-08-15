import Button from 'shared/Button/Button';
import styles from './DishesItem.module.scss';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { IoIosClose } from 'react-icons/io';
import { useMediaQuery } from 'react-responsive';
import Text from 'shared/Text/Text';
import { MdTableBar } from 'react-icons/md';
import { BiDish } from 'react-icons/bi';
import { useCallback } from 'react';

const DishesItem = ({
  dish,
  quantity,
  handleChangeStatus,
  status,
  orderId,
  tableNumber,
  orderNumber,
  create,
}) => {
  const { restId } = useParams();

  const isTablet = useMediaQuery({
    query: '(max-width: 1200px)',
  });
  const isMobile = useMediaQuery({
    query: '(max-width: 767px)',
  });

  const sizeButton = isMobile ? 'md' : 'lg';
  const dateInMilliseconds = new Date(create).getTime();
  const timeForWaiting = Math.round((Date.now() - dateInMilliseconds) / 60000);

  return (
    <li className={`${styles.item}`}>
      <div className={`${styles.information}`}>
        <Text fontSize={24}>{dish.name}</Text>
        <div className={`${styles.information__quantity}`}>
          <IoIosClose size={24} />
          <Text fontSize={24}>{quantity}</Text>
        </div>
        <div className={`${styles.information__timeSection}`}>
          <p>Waiting:</p>
          <div className={`${styles.information__time}`}>
            <p>{timeForWaiting}</p>
            <p> min</p>
          </div>
        </div>
      </div>
      <div className={`${styles.information__order}`}>
        <div className={`${styles.information__data}`}>
          <MdTableBar size={24} color={'#959895'} />
          <span>{tableNumber}</span>
        </div>
        <div className={`${styles.information__data}`}>
          <BiDish size={24} color={'#959895'} />
          <span>{orderNumber}</span>
        </div>
      </div>

      {status !== 'In progress' && (
        <Button
          onClick={() => handleChangeStatus(restId, orderId, dish._id, 'In progress')}
          mode="outlined"
          size={sizeButton}
          className={`${styles.button}`}
        >
          {status === 'Ordered' ? 'Start cooking' : 'Return to сooking'}
        </Button>
      )}
      {status === 'In progress' && (
        <Button
          onClick={() => handleChangeStatus(restId, orderId, dish._id, 'Ready')}
          mode="outlined"
          size={sizeButton}
          className={`${styles.button}`}
        >
          Dish ready
        </Button>
      )}
    </li>
  );
};

DishesItem.propTypes = {
  dish: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    picture: PropTypes.string.isRequired,
  }).isRequired,
  quantity: PropTypes.number.isRequired,
  handleChangeStatus: PropTypes.func.isRequired,
  orderId: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  tableNumber: PropTypes.number.isRequired,
  orderNumber: PropTypes.string.isRequired,
  create: PropTypes.string.isRequired,
};

export default DishesItem;
