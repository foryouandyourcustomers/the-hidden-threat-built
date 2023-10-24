import{$,a0 as x,s as J,l as D,e as M,a as T,c as S,b as E,q as ee,g as q,f as w,m as C,i as K,h as k,u as V,o as P,p as W,N as G,C as I,I as N,a1 as se,a2 as A,x as te,k as ne,H as oe,J as ae}from"./scheduler.919cf977.js";import{S as L,i as R,t as y,b as z,c as le,a as re,m as ie,d as de}from"./index.6a811cc0.js";import{r as X}from"./index.5157fae5.js";function ue(e,t){return e===t}const fe=(e,t,s=ue)=>{let o,a=t(e.getSnapshot());return X(a,h=>{const i=d=>{const l=t(d);s(a,l)||(a=l,h(l))};return i(e.getSnapshot()),o=e.subscribe(i),()=>{o.unsubscribe()}})},j={},ye=e=>{$(j,e)},ce=()=>x(j),F=(e,t)=>{const s=t.users.find(o=>o.id===e);if(!s)throw new Error(`The user with id ${e} was not found.`);return s},ze=(e,t)=>F(e,t).isAdmin,_e=e=>F(e.userId,e);function he(e){let t,s,o="The hidden threat",a,r;const h=e[1].default,i=D(h,e,e[0],null);return{c(){t=M("div"),s=M("div"),s.textContent=o,a=T(),i&&i.c(),this.h()},l(d){t=S(d,"DIV",{class:!0});var l=E(t);s=S(l,"DIV",{class:!0,"data-svelte-h":!0}),ee(s)!=="svelte-xbe4by"&&(s.textContent=o),a=q(l),i&&i.l(l),l.forEach(w),this.h()},h(){C(s,"class","title svelte-1d60vr1"),C(t,"class","header svelte-1d60vr1")},m(d,l){K(d,t,l),k(t,s),k(t,a),i&&i.m(t,null),r=!0},p(d,[l]){i&&i.p&&(!r||l&1)&&V(i,h,d,d[0],r?W(h,d[0],l,null):P(d[0]),null)},i(d){r||(y(i,d),r=!0)},o(d){z(i,d),r=!1},d(d){d&&w(t),i&&i.d(d)}}}function me(e,t,s){let{$$slots:o={},$$scope:a}=t;return e.$$set=r=>{"$$scope"in r&&s(0,a=r.$$scope)},[a,o]}class ve extends L{constructor(t){super(),R(this,t,me,he,J,{})}}const pe=e=>({}),U=e=>({}),ge=e=>({}),Y=e=>({});function be(e){let t;const s=e[13].header,o=D(s,e,e[17],Y);return{c(){o&&o.c()},l(a){o&&o.l(a)},m(a,r){o&&o.m(a,r),t=!0},p(a,r){o&&o.p&&(!t||r&131072)&&V(o,s,a,a[17],t?W(s,a[17],r,ge):P(a[17]),Y)},i(a){t||(y(o,a),t=!0)},o(a){z(o,a),t=!1},d(a){o&&o.d(a)}}}function we(e){let t,s,o,a,r,h,i,d,l,b,p;G(e[14]),o=new ve({props:{$$slots:{default:[be]},$$scope:{ctx:e}}});const v=e[13].default,u=D(v,e,e[17],null),g=e[13].overlays,c=D(g,e,e[17],U);return{c(){t=M("div"),s=M("div"),le(o.$$.fragment),a=T(),r=M("div"),u&&u.c(),h=T(),c&&c.c(),this.h()},l(n){t=S(n,"DIV",{class:!0});var _=E(t);s=S(_,"DIV",{class:!0});var m=E(s);re(o.$$.fragment,m),a=q(m),r=S(m,"DIV",{class:!0});var B=E(r);u&&u.l(B),B.forEach(w),h=q(m),c&&c.l(m),m.forEach(w),_.forEach(w),this.h()},h(){C(r,"class","content svelte-ovklwv"),I(r,"padded",e[1]),C(s,"class",i="board "+(e[8]?`side-${e[8]}`:"")+" svelte-ovklwv"),G(()=>e[16].call(s)),I(s,"backdrop",e[0]),C(t,"class","board-wrapper svelte-ovklwv"),N(t,"--board-scale",e[7])},m(n,_){K(n,t,_),k(t,s),ie(o,s,null),k(s,a),k(s,r),u&&u.m(r,null),k(s,h),c&&c.m(s,null),e[15](s),d=se(s,e[16].bind(s)),l=!0,b||(p=[A(window,"resize",e[11]),A(window,"resize",e[14]),A(s,"mousemove",e[10])],b=!0)},p(n,[_]){const m={};_&131072&&(m.$$scope={dirty:_,ctx:n}),o.$set(m),u&&u.p&&(!l||_&131072)&&V(u,v,n,n[17],l?W(v,n[17],_,null):P(n[17]),null),(!l||_&2)&&I(r,"padded",n[1]),c&&c.p&&(!l||_&131072)&&V(c,g,n,n[17],l?W(g,n[17],_,pe):P(n[17]),U),(!l||_&256&&i!==(i="board "+(n[8]?`side-${n[8]}`:"")+" svelte-ovklwv"))&&C(s,"class",i),(!l||_&257)&&I(s,"backdrop",n[0]),_&128&&N(t,"--board-scale",n[7])},i(n){l||(y(o.$$.fragment,n),y(u,n),y(c,n),l=!0)},o(n){z(o.$$.fragment,n),z(u,n),z(c,n),l=!1},d(n){n&&w(t),de(o),u&&u.d(n),c&&c.d(n),e[15](null),d(),b=!1,te(p)}}}function Ce(e,t,s){let o,{$$slots:a={},$$scope:r}=t,{reportMousePosition:h=void 0}=t,{showBackdrop:i=!1}=t,{paddedContent:d=!1}=t;const l=ce(),b=l?fe(l.machine.service,({context:f})=>{const H=_e(f);if(H.isAdmin)return H.side}):X(void 0);ne(e,b,f=>s(8,o=f));let p,v=1,u=1,g=1,c=1,n=1;const _=f=>{if(!h)return;const H=(f.clientX-p.offsetLeft)/v,Z=(f.clientY-p.offsetTop)/u;h([(H-(1-n)/2)/n,(Z-(1-n)/2)/n])},m=()=>{s(7,n=Math.min(g/(v+20),c/(u+20))),n>=1.3?s(7,n=1.3):s(7,n=Math.min(n,1))};oe(m);function B(){s(5,g=window.innerWidth),s(6,c=window.innerHeight)}function O(f){ae[f?"unshift":"push"](()=>{p=f,s(2,p)})}function Q(){v=this.clientWidth,u=this.clientHeight,s(3,v),s(4,u)}return e.$$set=f=>{"reportMousePosition"in f&&s(12,h=f.reportMousePosition),"showBackdrop"in f&&s(0,i=f.showBackdrop),"paddedContent"in f&&s(1,d=f.paddedContent),"$$scope"in f&&s(17,r=f.$$scope)},[i,d,p,v,u,g,c,n,o,b,_,m,h,a,B,O,Q,r]}class Be extends L{constructor(t){super(),R(this,t,Ce,we,J,{reportMousePosition:12,showBackdrop:0,paddedContent:1})}}export{Be as B,ce as a,fe as b,F as c,_e as g,ye as s,ze as u};
