import{Clock as v,createMemo as r,createState as a,ctx as m,h as t}from"../chunk-C5HNVTDX.js";import{DynamicStylable as w,throttlingEquals as y}from"../chunk-SBL3M62D.js";var c=new Date().setHours(0,0,0,0)/1e3,l=()=>Date.now()/1e3-c,o=0,h=l(),[u,p,d]=a(l()),[,x,g]=a(!1),[,A]=r(e=>(m.onInit(e,()=>p(e)),o)),[,_]=r(e=>h+=A(e)),D=setInterval(requestAnimationFrame,15,()=>{d(e=>{let n=l();return e!==void 0&&(o=n-e),x()&&(o/=30),n})});m.onDelete(u,()=>clearInterval(D));var f,T=t("div",{init:e=>{new w(e).setStyle({display:"flex",flexDirection:"column",flexWrap:"nowrap",alignItems:"stretch"})}},t("button",{"on:click":e=>{clearTimeout(f),g(n=>!n),f=setTimeout(()=>g(!1),5e3)}},"!! ZA WARUDO ??!!",t("br",null),"TOKYO WA TOMARE!!"),t("br",null),t("button",null,"ROADO ROLLAAA")),i=!1,b=t("input",{type:"number","set:valueAsNumber":r(_,{equals:y(150,(e,n)=>!(e!==n&&isFinite(n)&&!i))})[1],"on:change":e=>{i=!0;let n=e.currentTarget,s=n.valueAsNumber;isFinite(s)&&(c=Date.now()/1e3-s)},"on:blur":e=>{i=!1},"on:focus":e=>{i=!0}}),I=t("div",{style:{display:"flex",flexDirection:"column",flexWrap:"nowrap",alignItems:"stretch"}},t("span",{"attr:style":"text-align: center;"},"change time"),b);document.getElementById("root").append(t("img",{src:"../assets/jotaro_kujo.jpg"}),t("div",{style:{display:"flex",flexDirection:"column",flexWrap:"nowrap",alignItems:"stretch",justifyContent:"center",width:"30vw"}},I,t(v,{"attr:style":"align-self: center;",getTime:_}),T),t("img",{src:"../assets/dio_brando.jpg"}));export{p as getCurrentTime,u as idCurrentTime,d as setCurrentTime};