import{s as O,b as P,n as R}from"../chunks/scheduler.3df9b730.js";import{S as V,i as G,l as x,m as C,o as k,p as w,q as z,r as A,e as B,s as N,c as D,a as H,k as E,f as S,d as i,n as g,g as c,h as d,t as b,b as v}from"../chunks/index.06da1297.js";import{C as K,s as L,T as Q,a as U}from"../chunks/TextInput.041e8514.js";import{B as M}from"../chunks/Button.b63fec9a.js";function W(l){let e;return{c(){e=b("Dein Name *")},l(t){e=v(t,"Dein Name *")},m(t,n){c(t,e,n)},d(t){t&&i(e)}}}function X(l){let e,t,n="Datenschutzerklärung",f,a,h="Nutzungsbedingungen",u;return{c(){e=b("Ich habe die "),t=B("a"),t.textContent=n,f=b(`,
      `),a=B("a"),a.textContent=h,u=b(` gelesen und akzeptiere sie und bin über
      18 Jahre alt. *`),this.h()},l(o){e=v(o,"Ich habe die "),t=D(o,"A",{href:!0,target:!0,"data-svelte-h":!0}),E(t)!=="svelte-1ft4v3t"&&(t.textContent=n),f=v(o,`,
      `),a=D(o,"A",{href:!0,target:!0,"data-svelte-h":!0}),E(a)!=="svelte-hthhvw"&&(a.textContent=h),u=v(o,` gelesen und akzeptiere sie und bin über
      18 Jahre alt. *`),this.h()},h(){g(t,"href","/privacy"),g(t,"target","_blank"),g(a,"href","/tos"),g(a,"target","_blank")},m(o,$){c(o,e,$),c(o,t,$),c(o,f,$),c(o,a,$),c(o,u,$)},p:R,d(o){o&&(i(e),i(t),i(f),i(a),i(u))}}}function Y(l){let e;return{c(){e=b("Abbrechen")},l(t){e=v(t,"Abbrechen")},m(t,n){c(t,e,n)},d(t){t&&i(e)}}}function Z(l){let e;return{c(){e=b("Beitreten")},l(t){e=v(t,"Beitreten")},m(t,n){c(t,e,n)},d(t){t&&i(e)}}}function ee(l){let e,t,n="Spiel beitreten",f,a,h,u,o,$,m,T,p,I,q,F;return a=new Q({props:{form:l[0],field:"userName",$$slots:{default:[W]},$$scope:{ctx:l}}}),u=new U({props:{form:l[0],field:"acceptedTos",$$slots:{default:[X]},$$scope:{ctx:l}}}),m=new M({props:{href:"/",$$slots:{default:[Y]},$$scope:{ctx:l}}}),p=new M({props:{type:"submit",primary:!0,$$slots:{default:[Z]},$$scope:{ctx:l}}}),{c(){e=B("form"),t=B("h1"),t.textContent=n,f=N(),x(a.$$.fragment),h=N(),x(u.$$.fragment),o=N(),$=B("div"),x(m.$$.fragment),T=N(),x(p.$$.fragment),this.h()},l(s){e=D(s,"FORM",{method:!0});var r=H(e);t=D(r,"H1",{"data-svelte-h":!0}),E(t)!=="svelte-1o9ajw3"&&(t.textContent=n),f=S(r),C(a.$$.fragment,r),h=S(r),C(u.$$.fragment,r),o=S(r),$=D(r,"DIV",{class:!0});var _=H($);C(m.$$.fragment,_),T=S(_),C(p.$$.fragment,_),_.forEach(i),r.forEach(i),this.h()},h(){g($,"class","actions svelte-134u3m3"),g(e,"method","post")},m(s,r){c(s,e,r),d(e,t),d(e,f),k(a,e,null),d(e,h),k(u,e,null),d(e,o),d(e,$),k(m,$,null),d($,T),k(p,$,null),I=!0,q||(F=P(l[0].enhance(e)),q=!0)},p(s,r){const _={};r&4&&(_.$$scope={dirty:r,ctx:s}),a.$set(_);const J={};r&4&&(J.$$scope={dirty:r,ctx:s}),u.$set(J);const j={};r&4&&(j.$$scope={dirty:r,ctx:s}),m.$set(j);const y={};r&4&&(y.$$scope={dirty:r,ctx:s}),p.$set(y)},i(s){I||(w(a.$$.fragment,s),w(u.$$.fragment,s),w(m.$$.fragment,s),w(p.$$.fragment,s),I=!0)},o(s){z(a.$$.fragment,s),z(u.$$.fragment,s),z(m.$$.fragment,s),z(p.$$.fragment,s),I=!1},d(s){s&&i(e),A(a),A(u),A(m),A(p),q=!1,F()}}}function te(l){let e,t;return e=new K({props:{$$slots:{default:[ee]},$$scope:{ctx:l}}}),{c(){x(e.$$.fragment)},l(n){C(e.$$.fragment,n)},m(n,f){k(e,n,f),t=!0},p(n,[f]){const a={};f&4&&(a.$$scope={dirty:f,ctx:n}),e.$set(a)},i(n){t||(w(e.$$.fragment,n),t=!0)},o(n){z(e.$$.fragment,n),t=!1},d(n){A(e,n)}}}function ne(l,e,t){let{data:n}=e;const f=L(n.form);return l.$$set=a=>{"data"in a&&t(1,n=a.data)},[f,n]}class le extends V{constructor(e){super(),G(this,e,ne,te,O,{data:1})}}export{le as component};