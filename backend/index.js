const express = require("express");
const Moralis = require("moralis").default;
const app = express();
const cors = require("cors");
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/nativeBalance", async (req, res) => {
  try {
    const { address, chain } = req.query;
    let balanc;

    balanc = await Moralis.EvmApi.balance.getNativeBalance({
      address: address,
      chain: chain,
    });

    const result2 = balanc.raw;

    let wallet;
    if (chain === "0xfa") {
      wallet = "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83";
    } else if (chain === "0x1") {
      wallet = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
    } else if (chain === "0x89") {
      wallet = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270";
    } else if (chain === "0x38") {
      wallet = "0x242a1ff6ee06f2131b7924cacb74c7f9e3a5edc9";
    }

    const response = await Moralis.EvmApi.token.getTokenPrice({
      address: wallet,
      chain,
    });
    const result1 = response.raw;

    return res.status(200).json({ result2, result1 });
  } catch (e) {
    console.log(e);
    console.log("something went wrong");
    return res.status(400).json();
  }
});

app.get("/tokenBalances", async (req, res) => {
  try {
    const { address, chain } = req.query;

    const response = await Moralis.EvmApi.token.getWalletTokenBalances({
      address: address,
      chain: chain,
    });
    const tokens = response.raw;

    let legitTokens = [];
    for (let i = 0; i < tokens.length; i++) {
      try {
        const priceResponse = await Moralis.EvmApi.token.getTokenPrice({
          address: tokens[i].token_address,
          chain: chain,
        });
        const price = priceResponse.raw;

        if (price.usdPrice > 0.01) {
          tokens[i].usd = price.usdPrice;
          legitTokens.push(tokens[i]);
        } else {
          console.log("💩 coin");
        }
      } catch (e) {
        console.log(e);
      }
      const t = legitTokens;
      for (let i = 0; i < t.length; i++) {
        t[i].bal = (
          Number(t[i].balance) / Number(`1E${t[i].decimals}`)
        ).toFixed(3); //1E18
        t[i].val = (
          (Number(t[i].balance) / Number(`1E${t[i].decimals}`)) *
          Number(t[i].usd)
        ).toFixed(2);
      }
    }

    return res.status(200).json({ legitTokens });
  } catch (e) {
    console.log(e);
    console.log("something went wrong");
    return res.status(400).json();
  }
});

app.get("/tokenTransfers", async (req, res) => {
  try {
    const { address, chain } = req.query;

    const response = await Moralis.EvmApi.token.getWalletTokenTransfers({
      address: address,
      chain: chain,
    });

    const userTrans1 = response.raw;
    const userTrans = userTrans1.result;

    let userTransDetails = [];

    for (let i = 0; i < userTrans.length; i++) {
      try {
        const metaResponse1 = await Moralis.EvmApi.token.getTokenMetadata({
          addresses: [userTrans[i].address],
          chain: chain,
        });

        const metaResponse = metaResponse1.raw;

        userTrans[i].decimals = metaResponse.decimals;
        userTrans[i].symbol = metaResponse.symbol;
        userTransDetails.push(userTrans[i]);
      } catch (e) {
        console.log(e);
      }
    }
    return res.status(200).json({ userTransDetails });
  } catch (e) {
    console.log(e);
    console.log("something went wrong");
    return res.status(400).json();
  }
});

app.get("/nftBalance", async (req, res) => {
  try {
    const { address, chain } = req.query;
    console.log(`nft balance function chain => ${chain} address => ${address}`);
    const response = await Moralis.EvmApi.nft.getWalletNFTs({
      address,
      chain,
    });
    const userNFTs = response?.result;
    return res.status(200).json({ userNFTs });
  } catch (e) {
    console.log(e);
    console.log("something went wrong");
    return res.status(400).json();
  }
});

Moralis.start({
  apiKey: "RGu7JApF36seSKwH6bClRjYlQyuyRtzbvfrBIrb3wFSBUqdrPb4AXfrG7y3vC68x",
}).then(() => {
  app.listen(port, () => {
    console.log(`Listening for API Calls`);
  });
});
