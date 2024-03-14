import { useCallback, useState } from 'react';
import { fetchUSDT, fetchWETH } from './api/client';
import { debounce } from 'lodash';

function App() {
  const [WETHAmount, setWETHAmount] = useState('0');
  const [USDTAmount, setUSDTAmount] = useState('0');
  const [action, setAction] = useState(true);
  const [isLoadingWETH, setIsLoadingWETH] = useState(false);
  const [isLoadingUSDT, setIsLoadingUSDT] = useState(false);

  const deboundedWETH = useCallback(debounce((value) => {
    let amount = value;

    if (parseFloat(value) < 0.00001) {
      amount = (Math.ceil(parseFloat(value) * 100000) / 100000).toFixed(5);
    }

    getUSDT(amount);
    setWETHAmount(() => amount);
  }, 1500), []);

  const getUSDT = (value: string) => {

    fetchUSDT(value)
      .then(data => (data) && setUSDTAmount(data))
      .catch(err => console.log(err))
      .finally(() => setIsLoadingUSDT(false));
  }

  const handleSetWETH = (value: string) => {
    if (isNaN(parseFloat(value))) {
      console.log('NaN WETH');
      return;
    }
    setWETHAmount(() => value);

    setIsLoadingUSDT(true);
    deboundedWETH(value);
  }

  const deboundedUSDT = useCallback(debounce((value) => {
    let amount = value;

    console.log(amount)
    if (parseFloat(value) < 0.01) {
      amount = (Math.ceil(parseFloat(value) * 100) / 100).toFixed(2);
    }
    console.log(amount)

    getWETH(amount);
    setUSDTAmount(() => amount);
  }, 1500), []);

  const getWETH = (value: string) => {
    fetchWETH(value)
      .then(data => (data) && setWETHAmount(data))
      .catch(err => console.log(err))
      .finally(() => setIsLoadingWETH(false));
  }

  const handleSetUSDT = (value: string) => {
    if (isNaN(parseFloat(value))) {
      console.log('NaN WETH');
      return;
    }
    setUSDTAmount(() => value);

    setIsLoadingWETH(true);
    deboundedUSDT(value);
  }

  return (
    <div className='container'>
      <div className='box'>
        {(isLoadingWETH) && (
          <div className='loader-wrap'>
            <div className='loader' />
          </div>
        )}

        <p>
          ETH amount:
        </p>

        <input
          type='number'
          placeholder='0'
          value={WETHAmount}
          onChange={(event) => handleSetWETH(event.target.value)}
          readOnly={!action}
        >
        </input>
      </div>

      <div className='box'>
        <p>
          Action:
        </p>

        <div className='box-line'>
          <label className='switch'>
            <input type='checkbox' onChange={() => setAction(!action)} />
            <span className="switch-slider"> </span>
          </label>

          <p>{(action) ? 'Buy' : 'Sell'}</p>
        </div>
      </div>

      <div className='box'>
        {(isLoadingUSDT) && (
          <div className='loader-wrap'>
            <div className='loader' />
          </div>
        )}

        <p>
          {(action) ? (<p>You will receive:</p>) : (<p>It will cost:</p>)}
        </p>

        <input
          type='number'
          placeholder='0'
          value={USDTAmount}
          onChange={(event) => handleSetUSDT(event.target.value)}
          readOnly={action}
        >
        </input>
      </div>
    </div>
  )
}

export default App
