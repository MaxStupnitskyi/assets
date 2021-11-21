import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import XLSX from 'xlsx';

import TableBlock from '../TableBlock';
import TotalTable from '../TotalTable';

import styles from './App.module.scss';

const App = () => {

  const [data, setData] = useState(JSON.parse(localStorage.getItem('data')));
  const [coinsPrice, setCoinsPrice] = useState({});

  const fetchRates = () => {
    data && Object.keys(data).forEach(async coin => {
      try {
        await fetch(`https://api1.binance.com/api/v3/ticker/price?symbol=${coin}`)
        .then(response => response.json())
        .then(({ symbol, price }) => setCoinsPrice(prevState => ({ ...prevState, [symbol]: price })));
      } catch (e) {
        console.error(e);
      }
    });
  }

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

      setData(results);
      localStorage.setItem('data', JSON.stringify(results));
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
    fetchRates();
    const timerId = setInterval(() => {
      fetchRates()
    }, 10000);

    return () => clearInterval(timerId);

  }, [data]);

  return (
    <div className={styles.app}>
      <Container>
        <input onChange={(e) => handleChange(e)} type='file' />
        {data && <TableBlock data={data} coinsPrice={coinsPrice} />}
        {data && <TotalTable />}
      </Container>
    </div>
  );
};

export default App;
