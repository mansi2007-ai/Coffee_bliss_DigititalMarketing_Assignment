const MENU={
"Coffee":["☕|Espresso|120|Strong, short and bold","☕|Americano|130|Espresso topped with hot water","☕|Cappuccino|160|Espresso, steamed milk, thick foam","☕|Café Latte|170|Smooth and milky","☕|Mocha|190|Espresso with chocolate and milk","☕|Caramel Macchiato|200|Vanilla, milk, espresso, caramel","☕|Flat White|170|Velvety microfoam","🧊|Iced Coffee|160|Cold brew over ice"],
"Sandwiches":["🥪|Veg Grilled Sandwich|110|Veggies and cheese, toasted","🥪|Paneer Tikka Sandwich|150|Spiced paneer, mint chutney","🥪|Cheese Corn Sandwich|130|Sweet corn and melted cheese","🥪|Club Sandwich|180|Triple layer with fresh veggies"],
"Burgers":["🍔|Aloo Tikki Burger|99|Crispy potato patty","🍔|Veg Cheese Burger|130|Veg patty with cheese slice","🍔|Paneer Burger|160|Crunchy paneer patty","🍔|Chicken Burger|180|Juicy crispy chicken patty"],
"Fries":["🍟|Classic Salted Fries|90|Golden and crisp","🍟|Peri Peri Fries|110|Spicy peri peri seasoning","🍟|Cheesy Fries|140|Loaded with cheese sauce","🍟|Masala Fries|100|Indian spice mix"],
"Pizza":["🍕|Margherita|199|Mozzarella and tomato","🍕|Farmhouse|279|Onion, capsicum, mushroom, corn","🍕|Paneer Tikka Pizza|299|Spiced paneer and onion","🍕|Cheese Burst|349|Extra cheese in every bite"],
"Beverages":["🥤|Cold Coffee|150|Thick and chilled","🍫|Hot Chocolate|160|Rich cocoa and milk","🍋|Fresh Lime Soda|80|Sweet or salted","🍵|Masala Chai|60|Ginger and cardamom","🥭|Mango Shake|140|Seasonal mango and milk"]
};
const PHONE="918983901511";
const $=s=>document.querySelector(s);
const rs=n=>"₹"+n;
const load=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const items={};
Object.entries(MENU).forEach(([c,l])=>l.forEach(s=>{const[e,n,p,d]=s.split("|");items[n]={e,n,p:+p,d,c}}));
let cart=load("cb_cart",{});
function count(){const el=$("#count");if(el)el.textContent=Object.values(cart).reduce((a,b)=>a+b,0)}
function toast(t){const el=$("#toast");el.textContent=t;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),1400)}
function card(s){const[e,n,p,d]=s.split("|");return `<article class="item"><div class="em" aria-hidden="true">${e}</div><h3>${n}</h3><p>${d}</p><div class="row"><span class="price">${rs(p)}</span><button class="add" data-add="${n}">Add to cart</button></div></article>`}
document.addEventListener("click",e=>{const n=e.target.dataset.add;if(n){cart[n]=(cart[n]||0)+1;save("cb_cart",cart);count();toast(n+" added to cart")}});
const page=document.body.dataset.page;
document.querySelectorAll("nav a").forEach(a=>{if(a.dataset.p===page)a.classList.add("on")});
count();

if(page==="home"){
  $("#cats").innerHTML=Object.keys(MENU).map(c=>`<a href="menu.html#${c}">${c}</a>`).join("");
  $("#featured").innerHTML=["Cappuccino","Caramel Macchiato","Veg Cheese Burger","Peri Peri Fries","Margherita","Mango Shake"].map(n=>{const i=items[n];return card([i.e,i.n,i.p,i.d].join("|"))}).join("");
}
if(page==="menu"){
  let cat=decodeURIComponent(location.hash.slice(1));if(!MENU[cat])cat="Coffee";
  const draw=()=>{$("#tabs").innerHTML=Object.keys(MENU).map(c=>`<button class="${c===cat?"on":""}" data-c="${c}">${c}</button>`).join("");$("#grid").innerHTML=MENU[cat].map(card).join("")};
  $("#tabs").onclick=e=>{if(e.target.dataset.c){cat=e.target.dataset.c;history.replaceState(null,"","#"+cat);draw()}};
  draw();
}
if(page==="cart"){
  const draw=()=>{const ks=Object.keys(cart);let t=0;
    $("#lines").innerHTML=ks.length?ks.map(n=>{const q=cart[n],p=items[n].p;t+=p*q;return `<div class="line"><div><b>${n}</b><br><span class="muted">${rs(p)} each</span></div><div class="qty"><button data-m="${n}" aria-label="Remove one ${n}">−</button><b>${q}</b><button data-a="${n}" aria-label="Add one ${n}">+</button></div><b>${rs(p*q)}</b></div>`}).join(""):`<p class="muted">Your cart is empty. <a href="menu.html">Browse the menu</a>.</p>`;
    $("#total").textContent=rs(t);count()};
  $("#lines").onclick=e=>{const a=e.target.dataset.a,m=e.target.dataset.m;if(a)cart[a]++;if(m){cart[m]--;if(cart[m]<=0)delete cart[m]}save("cb_cart",cart);draw()};
  $("#place").onclick=()=>{
    const ks=Object.keys(cart),nm=$("#nm").value.trim(),ph=$("#ph").value.trim();
    if(!ks.length)return alert("Add at least one item to your cart.");
    if(!nm||ph.replace(/\D/g,"").length<10)return alert("Enter your name and a 10-digit phone number.");
    const orders=load("cb_orders",[]);
    const id="CB"+(1000+orders.length+1+Math.floor(Math.random()*90));
    const lines=ks.map(n=>({n,q:cart[n],p:items[n].p}));
    const total=lines.reduce((s,l)=>s+l.q*l.p,0);
    orders.unshift({id,nm,ph,lines,total,t:Date.now()});save("cb_orders",orders);
    const msg=encodeURIComponent(`New order ${id} - Coffee Bliss\nName: ${nm}\nPhone: ${ph}\n`+lines.map(l=>`${l.q} x ${l.n}`).join("\n")+`\nTotal: ${total}`);
    cart={};save("cb_cart",cart);count();
    $("#checkout").innerHTML=`<h2 style="margin-top:0">Order placed</h2><p>Your order number is <b>${id}</b>. Keep it to track your order.</p><a class="btn wa" target="_blank" rel="noopener" href="https://wa.me/${PHONE}?text=${msg}">Send order on WhatsApp</a> <a class="btn" href="track.html?id=${id}">Track this order</a>`;
    draw();
  };
  draw();
}
if(page==="track"){
  const S=["Order received","Preparing","Ready for pickup"];
  const st=o=>{const m=(Date.now()-o.t)/60000;return m<1?0:m<6?1:2};
  const oc=o=>{const s=st(o);return `<div class="panel"><b>${o.id}</b> · ${o.nm}<br><span class="muted">${o.lines.map(l=>l.q+" × "+l.n).join(", ")} · ${rs(o.total)}</span><div class="steps">${S.map((_,i)=>`<span class="${i<=s?"d":""}"></span>`).join("")}</div><b>${S[s]}</b></div>`};
  const find=id=>{const o=load("cb_orders",[]).find(x=>x.id.toLowerCase()===id.trim().toLowerCase());
    $("#result").innerHTML=o?oc(o):`<div class="panel">No order found with that number on this device. Check the number or call 8983901511.</div>`};
  $("#find").onclick=()=>find($("#oid").value);
  const l=load("cb_orders",[]);$("#recent").innerHTML=l.length?l.map(oc).join(""):`<p class="muted">No orders yet. <a href="menu.html">Order from the menu</a>.</p>`;
  const q=new URLSearchParams(location.search).get("id");if(q){$("#oid").value=q;find(q)}
}
