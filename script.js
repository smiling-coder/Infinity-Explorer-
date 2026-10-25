// ---- Edit the planets here: name, topic, text, tags, colour, type ----
const USE_IMAGES=false; // set true on GitHub Pages after adding real photos in a /textures folder
const PLANETS=[
 {name:"Mercury",kind:"Planet 1 · The Swift Messenger",color:"#b3aaa0",tex:"mercury",r:2.6,moons:0,img:"textures/mercury.jpg",text:"The smallest planet and closest to the Sun. It has almost no atmosphere, so its surface is covered in craters and swings from scorching days to freezing nights.",tags:["Diameter 4,879 km","Year 88 Earth days","Moons 0","−180 to 430 °C"]},
 {name:"Venus",kind:"Planet 2 · The Veiled Furnace",color:"#e8c27a",tex:"venus",r:4.2,moons:0,img:"textures/venus.jpg",text:"Hidden under thick clouds of carbon dioxide and sulphuric acid. Its runaway greenhouse effect makes it the hottest planet, and it spins backwards very slowly.",tags:["Diameter 12,104 km","Year 225 Earth days","Moons 0","About 465 °C"]},
 {name:"Earth",kind:"Planet 3 · Our Home",color:"#4a9bff",tex:"earth",r:4.5,clouds:true,moons:1,tilt:.41,img:"textures/earth.jpg",text:"The only known world with life. About 71% of its surface is liquid water, and its atmosphere and magnetic field protect everything living on it.",tags:["Diameter 12,742 km","Year 365.25 days","Moon 1","71% ocean"]},
 {name:"Mars",kind:"Planet 4 · The Red Planet",color:"#d9653b",tex:"mars",r:3.3,moons:2,tilt:.44,img:"textures/mars.jpg",text:"A cold desert coloured by iron oxide dust. It has the tallest volcano in the solar system, Olympus Mons, and rovers are searching it for signs of ancient life.",tags:["Diameter 6,779 km","Year 687 Earth days","Moons 2","Average −60 °C"]},
 {name:"Jupiter",kind:"Planet 5 · The Giant",color:"#d8a56b",tex:"jupiter",r:8,moons:4,tilt:.05,img:"textures/jupiter.jpg",text:"The largest planet, a gas giant more massive than all other planets combined. Its Great Red Spot is a storm bigger than Earth that has raged for centuries.",tags:["Diameter 139,820 km","Year 11.9 Earth years","Moons 90+","Day about 10 hours"]},
 {name:"Saturn",kind:"Planet 6 · Lord of the Rings",color:"#e6d29a",tex:"saturn",r:7,moons:1,tilt:.47,ring:[1.35,2.4,"saturn",.95,1.1],img:"textures/saturn.jpg",text:"A gas giant famous for its bright rings, made of billions of pieces of ice and rock. It is so light for its size that it would float in a giant bathtub.",tags:["Diameter 116,460 km","Year 29.4 Earth years","Moons 140+","Rings of ice"]},
 {name:"Uranus",kind:"Planet 7 · The Sideways Ice Giant",color:"#8fe3e8",tex:"uranus",r:5.4,moons:0,tilt:1.7,ring:[1.6,1.9,"uranus",.5,.35],img:"textures/uranus.jpg",text:"An ice giant tilted almost 98°, so it rolls around the Sun on its side. Methane in its atmosphere gives it a pale blue-green colour.",tags:["Diameter 50,724 km","Year 84 Earth years","Moons 27+","Tilt 98°"]},
 {name:"Neptune",kind:"Planet 8 · The Windy Deep Blue",color:"#4f78f0",tex:"neptune",r:5.3,moons:1,tilt:.5,img:"textures/neptune.jpg",text:"The farthest planet from the Sun, dark, cold and very windy, with storms reaching about 2,000 km/h. It was found by mathematics before anyone saw it in a telescope.",tags:["Diameter 49,244 km","Year 165 Earth years","Moons 16","Winds ~2,000 km/h"]}
];
const GAP=70,N=PLANETS.length,TOTAL=GAP*(N+1);
try{
const canvas=document.getElementById("space");
const R=new THREE.WebGLRenderer({canvas,antialias:true});
R.setPixelRatio(Math.min(devicePixelRatio,2));
const S=new THREE.Scene();S.fog=new THREE.FogExp2(0x02030a,.006);
const C=new THREE.PerspectiveCamera(65,1,.1,1200);
function size(){R.setSize(innerWidth,innerHeight);C.aspect=innerWidth/innerHeight;C.updateProjectionMatrix()}
addEventListener("resize",size);size();

// glow texture
function glowTex(){const c=document.createElement("canvas");c.width=c.height=128;const g=c.getContext("2d"),r=g.createRadialGradient(64,64,0,64,64,64);r.addColorStop(0,"rgba(255,255,255,1)");r.addColorStop(.3,"rgba(255,255,255,.35)");r.addColorStop(1,"rgba(255,255,255,0)");g.fillStyle=r;g.fillRect(0,0,128,128);return new THREE.CanvasTexture(c)}
const GT=glowTex();

// stars
const SN=4000,sp=new Float32Array(SN*3),sc=new Float32Array(SN*3);
for(let i=0;i<SN;i++){sp[i*3]=(Math.random()-.5)*400;sp[i*3+1]=(Math.random()-.5)*300;sp[i*3+2]=40-Math.random()*(TOTAL+120);
 const t=Math.random(),col=new THREE.Color().setHSL(.55+t*.2,.5,.7+Math.random()*.3);sc[i*3]=col.r;sc[i*3+1]=col.g;sc[i*3+2]=col.b}
const sg=new THREE.BufferGeometry();sg.setAttribute("position",new THREE.BufferAttribute(sp,3));sg.setAttribute("color",new THREE.BufferAttribute(sc,3));
const stars=new THREE.Points(sg,new THREE.PointsMaterial({size:1.1,vertexColors:true,transparent:true,opacity:.9,depthWrite:false}));S.add(stars);

S.add(new THREE.AmbientLight(0x6070a0,1.1));
const sun=new THREE.PointLight(0xffffff,1.4,0,1.2);S.add(sun);

// ---- procedural planet textures (fallback when real photos are not loaded) ----
function H(x,y){const s=Math.sin(x*127.1+y*311.7)*43758.5453;return s-Math.floor(s)}
function VN(x,y){const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf);return H(xi,yi)*(1-u)*(1-v)+H(xi+1,yi)*u*(1-v)+H(xi,yi+1)*(1-u)*v+H(xi+1,yi+1)*u*v}
function FB(x,y,o){let a=.5,t=0;for(let i=0;i<o;i++){t+=a*VN(x,y);x*=2;y*=2;a*=.5}return t}
const WN=(u,v,k,o)=>FB(u*k,v*k,o)*(1-u)+FB((u-1)*k,v*k,o)*u;
const mix=(a,b,t)=>{t=Math.max(0,Math.min(1,t));return a.map((c,i)=>c+(b[i]-c)*t)};
function makeTex(fn){const W=512,HH=256,c=document.createElement("canvas");c.width=W;c.height=HH;const g=c.getContext("2d"),im=g.createImageData(W,HH);
 for(let y=0;y<HH;y++)for(let x=0;x<W;x++){const q=fn(x/W,y/HH),k=(y*W+x)*4;im.data[k]=q[0];im.data[k+1]=q[1];im.data[k+2]=q[2];im.data[k+3]=q.length>3?q[3]:255}
 g.putImageData(im,0,0);const t=new THREE.CanvasTexture(c);t.anisotropy=4;return t}
const TX={
 mercury:(u,v)=>{const c=mix([85,82,78],[175,168,158],WN(u,v,10,5)),k=WN(u,v,40,2)>.7?.7:1;return c.map(x=>x*k)},
 venus:(u,v)=>mix([190,140,70],[245,215,150],WN(u,v*.6+WN(u,v,4,3)*.15,5,5)),
 earth:(u,v)=>{const n=WN(u,v,5,6),lat=Math.abs(v-.5)*2;if(lat>.88+WN(u,v,20,2)*.1)return[240,245,250];
  if(n>.52){const h=(n-.52)*4;return mix(mix([40,110,50],[150,130,80],h),[205,195,175],h-.8+Math.max(0,lat-.6))}return mix([8,30,90],[20,90,170],n*1.6)},
 mars:(u,v)=>{const lat=Math.abs(v-.5)*2;if(lat>.93)return[235,235,240];const c=mix([140,60,30],[210,120,70],WN(u,v,7,6)*1.4),d=WN(u,v,3,3)>.6?.7:1;return c.map(x=>x*d)},
 jupiter:(u,v)=>{const b=Math.sin((v+WN(u,v,6,4)*.06)*34)*.5+.5;let c=mix(mix([150,100,60],[235,215,185],b),[190,130,90],WN(u,v*3,8,4)*.6);const dx=(u-.35)*4,dy=(v-.62)*9;if(dx*dx+dy*dy<1)c=mix(c,[190,70,40],.85);return c},
 saturn:(u,v)=>mix([190,165,115],[238,220,170],(Math.sin((v+WN(u,v,5,3)*.02)*28)*.5+.5)*.8+WN(u,v*2,6,3)*.2),
 uranus:(u,v)=>mix([120,200,210],[170,230,235],WN(u,v*2,3,3)*.5+Math.sin(v*14)*.1+.3),
 neptune:(u,v)=>{let c=mix([30,60,170],[70,110,230],Math.sin(v*22+WN(u,v,5,3)*3)*.5+.5);const dx=(u-.6)*5,dy=(v-.4)*10;if(dx*dx+dy*dy<1)c=mix(c,[15,30,100],.7);return c}
};
const RS={saturn:t=>t>.08&&t<.36?.45+.3*Math.sin(t*120):t>.42&&t<.95?.85-.35*Math.abs(Math.sin(t*70)):0,uranus:t=>(t>.4&&t<.46)||(t>.72&&t<.75)?.6:0};
function ringMesh(a,b,k,op,rx){const gm=new THREE.RingGeometry(a,b,128),p=gm.attributes.position,uv=gm.attributes.uv;
 for(let i=0;i<p.count;i++)uv.setXY(i,(Math.hypot(p.getX(i),p.getY(i))-a)/(b-a),.5);
 const c=document.createElement("canvas");c.width=256;c.height=1;const g=c.getContext("2d");
 for(let x=0;x<256;x++){g.fillStyle="rgba(220,200,155,"+Math.max(0,Math.min(1,RS[k](x/256)))+")";g.fillRect(x,0,1,1)}
 const m=new THREE.Mesh(gm,new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),side:2,transparent:true,opacity:op,depthWrite:false}));m.rotation.x=rx;return m}

// planets
const P=[];
PLANETS.forEach((d,i)=>{
 const col=new THREE.Color(d.color),g=new THREE.Group(),r=d.r,ups=[];
 g.position.set((i%2?-1:1)*(r+5),(i%3-1)*2,-GAP*(i+1));
 const mat=new THREE.MeshStandardMaterial({map:makeTex(TX[d.tex]),roughness:.85,metalness:0,emissive:col,emissiveIntensity:.07});
 if(USE_IMAGES)new THREE.TextureLoader().load(d.img,t=>{mat.map=t;mat.needsUpdate=true},undefined,()=>{});
 const mesh=new THREE.Mesh(new THREE.SphereGeometry(r,64,64),mat);mesh.rotation.z=d.tilt||0;g.add(mesh);
 const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:GT,color:col,transparent:true,opacity:.4,blending:THREE.AdditiveBlending,depthWrite:false}));glow.scale.set(r*3.8,r*3.8,1);g.add(glow);
 if(d.clouds){const cm=new THREE.Mesh(new THREE.SphereGeometry(r*1.02,48,48),new THREE.MeshStandardMaterial({map:makeTex((u,v)=>[255,255,255,Math.max(0,WN(u,v,6,6)-.48)*2.2*255]),transparent:true,depthWrite:false}));cm.rotation.z=d.tilt||0;g.add(cm);ups.push(t=>{cm.rotation.y=t*.07})}
 if(d.ring){const a=d.ring;g.add(ringMesh(r*a[0],r*a[1],a[2],a[3],a[4]))}
 for(let k=0;k<d.moons;k++){const pv=new THREE.Group(),m=new THREE.Mesh(new THREE.SphereGeometry(.45+k*.12,20,20),new THREE.MeshStandardMaterial({color:0xb8b4ac,roughness:1}));
  m.position.x=r*1.7+k*2.2;pv.add(m);pv.rotation.set(k*.5,k,k*.3);const sp=.5/(k+1)+.12;g.add(pv);ups.push(t=>{pv.rotation.y=k+t*sp})}
 S.add(g);P.push({g,mesh,glow,ups,d,r,base:glow.scale.x})
});

// map UI
const mapEl=document.getElementById("map"),btns=[];
PLANETS.forEach((d,i)=>{const b=document.createElement("button");b.style.setProperty("--c",d.color);b.setAttribute("aria-label",d.name);b.innerHTML="<span>"+d.name+"</span><i></i>";
 b.onclick=()=>scrollTo({top:target(i)*maxScroll(),behavior:"smooth"});mapEl.appendChild(b);btns.push(b)});
const maxScroll=()=>document.documentElement.scrollHeight-innerHeight;
const target=i=>(GAP*(i+1)-22)/TOTAL;
const panel=document.getElementById("panel"),seen=new Set();
let cur=-1;
function show(i){
 if(i===cur)return;cur=i;
 btns.forEach((b,k)=>{b.classList.toggle("cur",k===i);b.classList.toggle("seen",seen.has(k))});
 if(i<0){panel.classList.remove("on");document.getElementById("loc").textContent="The Solar System";return}
 const d=PLANETS[i];seen.add(i);btns[i].classList.add("seen");
 panel.style.setProperty("--c",d.color);
 pk.textContent=d.kind;pn.textContent=d.name;pd.textContent=d.text;
 pt.innerHTML=d.tags.map(t=>"<li>"+t+"</li>").join("");
 document.getElementById("loc").textContent="Orbiting "+d.name+" · "+seen.size+"/"+N+" explored";
 panel.classList.add("on")}
const pk=document.getElementById("pk"),pn=document.getElementById("pn"),pd=document.getElementById("pd"),pt=document.getElementById("pt");

// pointer parallax
let mx=0,my=0;addEventListener("pointermove",e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5});

let prog=0,lastZ=0,t0=performance.now();
const hint=document.getElementById("hint"),bar=document.getElementById("prog");
function loop(now){
 requestAnimationFrame(loop);
 const t=(now-t0)/1000,raw=scrollY/Math.max(1,maxScroll());
 prog+=(raw-prog)*.06;
 const z=-prog*TOTAL+10;
 const vel=Math.abs(z-lastZ);lastZ=z;
 // camera drifts toward the nearest planet's x
 let near=-1,nd=1e9;
 P.forEach((p,i)=>{const dd=Math.abs(p.g.position.z-z);if(dd<nd){nd=dd;near=i}});
 const pull=Math.max(0,1-nd/45),tx=P[near].g.position.x*.55*pull;
 C.position.x+=((tx+mx*3)-C.position.x)*.05;
 C.position.y+=((P[near].g.position.y*pull*.5-my*2)-C.position.y)*.05;
 C.position.z=z;
 C.lookAt(C.position.x*.4,C.position.y*.4,z-30);
 C.fov+=((65+Math.min(vel*18,35))-C.fov)*.1;C.updateProjectionMatrix();
 sun.position.set(C.position.x+20,25,z-10);
 stars.rotation.z=t*.003;
 P.forEach((p,i)=>{
  p.mesh.rotation.y=t*.12+i;
  const near2=Math.max(0,1-Math.abs(p.g.position.z-z)/50);
  p.glow.scale.setScalar(p.base*(1+near2*.25));
  p.ups.forEach(f=>f(t))
 });
 show(nd<24?near:-1);
 bar.style.width=(prog*100)+"%";
 hint.style.opacity=prog>.02?0:1;
 R.render(S,C)}
requestAnimationFrame(loop);
}catch(e){const el=document.getElementById("err");el.style.display="grid";console.error(e)}
