import { Table } from 'react-bootstrap';
import classNames from 'classnames';

import fixedNum from '../../helpers/fixedNum';

import styles from './TableBlock.module.scss';

const TableBlock = ({ data, coinsPrice }) => {

  return Object.keys(data).map(coin => {

      const orderAmount = data[coin].reduce((reducer, row) => row[2] === 'BUY' ? reducer + +row[4] : reducer - +row[4], 0) * (1 - 0.001);
      const total = fixedNum(data[coin].reduce((reducer, row) => row[2] === 'BUY' ? reducer + +row[7] : reducer - +row[7], 0), 2);
      const currentValue = fixedNum(coinsPrice[coin] * orderAmount, 2);
      const diff = fixedNum(currentValue - total, 2);
      const percentage = fixedNum(currentValue * 100 / total, 2);
      const percentDiff = fixedNum(percentage - 100, 2);

      return (
        <Table className={styles.table} variant='dark' key={coin}>
          <thead>
          <tr className={classNames(styles.title, { [styles.positive]: diff >= 0, [styles.negative]: diff < 0 })}>
            <th>{coin.slice(0, -4)}</th>
            <th colSpan='8'>{diff ? `${diff}$ (${percentDiff}%)` : 'Loading...'}</th>
          </tr>
          <tr className={styles.header}>
            <th>Date</th>
            <th>Price (current)</th>
            <th>Total (current)</th>
            <th>Order Amount (fee)</th>
          </tr>
          </thead>
          <tbody>
          {data[coin].map(row => (
            <tr key={row[0]}>
              <td>{row[0]}</td>
              <td>{fixedNum(row[5], 4)}</td>
              <td>${fixedNum(row[7], 2)}</td>
              <td>{row[4]} ({fixedNum(row[4] - row[4] * (1 - 0.001), 8)})</td>
            </tr>
          ))}
          <tr className={styles.totalRow}>
            <td>Total</td>
            <td>{fixedNum(total / orderAmount, 4)} ({fixedNum(coinsPrice[coin], 4) || 'Loading...'})</td>
            <td>{total}$ ({`${currentValue}$` || 'Loading...'})</td>
            <td>{fixedNum(orderAmount, 5)}</td>
          </tr>
          </tbody>
        </Table>
      );
    }
  );
};

export default TableBlock;
