import{s as H,n as i,c as q,d as A,u as N,g as O,e as R}from"../chunks/scheduler.3df9b730.js";import{S as w,i as L,e as d,c as g,k as I,n as $,g as k,d as m,l as T,s as j,a as x,m as z,f as C,o as D,h as b,q as v,z as S,p,r as F,B,t as K,b as V}from"../chunks/index.06da1297.js";import{n as G}from"../chunks/stores.04b57fdf.js";function J(o){let e,a='<nav class="svelte-1v5g8ko"><a href="/" class="svelte-1v5g8ko">Home</a> <a href="/help" class="svelte-1v5g8ko">Hilfe</a> <a href="/contact" class="svelte-1v5g8ko">Kontakt</a> <a href="/imprint" class="svelte-1v5g8ko">Impressum</a> <a href="/privacy" class="svelte-1v5g8ko">Datenschutzerklärung</a> <a href="/tos" class="svelte-1v5g8ko">Nutzungsbedingungen</a></nav>';return{c(){e=d("footer"),e.innerHTML=a,this.h()},l(t){e=g(t,"FOOTER",{class:!0,"data-svelte-h":!0}),I(e)!=="svelte-jastgi"&&(e.innerHTML=a),this.h()},h(){$(e,"class","svelte-1v5g8ko")},m(t,s){k(t,e,s)},p:i,i,o:i,d(t){t&&m(e)}}}class P extends w{constructor(e){super(),L(this,e,null,J,H,{})}}function Q(o){let e,a='<nav class="svelte-ciw4m4"><a href="/" class="svelte-ciw4m4">Home</a> <a href="/help" class="svelte-ciw4m4">Hilfe</a></nav>';return{c(){e=d("header"),e.innerHTML=a,this.h()},l(t){e=g(t,"HEADER",{class:!0,"data-svelte-h":!0}),I(e)!=="svelte-14mlwtj"&&(e.innerHTML=a),this.h()},h(){$(e,"class","svelte-ciw4m4")},m(t,s){k(t,e,s)},p:i,i,o:i,d(t){t&&m(e)}}}class U extends w{constructor(e){super(),L(this,e,null,Q,H,{})}}function W(o){let e;const a=o[2].default,t=A(a,o,o[1],null);return{c(){t&&t.c()},l(s){t&&t.l(s)},m(s,n){t&&t.m(s,n),e=!0},p(s,n){t&&t.p&&(!e||n&2)&&N(t,a,s,s[1],e?R(a,s[1],n,null):O(s[1]),null)},i(s){e||(p(t,s),e=!0)},o(s){v(t,s),e=!1},d(s){t&&t.d(s)}}}function X(o){let e;return{c(){e=K("Loading...")},l(a){e=V(a,"Loading...")},m(a,t){k(a,e,t)},p:i,i,o:i,d(a){a&&m(e)}}}function Y(o){let e,a,t,s,n,r,y,_,h;a=new U({});const E=[X,W],u=[];function M(l,c){return l[0]?0:1}return n=M(o),r=u[n]=E[n](o),_=new P({}),{c(){e=d("div"),T(a.$$.fragment),t=j(),s=d("main"),r.c(),y=j(),T(_.$$.fragment),this.h()},l(l){e=g(l,"DIV",{class:!0});var c=x(e);z(a.$$.fragment,c),t=C(c),s=g(c,"MAIN",{class:!0});var f=x(s);r.l(f),f.forEach(m),y=C(c),z(_.$$.fragment,c),c.forEach(m),this.h()},h(){$(s,"class","svelte-1jkcd9t"),$(e,"class","layout svelte-1jkcd9t")},m(l,c){k(l,e,c),D(a,e,null),b(e,t),b(e,s),u[n].m(s,null),b(e,y),D(_,e,null),h=!0},p(l,[c]){let f=n;n=M(l),n===f?u[n].p(l,c):(B(),v(u[f],1,1,()=>{u[f]=null}),S(),r=u[n],r?r.p(l,c):(r=u[n]=E[n](l),r.c()),p(r,1),r.m(s,null))},i(l){h||(p(a.$$.fragment,l),p(r),p(_.$$.fragment,l),h=!0)},o(l){v(a.$$.fragment,l),v(r),v(_.$$.fragment,l),h=!1},d(l){l&&m(e),F(a),u[n].d(),F(_)}}}function Z(o,e,a){let t;q(o,G,r=>a(0,t=r));let{$$slots:s={},$$scope:n}=e;return o.$$set=r=>{"$$scope"in r&&a(1,n=r.$$scope)},[t,n,s]}class ae extends w{constructor(e){super(),L(this,e,Z,Y,H,{})}}export{ae as component};
