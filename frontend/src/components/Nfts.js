import React from 'react'
import axios from "axios";


function Nfts({chain, wallet, nfts, setNfts}) {


  async function getUserNfts() {
     
     const response = await axios.get("http://localhost:3000/nftBalance", {
      params: {
        address: wallet,
        chain: chain,
      },
    });
      
       if (response.data.result) {
        nftProcessing(response.data.result);
      }
    }
  
    function nftProcessing(t) {
      for (let i = 0; i < t.length; i++) {
        let meta = JSON.parse(t[i].metadata);
        if (meta && meta.image) {
          if (meta.image.includes(".")) {
            t[i].image = meta.image;
          } else {
            t[i].image = "https://ipfs.moralis.io:2053/ipfs/" + meta.image;
          }
        }
      }
      setNfts(t);
      
    }

  return (
    <><h1>Portfolio NFTs</h1>
    <div>
      <button onClick={getUserNfts}>Fetch NFTs</button>
      
      <br />
      {nfts &&
        nfts.map((e) => {
          return (
            <>
              {e.image && <img src={e.image} width={200} />}
              <span>Name: {e.name}, </span>
              <span>(ID: {e.token_id})</span>
              <br />
            </>
          );
        })}
    </div></>
  )
      }

export default Nfts;