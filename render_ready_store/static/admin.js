
async function loadOrders(){
let r=await fetch('/orders');
let data=await r.json();
orders.innerHTML='';
data.forEach(o=>{
orders.innerHTML+=`<div style="border:1px solid #ccc;padding:10px;margin:10px">
<b>Order #${o.OrderID}</b><br>
Customer: ${o.Customer}<br>
Items: ${o.Items}<br>
Status: ${o.Status}<br>
<button onclick="updateStatus(${o.OrderID},'Packed')">Packed</button>
<button onclick="updateStatus(${o.OrderID},'Shipped')">Shipped</button>
<button onclick="updateStatus(${o.OrderID},'Delivered')">Delivered</button></div>`;
});}
async function updateStatus(id,status){await fetch('/update-status/'+id+'/'+status);loadOrders();}
loadOrders();
