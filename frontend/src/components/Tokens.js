import React from "react";
import axios from "axios";

function Tokens({wallet, chain, tokens, setTokens}) {


  async function getTokenBalances() {
    const response = await axios.get("http://localhost:3000/tokenBalances", {
      params: {
        address: wallet,
        chain: chain,
      },
    });
    console.log(response);
    setTokens(response.data.legitTokens);

  }

  return (
    <>
      <p>
        <button onClick={getTokenBalances}>Get Tokens</button>
        <br />
        {tokens.length > 0 &&
          tokens.map((e) => {
            return (
              <>
                <span>
                  {e.symbol} {e.bal}, (${e.val})
                </span>
                <br />
              </>
            );
          })}
      </p>
    </>
  );
}

export default Tokens;
