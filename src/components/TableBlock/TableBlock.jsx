import { Table } from 'react-bootstrap';
import classNames from 'classnames';

import fixedNum from '../../helpers/fixedNum';

import styles from './TableBlock.module.scss';

const TableBlock = ({ data, coinsPrice }) => {

  return Object.keys(data).map(coin => {

      const orderAmount = data[coin].reduce((reducer, row) => row[2] === 'BUY' ? reducer + +row[4] : reducer - +row[4], 0) * (1 - 0.001);
      const averagePrice = fixedNum((data[coin].reduce((reducer, row) => row[2] === 'BUY' && reducer + +row[5], 0)) / data[coin].filter(coin => coin[2] === 'BUY').length, 4);
      const total = fixedNum(data[coin].reduce((reducer, row) => row[2] === 'BUY' ? reducer + +row[7] : reducer - +row[7], 0), 2);
      const currentValue = fixedNum(coinsPrice[coin] * orderAmount, 2);
      const diff = fixedNum(currentValue - total, 2);

      return (total >= 1 && <div className={styles.tableWrapper}>
          <Table className={styles.table} key={coin} variant='dark'>
            <thead>
            <tr className={styles.title}>
              <th colSpan='9'>{coin.slice(0, -4)}</th>
            </tr>
            <tr className={styles.header}>
              <th>Date</th>
              <th>Type</th>
              <th>Order Amount</th>
              <th>Fee</th>
              <th>Price</th>
              <th>Total</th>
              <th>Current Price</th>
              <th>Current Value</th>
              <th>Diff</th>
            </tr>
            </thead>
            <tbody>
            {data[coin].map(row => (
              <tr key={row[0]}>
                <td>{row[0]}</td>
                <td>{row[2]}</td>
                <td>{row[4]}</td>
                <td>{fixedNum(row[4] - row[4] * (1 - 0.001), 8)}</td>
                <td>{fixedNum(row[5], 4)}</td>
                <td>${fixedNum(row[7], 2)}</td>
                <td />
                <td />
                <td />
              </tr>
            ))}
            <tr className={classNames(styles.totalRow, { [styles.positive]: diff >= 0, [styles.negative]: diff < 0 })}>
              <td>Total</td>
              <td />
              <td colSpan='2'>{fixedNum(orderAmount, 5)}</td>
              <td>{averagePrice}</td>
              <td>${total}</td>
              <td>{fixedNum(coinsPrice[coin], 4) || 'Pending...'}</td>
              <td>{currentValue || 'Pending...'}</td>
              <td>{diff || 'Pending...'}</td>
            </tr>
            </tbody>
          </Table>
        </div>
      );
    }
  );
};

export default TableBlock;
