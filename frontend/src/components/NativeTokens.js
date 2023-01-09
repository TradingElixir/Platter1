import React from "react";
import axios from "axios";

function NativeTokens({ wallet, chain, nativeBalance, setNativeBalance, nativeValue, setNativeValue  }) {



  async function getNativeBalance() {
    const response = await axios.get(`http://localhost:3000/nativeBalance`, {
      params: {
        address: wallet,
        chain: chain,
      },
    });
    console.log(response);
    
      setNativeBalance((response.data.result2.balance / 1E18).toFixed(3))
    setNativeValue(((Number(response.data.result2.balance)/1E18) * Number(response.data.result1.usdPrice)).toFixed(3))
    
  }

  return (
    <>
      <h1>Fetch Tokens</h1>
      <p>
        <button onClick={getNativeBalance}>Fetch Balance</button>
        <br />
        <span>
          Native Balance: {nativeBalance}, (${nativeValue})
        </span>
      </p>
    </>
  );
}

export default NativeTokens;
