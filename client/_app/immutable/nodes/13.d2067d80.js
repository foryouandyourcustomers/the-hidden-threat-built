import{s as P,b as R,n as V}from"../chunks/scheduler.3df9b730.js";import{S as j,i as G,l as x,m as C,o as k,p as w,q as z,r as N,e as S,s as I,c as A,a as M,k as B,f as T,d as i,n as g,g as c,h as d,t as b,b as v}from"../chunks/index.06da1297.js";import{C as K,s as L,T as Q,a as U}from"../chunks/TextInput.041e8514.js";import{B as O}from"../chunks/Button.b63fec9a.js";function W(l){let e;return{c(){e=b("Dein Name *")},l(t){e=v(t,"Dein Name *")},m(t,n){c(t,e,n)},d(t){t&&i(e)}}}function X(l){let e,t,n="Datenschutzerklärung",f,a,h="Nutzungsbedingungen",$;return{c(){e=b("Ich habe die "),t=S("a"),t.textContent=n,f=b(`, die
      `),a=S("a"),a.textContent=h,$=b(` gelesen und akzeptiere sie und bin über
      18 Jahre alt. *`),this.h()},l(o){e=v(o,"Ich habe die "),t=A(o,"A",{href:!0,target:!0,"data-svelte-h":!0}),B(t)!=="svelte-1ft4v3t"&&(t.textContent=n),f=v(o,`, die
      `),a=A(o,"A",{href:!0,target:!0,"data-svelte-h":!0}),B(a)!=="svelte-hthhvw"&&(a.textContent=h),$=v(o,` gelesen und akzeptiere sie und bin über
      18 Jahre alt. *`),this.h()},h(){g(t,"href","/privacy"),g(t,"target","_blank"),g(a,"href","/tos"),g(a,"target","_blank")},m(o,u){c(o,e,u),c(o,t,u),c(o,f,u),c(o,a,u),c(o,$,u)},p:V,d(o){o&&(i(e),i(t),i(f),i(a),i($))}}}function Y(l){let e;return{c(){e=b("Abbrechen")},l(t){e=v(t,"Abbrechen")},m(t,n){c(t,e,n)},d(t){t&&i(e)}}}function Z(l){let e;return{c(){e=b("Start")},l(t){e=v(t,"Start")},m(t,n){c(t,e,n)},d(t){t&&i(e)}}}function ee(l){let e,t,n="Neues Spiel",f,a,h,$,o,u,m,q,p,D,y,E;return a=new Q({props:{form:l[0],field:"userName",$$slots:{default:[W]},$$scope:{ctx:l}}}),$=new U({props:{form:l[0],field:"acceptedTos",$$slots:{default:[X]},$$scope:{ctx:l}}}),m=new O({props:{href:"/",$$slots:{default:[Y]},$$scope:{ctx:l}}}),p=new O({props:{type:"submit",primary:!0,$$slots:{default:[Z]},$$scope:{ctx:l}}}),{c(){e=S("form"),t=S("h1"),t.textContent=n,f=I(),x(a.$$.fragment),h=I(),x($.$$.fragment),o=I(),u=S("div"),x(m.$$.fragment),q=I(),x(p.$$.fragment),this.h()},l(s){e=A(s,"FORM",{method:!0});var r=M(e);t=A(r,"H1",{"data-svelte-h":!0}),B(t)!=="svelte-13np4yz"&&(t.textContent=n),f=T(r),C(a.$$.fragment,r),h=T(r),C($.$$.fragment,r),o=T(r),u=A(r,"DIV",{class:!0});var _=M(u);C(m.$$.fragment,_),q=T(_),C(p.$$.fragment,_),_.forEach(i),r.forEach(i),this.h()},h(){g(u,"class","actions svelte-134u3m3"),g(e,"method","post")},m(s,r){c(s,e,r),d(e,t),d(e,f),k(a,e,null),d(e,h),k($,e,null),d(e,o),d(e,u),k(m,u,null),d(u,q),k(p,u,null),D=!0,y||(E=R(l[0].enhance(e)),y=!0)},p(s,r){const _={};r&4&&(_.$$scope={dirty:r,ctx:s}),a.$set(_);const F={};r&4&&(F.$$scope={dirty:r,ctx:s}),$.$set(F);const J={};r&4&&(J.$$scope={dirty:r,ctx:s}),m.$set(J);const H={};r&4&&(H.$$scope={dirty:r,ctx:s}),p.$set(H)},i(s){D||(w(a.$$.fragment,s),w($.$$.fragment,s),w(m.$$.fragment,s),w(p.$$.fragment,s),D=!0)},o(s){z(a.$$.fragment,s),z($.$$.fragment,s),z(m.$$.fragment,s),z(p.$$.fragment,s),D=!1},d(s){s&&i(e),N(a),N($),N(m),N(p),y=!1,E()}}}function te(l){let e,t;return e=new K({props:{$$slots:{default:[ee]},$$scope:{ctx:l}}}),{c(){x(e.$$.fragment)},l(n){C(e.$$.fragment,n)},m(n,f){k(e,n,f),t=!0},p(n,[f]){const a={};f&4&&(a.$$scope={dirty:f,ctx:n}),e.$set(a)},i(n){t||(w(e.$$.fragment,n),t=!0)},o(n){z(e.$$.fragment,n),t=!1},d(n){N(e,n)}}}function ne(l,e,t){let{data:n}=e;const f=L(n.form);return l.$$set=a=>{"data"in a&&t(1,n=a.data)},[f,n]}class le extends j{constructor(e){super(),G(this,e,ne,te,P,{data:1})}}export{le as component};
