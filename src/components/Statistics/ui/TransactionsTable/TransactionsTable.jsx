import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { getDate } from 'helpers/getDate';
import { useGetTransactions } from 'api/transactions';
import { useParams } from 'react-router-dom';
import cls from './TransactionsTable.module.scss';
import { IconButton } from 'shared/IconButton/IconButton';
import {
  TfiAngleDoubleLeft,
  TfiAngleDoubleRight,
  TfiAngleLeft,
  TfiAngleRight,
} from 'react-icons/tfi';
import Text from 'shared/Text/Text';
import Loader from 'shared/Loader/Loader';

export const TransactionsTable = () => {
  const { restId } = useParams();

  const columns = useMemo(
    () => [
      {
        header: 'Transaction',
        footer: (props) => props.column._id,
        columns: [
          {
            id: '№',
            accessorFn: (row, rowIndex) => rowIndex + 1,
            cell: (info) => info.getValue(),
            footer: (props) => props.column.totalCount,
          },
          {
            accessorFn: (row) => row.paymentAmount,
            id: 'paymnetAmount',
            cell: (info) => info.getValue(),
            header: () => <span>Amount $</span>,
            footer: (props) => props.column.id,
          },
          {
            accessorFn: (row) => row.type,
            id: 'typeTransaction',
            cell: (info) => info.getValue(),
            header: () => <span>Type</span>,
            footer: (props) => props.column.id,
          },
          {
            accessorFn: (row) => row.createdAt,
            id: 'createdAt',
            cell: (info) => {
              const date = info.getValue();
              return <span>{getDate(date)}</span>;
            },
            header: () => <span>Created at</span>,
            footer: (props) => props.column.id,
          },
        ],
      },
      {
        header: 'Created by',
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: 'createdByType',
            header: () => <span>Type</span>,
            footer: (props) => props.column.id,
          },
          {
            accessorKey: 'createdByName',
            header: 'Name',
            cell: (info) => {
              const name = info.getValue();
              return <span>{name ? name : '-'}</span>;
            },
            footer: (props) => props.column.id,
          },
        ],
      },
    ],
    []
  );

  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const fetchDataOptions = {
    pageIndex,
    pageSize,
  };

  const { data: resp, refetch, isFetching } = useGetTransactions(restId, fetchDataOptions);

  const defaultData = useMemo(() => [], []);

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  useEffect(() => {
    refetch();
  }, [pageIndex, pageSize, refetch]);

  const table = useReactTable({
    data: resp?.data?.tableTransactions.transactions ?? defaultData,
    columns,
    pageCount: resp?.data?.tableTransactions.pageCount ?? -1,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    debugTable: true,
  });

  return (
    <div className={cls.box}>
      <div className={cls.btnsBox}>
        <div className={cls.paginationBox}>
          <IconButton
            size={25}
            mode={'filled'}
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            Svg={TfiAngleDoubleLeft}
          />
          <IconButton
            size={25}
            mode={'outlined'}
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            Svg={TfiAngleLeft}
          />
          <IconButton
            mode={'outlined'}
            size={25}
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            Svg={TfiAngleRight}
          />
          <IconButton
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            size={25}
            mode={'filled'}
            Svg={TfiAngleDoubleRight}
          />
        </div>
        <div className={cls.inputBox}>
          <Text fontSize={20}>Page</Text>
          <Text fontSize={20}>
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </Text>
          <Text fontSize={20}>| Go to page:</Text>
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className={cls.input}
          />
          <div className={cls.loader}>{isFetching && <Loader size="xs" />}</div>
        </div>
        <div className={cls.select}>
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
      <table className={cls.table}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr className={cls.tr} key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan} className={cls.th}>
                    {header.isPlaceholder ? null : (
                      <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td key={cell.id} className={cls.td}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
