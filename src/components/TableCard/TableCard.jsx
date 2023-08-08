import styles from './TableCard.module.scss';
import StatusSelector from 'shared/StatusSelector/StatusSelector';
import Status from 'shared/Status/Status';
import Text from 'shared/Text/Text';
import Button from 'shared/Button/Button';
import { NavLink } from 'react-router-dom';
import { useChangeTableStatus } from 'api/service';
import { toast } from 'react-hot-toast';

const TableCard = ({ restaurant_id, table_number, table_id, status, orders }) => {
  const changeTableStatus = useChangeTableStatus();

  // const isItemFree = (item) => item === 'Free';

  // const areAllOrdersPaid = (orders) => orders.every((order) => order.status === 'Paid');

  // const allowChangeStatus = (item) => {
  //   if (isItemFree(item)) {
  //     return areAllOrdersPaid(orders) ? true : false;
  //   }
  //   return true;
  // };

  const changeStatus = async (item) => {
    try {
      await changeTableStatus.mutateAsync({ status: item, restaurant_id, table_id });
      return 'success';
    } catch (mutationError) {
      console.error('Mutation Error:', mutationError);
      toast.error(mutationError.response.data.message);
    }
  };

  return (
    <div className={styles.table}>
      <div className={styles.table__status}>
        <StatusSelector
          mode="tables"
          currentStatus={status}
          // allowChangeStatus={allowChangeStatus}
          changeStatusFunction={changeStatus}
        />
      </div>
      <div className={styles.table__body}>
        <Text fontSize={20}>Table # {table_number}</Text>
        <NavLink to={table_id}>
          <Button size="sm" mode="outlined">
            Details
          </Button>
        </NavLink>
      </div>
      <div className={styles.line}></div>
      <ul className={styles.table__list}>
        {orders?.map((order, index) => (
          <li className={styles.table__item} key={order._id}>
            <Text>Order # {index + 1}</Text>
            <Status statusCurrent={order.status} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableCard;
