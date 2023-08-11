import { useGetTablesByRestaurantId, useGetOrdersByRestaurantId } from 'api/service';
import Loader from 'shared/Loader/Loader';
import Title from 'shared/Title/Title';
import styles from './TablesWaiterPage.module.scss';
import TableCard from 'components/TableCard/TableCard';
import { toast } from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

import Message from 'components/Message/Message';
import { useSSE } from 'react-hooks-sse';

const dumbTables = [
  {
    table_number: '1',
    restaurant_id: '64c4fdea4055a7111092df32',
    seats: '3',
    status: 'Called waiter',
    _id: '64ce43064f5d2308d5e67258',
  },
  {
    table_number: '2',
    restaurant_id: '64c4fdea4055a7111092df32',
    seats: '3',
    status: 'Free',
    _id: '64c4f7db4055a7111092df12',
  },
  {
    table_number: '3',
    restaurant_id: '64c4fdea4055a7111092df32',
    seats: '3',
    status: 'Taken',
    _id: '64c4fe004055a7111092df34',
  },
  {
    table_number: '4',
    restaurant_id: '64c4fdea4055a7111092df32',
    seats: '3',
    status: 'Free',
    _id: '64c4f7db4055a7111092df12',
  },
  {
    table_number: '5',
    restaurant_id: '64c4fdea4055a7111092df32',
    seats: '3',
    status: 'Taken',
    _id: '64c4f7db4055a7111092df12',
  },
  {
    table_number: '6',
    restaurant_id: '64c4fdea4055a7111092df32',
    seats: '3',
    status: 'Free',
    _id: '64c4f7db4055a7111092df12',
  },
];

const TablesWaiterPage = () => {
  const updateTableStatusEvent = useSSE('table status', {});
  const dishReadyEvent = useSSE('dish is ready', {});
  console.log('Call Waiter SSE Event:', updateTableStatusEvent);
  console.log('Dish Event:', dishReadyEvent);

  const { restId } = useParams();

  const {
    data: tablesData,
    isLoading: isLoadingTables,
    isError: isErrorTables,
    error: errorTables,
  } = useGetTablesByRestaurantId(restId);

  const {
    data: ordersData,
    isLoading: isLoadingOrders,
    isError: isErrorOrders,
    error: errorOrders,
  } = useGetOrdersByRestaurantId(restId);

  const tables = tablesData?.data;
  const orders = ordersData?.data.data.orders;

  const isLoading = isLoadingTables || isLoadingOrders;

  if (isLoading) {
    return <Loader size="lg" />;
  }

  const hasError = isErrorTables || isErrorOrders;

  if (hasError) {
    toast.error('Something went wrong!');
  }

  const filterOrdersByTableId = (orders, table_id) =>
    orders?.filter((order) => order.table_id === table_id);

  return (
    <div className={styles.tables}>
      <Title>Tables Board</Title>
      <div className={styles.tables__container}>
        {tables?.map((table) => (
          <TableCard
            key={table.table_number}
            table_number={table.table_number}
            restaurant_id={table.restaurant_id}
            seats={table.seats}
            status={table.status}
            table_id={table._id}
            orders={filterOrdersByTableId(orders, table._id)}
          />
        ))}
      </div>
      <Message />
    </div>
  );
};

export default TablesWaiterPage;
