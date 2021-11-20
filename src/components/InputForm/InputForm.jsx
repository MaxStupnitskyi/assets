import { useEffect, useState } from 'react';

import { Form, Button } from 'react-bootstrap';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

import styles from './InputForm.module.scss';

const InputForm = () => {
  const [date, setDate] = useState('');
  const [coin, setCoin] = useState('');
  const [orderPrice, setOrderPrice] = useState('');
  const [orderAmount, setOrderAmount] = useState('');

  const [spend, setSpend] = useState(null);
  const [current, setCurrent] = useState(null);
  const [diff, setDiff] = useState(null);

  const [history, setHistory] = useState([]);

  const [coinsPrice, setCoinsPrice] = useState({});

  const coins = ['1INCH', 'VET', 'DOGE', 'HBAR', 'ICP'];

  const addItem = () => {
    const spend = orderPrice * orderAmount;
    setSpend(spend);
    // const current;
    // const diff;
  };

  useEffect(() => {
    console.log('work');
    coins.forEach(async coin => {

      try {
        await fetch(`https://api1.binance.com/api/v3/ticker/price?symbol=${coin}USDT`)
        .then(response => response.json())
        .then(({ symbol, price }) => setCoinsPrice(prevState => ({ ...prevState, [symbol]: price })));
      } catch (e) {
        console.error(e);
      }

    });
  }, []);

  useEffect(() => {
    console.log(coinsPrice);
  }, [coinsPrice]);

  useEffect(() => {
    localStorage.setItem('history', JSON.stringify(history));
  }, [history]);

  return (
    <Form onSubmit={() => addItem()} className={styles.form}>
      <FloatingLabel
        className={styles.formItem}
        controlId='floatingInput'
        label='Date'
      >
        <Form.Control type='text' placeholder='Date' value={date} onChange={(e) => setDate(e.target.value)} />
      </FloatingLabel>
      <FloatingLabel
        className={styles.formItem}
        controlId='floatingInput'
        label='Coin'
      >
        <Form.Control type='text' placeholder='Coin' value={coin} onChange={(e) => setCoin(e.target.value)} />
      </FloatingLabel>
      <FloatingLabel
        className={styles.formItem}
        controlId='floatingInput'
        label='Order Price'
      >
        <Form.Control type='number' placeholder='Order Price' value={orderPrice}
                      onChange={(e) => setOrderPrice(e.target.value)} />
      </FloatingLabel>
      <FloatingLabel
        className={styles.formItem}
        controlId='floatingInput'
        label='Order Amount'
      >
        <Form.Control type='number' placeholder='Order Amount' value={orderAmount}
                      onChange={(e) => setOrderAmount(e.target.value)} />
      </FloatingLabel>
      <Button variant='primary' type='submit'>
        Submit
      </Button>
    </Form>
  );
};

export default InputForm;
