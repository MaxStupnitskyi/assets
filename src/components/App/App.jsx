import { useEffect, useState } from 'react';
import { Container, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import XLSX from 'xlsx';

import styles from './App.module.scss';

const App = () => {

  const [data, setData] = useState(null);
  const [coinsPrice, setCoinsPrice] = useState({});

  const handleFile = (file) => {
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;
    reader.onload = e => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array' });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 })
      .filter(row => row.includes('BUY') || row.includes('SELL'));

      const coins = Array.from(new Set(data.map(item => item[1])));

      const results = {};

      coins.forEach(coin => {
        results[coin] = data.filter(item => item[1] === coin);
      });

      console.log(results);

      setData(results);
    };
    if (rABS) {
      reader.readAsBinaryString(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  const handleChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) handleFile(files[0]);
  };

  useEffect(() => {
    data && Object.keys(data).forEach(async coin => {
      try {
        await fetch(`https://api1.binance.com/api/v3/ticker/price?symbol=${coin}`)
        .then(response => response.json())
        .then(({ symbol, price }) => setCoinsPrice(prevState => ({ ...prevState, [symbol]: price })));
      } catch (e) {
        console.error(e);
      }
    });
  }, [data]);

  useEffect(() => {
    console.log(coinsPrice);
  }, [coinsPrice]);

  const TableBlock = () => {
    return Object.keys(data).map(coin => (
        <Table key={coin} variant='dark'>
          <thead>
          <tr className={styles.title}>
            <th colSpan='7'>{coin.slice(0, -4)}</th>
          </tr>
          <tr className={styles.header}>
            <th>Date</th>
            <th>Type</th>
            <th>Order Amount</th>
            <th>Price</th>
            <th>Total Spend</th>
            <th>Current Price</th>
            <th>Current Value</th>
          </tr>
          </thead>
          <tbody>
          {data[coin].map(row => (
            <tr key={row[0]}>
              <td>{row[0]}</td>
              <td>{row[2]}</td>
              <td>{row[4]}</td>
              <td>{parseFloat(Number(row[5]).toFixed(5))}</td>
              <td>{row[7]}</td>
              <td />
              <td />
            </tr>
          ))}
          <tr className={styles.totalRow}>
            <td>Total</td>
            <td />
            <td>{parseFloat(data[coin].reduce((reducer, row) => row[2] === 'BUY' ? reducer + +row[4] : reducer - +row[4], 0).toFixed(5))}</td>
            <td>{(data[coin].reduce((reducer, row) => reducer + +row[5], 0)) / data[coin].length}</td>
            <td>{data[coin].reduce((reducer, row) => row[2] === 'BUY' ? reducer + +row[7] : reducer - +row[7], 0).toFixed(2)}</td>
            <td>{coinsPrice[coin]}</td>
            <td>{(coinsPrice[coin] * data[coin].reduce((reducer, row) => row[2] === 'BUY' ? reducer + +row[4] : reducer - +row[4], 0)).toFixed(2)}</td>
          </tr>
          </tbody>
        </Table>
      )
    );
  };

  return (
    <div className={styles.app}>
      <Container>
        <input onChange={(e) => handleChange(e)} type='file' />
        {data && <TableBlock />}
      </Container>
    </div>
  );
};

export default App;
