import{s as B}from"../chunks/scheduler.03dcb200.js";import{S,i as T,e as $,s as x,l as y,c as h,k as g,f as v,m as H,n as k,g as n,o as q,p as w,q as N,d as a,r as P,t as R,b as z}from"../chunks/index.91584b48.js";import{B as j}from"../chunks/Button.4aedaae9.js";function A(d){let e;return{c(){e=R("Neues Spiel starten")},l(l){e=z(l,"Neues Spiel starten")},m(l,r){n(l,e,r)},d(l){l&&a(e)}}}function D(d){let e,l="The Hidden Threat",r,o,b='The Hidden Threat ist ein "serious game" lorum ipsum.',m,u,c,p,_,i,f;return i=new j({props:{accent:!0,href:"/game/new",$$slots:{default:[A]},$$scope:{ctx:d}}}),{c(){e=$("h1"),e.textContent=l,r=x(),o=$("p"),o.textContent=b,m=x(),u=$("br"),c=x(),p=$("br"),_=x(),y(i.$$.fragment),this.h()},l(t){e=h(t,"H1",{class:!0,"data-svelte-h":!0}),g(e)!=="svelte-k9gcz"&&(e.textContent=l),r=v(t),o=h(t,"P",{"data-svelte-h":!0}),g(o)!=="svelte-c3a5t8"&&(o.textContent=b),m=v(t),u=h(t,"BR",{}),c=v(t),p=h(t,"BR",{}),_=v(t),H(i.$$.fragment,t),this.h()},h(){k(e,"class","svelte-9da22d")},m(t,s){n(t,e,s),n(t,r,s),n(t,o,s),n(t,m,s),n(t,u,s),n(t,c,s),n(t,p,s),n(t,_,s),q(i,t,s),f=!0},p(t,[s]){const C={};s&1&&(C.$$scope={dirty:s,ctx:t}),i.$set(C)},i(t){f||(w(i.$$.fragment,t),f=!0)},o(t){N(i.$$.fragment,t),f=!1},d(t){t&&(a(e),a(r),a(o),a(m),a(u),a(c),a(p),a(_)),P(i,t)}}}class I extends S{constructor(e){super(),T(this,e,null,D,B,{})}}export{I as component};