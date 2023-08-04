import { useGetOrdersByTableId } from 'api/service';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Checkout } from 'shared/Checkout/Checkout';
import { OrdersList } from 'shared/OrdersList/OrdersList';
import OrderListSkeleton from 'shared/Skeletons/OrderSkeleton/OrderSkeleton';

export const CustomerOrders = () => {
  const [selectedTotal, setSelectedTotal] = useState(0);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const { restId, tableId } = useParams();
  const onChangeSelected = (price, selectedOrders) => {
    setSelectedTotal(price);
    setSelectedOrders(selectedOrders);
  };

  const {
    data: { data } = {},
    isError,
    isLoading,
    isRefetching,
  } = useGetOrdersByTableId(restId, tableId);

  return (
    <>
      {isLoading ? (
        <OrderListSkeleton />
      ) : (
        <OrdersList
          orders={data?.data?.orders || []}
          onChangeSelected={onChangeSelected}
          selectedTotal={selectedTotal}
          selectedOrders={selectedOrders}
        />
      )}

      <Checkout amount={selectedTotal} selectedOrders={selectedOrders} />
    </>
  );
};