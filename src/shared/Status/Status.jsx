import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classes from './Status.module.scss';
import Text from '../Text/Text';

const Status = ({ statusCurrent }) => {
  const [statusColor, setStatusColor] = useState('green');

  useEffect(() => {
    switch (statusCurrent) {
      case 'free':
      case 'served':
      case 'payed':
        setStatusColor('green');
        break;

      case 'in progress':
      case 'taken':
        setStatusColor('#FFD700');
        break;

      case 'called waiter':
      case 'ready':
        setStatusColor('orange');
        break;

      case 'request bill':
      case 'ordered':
      case 'open':
        setStatusColor('red');
        break;
    }
  }, [statusCurrent]);

  return (
    <div
      style={{
        background: `${statusColor}`,
      }}
      className={classes.status}
    >
      <Text mode={'p'} fontSize={10}>
        {statusCurrent}
      </Text>
    </div>
  );
};

Status.propTypes = {
  statusCurrent: PropTypes.oneOf([
    'free',
    'taken',
    'called waiter',
    'request bill',
    'ordered',
    'in progress',
    'ready',
    'served',
    'open',
    'payed',
  ]).isRequired,
};

export default Status;
