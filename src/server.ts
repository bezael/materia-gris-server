import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import CoinGecko from 'coingecko-api';


const app = express();
app.use(cors());

const CoinGeckoClient = new CoinGecko();


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4501',
  },
});

io.on('connection', (socket) => {
  console.log('ready!');

  setInterval(async () => {
    const allDataBTC = await CoinGeckoClient.coins.fetchMarketChart('bitcoin');
    const allDataETH = await CoinGeckoClient.coins.fetchMarketChart('huobi-btc');

    const pricesBTC = allDataBTC.data.prices;
    const pricesETC = allDataETH.data.prices;


    socket.emit('push', {
      data: [
        { name: 'BTC', prices: pricesBTC },
        { name: 'ETH', prices: pricesETC },
      ],
    });
  }, 4500);
});

const port = process.env.PORT || 4500;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});


