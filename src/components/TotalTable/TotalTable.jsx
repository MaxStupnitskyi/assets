import { Table } from 'react-bootstrap';

import fixedNum from '../../helpers/fixedNum';

import styles from './TotalTable.module.scss';
import classNames from 'classnames';

const TotalTable = ({ data, coinsPrice }) => {

  const total = Object.keys(data).reduce((reducer, coin) => {
    return reducer + fixedNum(data[coin].reduce((reducer, row) => reducer + +row[7], 0), 2);
  }, 0);
  const current = Object.keys(data).reduce((reducer, coin) => {
    const orderAmount = data[coin].reduce((red, row) => red + +row[4], 0) * (1 - 0.001);
    return reducer + (orderAmount * coinsPrice[coin]);
  }, 0);
  const diff = fixedNum(current - total, 2);
  const percentage = fixedNum(current * 100 / total, 2);
  const percentDiff = fixedNum(percentage - 100, 2);

  return (<div className={styles.tableWrapper}>
      <Table className={styles.table}>
        <thead>
        <tr className={styles.titleRow}>
          <th>Total Spend</th>
          <th>Current Value</th>
          <th>Diff</th>
        </tr>
        </thead>
        <tbody>
        <tr className={classNames(styles.totalRow, { [styles.positive]: diff >= 0, [styles.negative]: diff < 0 })}>
          <td>{fixedNum(total, 2)}$</td>
          <td>{fixedNum(current, 2)}$</td>
          <td>{diff}$ ({percentDiff}%)</td>
        </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default TotalTable;
