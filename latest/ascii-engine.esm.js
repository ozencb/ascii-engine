var e;!function(e){e[e.Low=1]="Low",e[e.MediumLow=2]="MediumLow",e[e.Medium=3]="Medium",e[e.MediumHigh=4]="MediumHigh",e[e.High=5]="High",e[e.VeryHigh=6]="VeryHigh",e[e.Ultra=7]="Ultra",e[e.UltraHigh=8]="UltraHigh",e[e.Extreme=9]="Extreme",e[e.Maximum=10]="Maximum"}(e||(e={}));const t=" ",n=()=>{const e=document.createElement("span");return e.style.display="block",e.style.fontFamily="monospace",e.style.userSelect="none",e.style.overflow="hidden",e.innerHTML=t,e},o=e=>{const{cellHeight:o}=e,r=n();return r.style.height=`${o}px`,r.style.fontSize=`${o}px`,r.style.lineHeight=`${o}px`,r.innerHTML=t,r},r=(e,o)=>{const{height:r,width:s}=e.getBoundingClientRect(),l=n();l.style.visibility="hidden",l.style.display="inline",l.innerHTML=t,e.appendChild(l);const{height:i}=l.getBoundingClientRect();e.removeChild(l);const c=.05*o,a=Math.floor(i/c),h=.6*a;return{rows:(r>0?Math.floor(r/a):0)+1,cols:(s>0?Math.floor(s/h):0)+1,cellHeight:a,cellWidth:h}},s=(e,t)=>{const n={x:0,y:0,col:0,row:0,pressed:!1};return((e,t,n)=>{const o=e.getBoundingClientRect();e.addEventListener("pointermove",(e=>{e instanceof PointerEvent&&(n.x=e.x-o.left,n.y=e.y-o.top,n.col=Math.floor(n.x/t.cellWidth),n.row=Math.floor(n.y/t.cellHeight))})),e.addEventListener("pointerdown",(e=>{e instanceof PointerEvent&&(n.pressed=!0)})),e.addEventListener("pointerup",(e=>{e instanceof PointerEvent&&(n.pressed=!1)}))})(e,t,n),n},l=(e,t)=>{e.innerHTML="";for(let n=0;n<t.rows;n++)e.appendChild(o(t))},i=(e,t)=>{const n=r(e,t.resolution),o={rows:n.rows,cols:n.cols,cellWidth:n.cellWidth,cellHeight:n.cellHeight,frame:0,deltaTime:0,elapsedTime:0,options:t};return((e,t,n)=>{window.addEventListener("resize",(()=>{const o=r(e,n.resolution);t.rows=o.rows,t.cols=o.cols,t.cellWidth=o.cellWidth,t.cellHeight=o.cellHeight,l(e,t)}))})(e,o,t),o},c=(e,t)=>e.children[t],a=(e,n,o,r)=>{let s=0;const l=[];requestAnimationFrame((function i(a){n.deltaTime=(a-s)/1e3,n.elapsedTime+=n.deltaTime,s=a;for(let e=0;e<n.rows;e++)l[e]||(l[e]=Array(n.cols).fill(null));for(let e=0;e<n.rows;e++)for(let s=0;s<n.cols;s++){const i=o({x:s,y:e},n,l,r);l[e][s]=i&&" "!==i?i:t}((e,t,n)=>{for(let o=0;o<t.rows;o++){const t=c(e,o);if(!t)continue;const r=[];n[o].forEach(((e,t)=>{r[t]=e})),t.innerHTML=r.join("")}})(e,n,[...l]),l.length=0,n.frame++,requestAnimationFrame(i)}))},h=(t,n,o={resolution:e.Maximum})=>{if(!t)throw new Error("Target element cannot be null");const r=i(t,o);l(t,r);const c=s(t,r);a(t,r,n,c)},y=[{x:-1,y:-1,z:-1},{x:1,y:-1,z:-1},{x:1,y:1,z:-1},{x:-1,y:1,z:-1},{x:-1,y:-1,z:1},{x:1,y:-1,z:1},{x:1,y:1,z:1},{x:-1,y:1,z:1}],d=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]],x=(e,t,n,o)=>{const r=.5*t.elapsedTime,s=y.map((e=>{const n=((e,t)=>{const n=Math.cos(t),o=Math.sin(t);return{x:e.x,y:e.y*n-e.z*o,z:e.y*o+e.z*n}})(((e,t)=>{const n=Math.cos(t),o=Math.sin(t);return{x:e.x*n+e.z*o,y:e.y,z:-e.x*o+e.z*n}})(e,r),r);return((e,t)=>{const n=300/(e.z+45);return{x:Math.round(e.x*n+t.cols/2),y:Math.round(e.y*n+t.rows/2)}})(n,t)}));return d.forEach((([e,t])=>{const{x:o,y:r}=s[e],{x:l,y:i}=s[t];((e,t,n,o,r)=>{const s=Math.abs(o-t),l=Math.abs(r-n),i=t<o?1:-1,c=n<r?1:-1;let a=s-l;for(;t>=0&&t<e[0].length&&n>=0&&n<e.length&&(e[n][t]="*"),t!==o||n!==r;){const e=2*a;e>-l&&(a-=l,t+=i),e<s&&(a+=s,n+=c)}})(n,o,r,l,i)})),n[e.y][e.x]||" "},u=[" ","░","▒","▓","█"],m=()=>u[Math.floor(Math.random()*u.length)],M=[{x:-1,y:-1,z:-1},{x:1,y:-1,z:-1},{x:1,y:1,z:-1},{x:-1,y:1,z:-1},{x:-1,y:-1,z:1},{x:1,y:-1,z:1},{x:1,y:1,z:1},{x:-1,y:1,z:1}],g=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];let z=0,f=0,p=0,w=0;const H=(e,t,n,o)=>{const r=.5*t.elapsedTime;if(o.pressed){const e=o.x-p,t=o.y-w;z+=.01*t,f+=.01*e}else z=r,f=r;p=o.x,w=o.y;const s=M.map((e=>{const n=((e,t)=>{const n=Math.cos(t),o=Math.sin(t);return{x:e.x,y:e.y*n-e.z*o,z:e.y*o+e.z*n}})(((e,t)=>{const n=Math.cos(t),o=Math.sin(t);return{x:e.x*n+e.z*o,y:e.y,z:-e.x*o+e.z*n}})(e,f),z);return((e,t)=>{const n=300/(e.z+45);return{x:Math.round(e.x*n+t.cols/2),y:Math.round(e.y*n+t.rows/2)}})(n,t)}));return g.forEach((([e,t])=>{const{x:o,y:r}=s[e],{x:l,y:i}=s[t];((e,t,n,o,r)=>{const s=Math.abs(o-t),l=Math.abs(r-n),i=t<o?1:-1,c=n<r?1:-1;let a=s-l;for(;t>=0&&t<e[0].length&&n>=0&&n<e.length&&(e[n][t]="*"),t!==o||n!==r;){const e=2*a;e>-l&&(a-=l,t+=i),e<s&&(a+=s,n+=c)}})(n,o,r,l,i)})),n[e.y][e.x]||" "};export{x as Cube,H as CubeInput,e as Resolution,m as Static,h as render};
