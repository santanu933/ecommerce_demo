
const products=[
{id:1,name:'Laptop',price:50000},
{id:2,name:'Phone',price:25000},
{id:3,name:'Monitor',price:12000},
{id:4,name:'Keyboard',price:1500}
];
let cart=[];
const productsDiv=document.getElementById('products');
products.forEach(p=>{
productsDiv.innerHTML+=`<div class='card'><h3>${p.name}</h3><p>₹${p.price}</p><button onclick='add(${p.id})'>Add</button></div>`;
});
function add(id){let p=products.find(x=>x.id===id);let e=cart.find(x=>x.id===id);if(e)e.qty++;else cart.push({...p,qty:1});render();}
function render(){let t=0;cartEl=document.getElementById('cart');cartEl.innerHTML=cart.map(i=>{t+=i.price*i.qty;return `${i.name} x ${i.qty}<br>`}).join('');total.innerText='₹'+t;}
async function placeOrder(){let r=await fetch('/place-order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:name.value,phone:phone.value,address:address.value,payment:payment.value,items:cart})});msg.textContent=JSON.stringify(await r.json(),null,2);}
