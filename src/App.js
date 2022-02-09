import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";


function App() {
  const [orders,setOrders]=useState([]);
const [prices,setPrices]= useState(0);


  useEffect(() => {
    async function fetchData() {
      await axios
        .get("https://api.delta.exchange/v2/products")
        .then((data) =>{
    setOrders(data.data.result);})
        .catch((err) => console.log(err));
    }
    fetchData();
  },[]);

  var ws =  new WebSocket("wss://api.delta.exchange:2096");
 ws.onopen = function(e) {
  console.log("[open] Connection established");
  console.log("Sending to server");
  
    ws.send(JSON.stringify({
      "type": "subscribe",
      "payload": {
          "channels": [
            {name: "v2/ticker", symbols: ["BTCUSD", "BTCUSDT"]}
          ]
      }
  }))
  };
  ws.onmessage = function(event) {
    var res= JSON.parse(event.data);

if(prices===undefined){
  setPrices(0);
}
      setPrices(res.mark_price);
 
     console.log("prices",prices);
  };
  
  ws.onclose = function(event) {
    if (event.wasClean) {
      console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
      console.log('[close] Connection died');
    }
  };
  
  ws.onerror = function(error) {
    console.log(`[error] ${error.message}`);
  };



  return (
    <div className="App">
      <table className="table" style={{ width: "100%" }}>
        <tbody>
        <tr>
          <th>Symbol</th>
          <th>Description</th>
          <th>Underlying Asset</th>
          <th>Mark Price</th>
        </tr>
        {orders.map((order)=>{
          return (
            <tr key={order.id}>
              <td>{order.symbol}</td>
              <td>{order.description}</td>
              <td>{order.underlying_asset.name}</td>
              <td>{prices}</td>
            </tr>
          )
        })}
        </tbody>
      </table>
    </div>
  );
}

export default App;
