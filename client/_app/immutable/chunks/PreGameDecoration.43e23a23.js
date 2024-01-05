import{s as X,v as Z,e as y,a as B,c as S,b as E,l as J,g as D,f as b,m as I,i as P,h as H,w as j,x as N,y as U,Q as O,B as q,L as x,a7 as fe,H as W,r as de,k as ue,K as ce,M as he,D as R,F as _e,a2 as me,G as ge,a3 as ve,a4 as ee,n as Y,a5 as te,a8 as pe}from"./scheduler.9231f7ad.js";import{S as K,i as Q,t as $,b as C,c as F,a as V,m as z,g as we,e as be,d as L}from"./index.cd525813.js";import{r as ae}from"./index.cbaeab23.js";import{g as $e}from"./game-context.978a1c0d.js";import{F as ke,a as G}from"./Face.063e1e75.js";import{g as Me}from"./Heading.470aa6b4.js";function Ce(s,e){return s===e}const He=(s,e,t=Ce)=>{let r,n=e(s.getSnapshot());return ae(n,i=>{const _=m=>{const w=e(m);t(n,w)||(n=w,i(w))};return _(s.getSnapshot()),r=s.subscribe(_),()=>{r.unsubscribe()}})},oe=(s,e)=>{const t=e.users.find(r=>r.id===s);if(!t)throw new Error(`The user with id ${s} was not found.`);return t},Xe=(s,e)=>oe(s,e).isAdmin,Ie=s=>oe(s.userId,s);function Be(s){let e,t,r='<svg width="346" height="53" viewBox="0 0 346 53" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M45 0H0l54 53-9-53Z" fill="#F03A50"></path><path d="M45 0h33L54 53 45 0Z" fill="#A40224"></path><path d="M346 38 330 0H78L54 53l292-15Z" fill="#D32746"></path></svg>',n,a,i="The hidden threat",_,m;const w=s[1].default,o=Z(w,s,s[0],null);return{c(){e=y("div"),t=y("div"),t.innerHTML=r,n=B(),a=y("div"),a.textContent=i,_=B(),o&&o.c(),this.h()},l(d){e=S(d,"DIV",{class:!0});var h=E(e);t=S(h,"DIV",{class:!0,"data-svelte-h":!0}),J(t)!=="svelte-17ojy9"&&(t.innerHTML=r),n=D(h),a=S(h,"DIV",{class:!0,"data-svelte-h":!0}),J(a)!=="svelte-xbe4by"&&(a.textContent=i),_=D(h),o&&o.l(h),h.forEach(b),this.h()},h(){I(t,"class","backdrop svelte-kbs536"),I(a,"class","title svelte-kbs536"),I(e,"class","header svelte-kbs536")},m(d,h){P(d,e,h),H(e,t),H(e,n),H(e,a),H(e,_),o&&o.m(e,null),m=!0},p(d,[h]){o&&o.p&&(!m||h&1)&&j(o,w,d,d[0],m?U(w,d[0],h,null):N(d[0]),null)},i(d){m||($(o,d),m=!0)},o(d){C(o,d),m=!1},d(d){d&&b(e),o&&o.d(d)}}}function De(s,e,t){let{$$slots:r={},$$scope:n}=e;return s.$$set=a=>{"$$scope"in a&&t(0,n=a.$$scope)},[n,r]}class ye extends K{constructor(e){super(),Q(this,e,De,Be,X,{})}}const Se=s=>({}),se=s=>({}),Ee=s=>({}),ne=s=>({});function Fe(s){let e;const t=s[14].header,r=Z(t,s,s[18],ne);return{c(){r&&r.c()},l(n){r&&r.l(n)},m(n,a){r&&r.m(n,a),e=!0},p(n,a){r&&r.p&&(!e||a&262144)&&j(r,t,n,n[18],e?U(t,n[18],a,Ee):N(n[18]),ne)},i(n){e||($(r,n),e=!0)},o(n){C(r,n),e=!1},d(n){r&&r.d(n)}}}function re(s){let e,t,r;return t=new ke({}),{c(){e=y("div"),F(t.$$.fragment),this.h()},l(n){e=S(n,"DIV",{class:!0});var a=E(e);V(t.$$.fragment,a),a.forEach(b),this.h()},h(){I(e,"class","footer svelte-q6v7k9")},m(n,a){P(n,e,a),z(t,e,null),r=!0},i(n){r||($(t.$$.fragment,n),r=!0)},o(n){C(t.$$.fragment,n),r=!1},d(n){n&&b(e),L(t)}}}function Ve(s){let e,t,r,n,a,i,_,m,w,o,d,h;O(s[15]),r=new ye({props:{$$slots:{default:[Fe]},$$scope:{ctx:s}}});const k=s[14].default,g=Z(k,s,s[18],null),c=s[14].overlays,u=Z(c,s,s[18],se);let f=s[1]&&re();return{c(){e=y("div"),t=y("div"),F(r.$$.fragment),n=B(),a=y("div"),g&&g.c(),i=B(),u&&u.c(),_=B(),f&&f.c(),this.h()},l(l){e=S(l,"DIV",{class:!0});var v=E(e);t=S(v,"DIV",{class:!0});var M=E(t);V(r.$$.fragment,M),n=D(M),a=S(M,"DIV",{class:!0});var A=E(a);g&&g.l(A),A.forEach(b),i=D(M),u&&u.l(M),_=D(M),f&&f.l(M),M.forEach(b),v.forEach(b),this.h()},h(){I(a,"class","content svelte-q6v7k9"),q(a,"padded",s[2]),I(t,"class",m="board "+(s[9]?`side-${s[9]}`:"")+" svelte-q6v7k9"),O(()=>s[17].call(t)),q(t,"backdrop",s[0]),q(t,"with-footer",s[1]),I(e,"class","board-wrapper svelte-q6v7k9"),x(e,"--board-scale",s[8])},m(l,v){P(l,e,v),H(e,t),z(r,t,null),H(t,n),H(t,a),g&&g.m(a,null),H(t,i),u&&u.m(t,null),H(t,_),f&&f.m(t,null),s[16](t),w=fe(t,s[17].bind(t)),o=!0,d||(h=[W(window,"resize",s[12]),W(window,"resize",s[15]),W(t,"mousemove",s[11])],d=!0)},p(l,[v]){const M={};v&262144&&(M.$$scope={dirty:v,ctx:l}),r.$set(M),g&&g.p&&(!o||v&262144)&&j(g,k,l,l[18],o?U(k,l[18],v,null):N(l[18]),null),(!o||v&4)&&q(a,"padded",l[2]),u&&u.p&&(!o||v&262144)&&j(u,c,l,l[18],o?U(c,l[18],v,Se):N(l[18]),se),l[1]?f?v&2&&$(f,1):(f=re(),f.c(),$(f,1),f.m(t,null)):f&&(we(),C(f,1,1,()=>{f=null}),be()),(!o||v&512&&m!==(m="board "+(l[9]?`side-${l[9]}`:"")+" svelte-q6v7k9"))&&I(t,"class",m),(!o||v&513)&&q(t,"backdrop",l[0]),(!o||v&514)&&q(t,"with-footer",l[1]),v&256&&x(e,"--board-scale",l[8])},i(l){o||($(r.$$.fragment,l),$(g,l),$(u,l),$(f),o=!0)},o(l){C(r.$$.fragment,l),C(g,l),C(u,l),C(f),o=!1},d(l){l&&b(e),L(r),g&&g.d(l),u&&u.d(l),f&&f.d(),s[16](null),w(),d=!1,de(h)}}}function ze(s,e,t){let r,{$$slots:n={},$$scope:a}=e,{reportMousePosition:i=void 0}=e,{showBackdrop:_=!1}=e,{showFooter:m=!1}=e,{paddedContent:w=!1}=e;const o=$e(),d=o?He(o.machine.service,({context:p})=>{const T=Ie(p);if(T.isAdmin)return T.side}):ae(void 0);ue(s,d,p=>t(9,r=p));let h,k=1,g=1,c=1,u=1,f=1;const l=p=>{if(!i)return;const T=(p.clientX-h.offsetLeft)/k,ie=(p.clientY-h.offsetTop)/g;i([(T-(1-f)/2)/f,(ie-(1-f)/2)/f])},v=()=>{t(8,f=Math.min(c/(k+20),u/(g+20))),f>=1.3?t(8,f=1.3):t(8,f=Math.min(f,1))};ce(v);function M(){t(6,c=window.innerWidth),t(7,u=window.innerHeight)}function A(p){he[p?"unshift":"push"](()=>{h=p,t(3,h)})}function le(){k=this.clientWidth,g=this.clientHeight,t(4,k),t(5,g)}return s.$$set=p=>{"reportMousePosition"in p&&t(13,i=p.reportMousePosition),"showBackdrop"in p&&t(0,_=p.showBackdrop),"showFooter"in p&&t(1,m=p.showFooter),"paddedContent"in p&&t(2,w=p.paddedContent),"$$scope"in p&&t(18,a=p.$$scope)},[_,m,w,h,k,g,c,u,f,r,d,l,v,i,n,M,A,le,a]}class Ke extends K{constructor(e){super(),Q(this,e,ze,Ve,X,{reportMousePosition:13,showBackdrop:0,showFooter:1,paddedContent:2})}}function Le(s){let e,t,r='<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6L6 18M6 6l12 12"/>',n=[{viewBox:"0 0 24 24"},{width:"1.2em"},{height:"1.2em"},s[0]],a={};for(let i=0;i<n.length;i+=1)a=R(a,n[i]);return{c(){e=_e("svg"),t=new me(!0),this.h()},l(i){e=ge(i,"svg",{viewBox:!0,width:!0,height:!0});var _=E(e);t=ve(_,!0),_.forEach(b),this.h()},h(){t.a=null,ee(e,a)},m(i,_){P(i,e,_),t.m(r,e)},p(i,[_]){ee(e,a=Me(n,[{viewBox:"0 0 24 24"},{width:"1.2em"},{height:"1.2em"},_&1&&i[0]]))},i:Y,o:Y,d(i){i&&b(e)}}}function Pe(s,e,t){return s.$$set=r=>{t(0,e=R(R({},e),te(r)))},e=te(e),[e]}class qe extends K{constructor(e){super(),Q(this,e,Pe,Le,X,{})}}function Ae(s){let e,t,r,n,a,i,_,m,w,o,d,h,k,g;return t=new G({props:{faceId:3}}),n=new G({props:{faceId:2}}),i=new G({props:{faceId:6}}),m=new G({props:{faceId:5}}),d=new qe({}),{c(){e=y("div"),F(t.$$.fragment),r=B(),F(n.$$.fragment),a=B(),F(i.$$.fragment),_=B(),F(m.$$.fragment),w=B(),o=y("a"),F(d.$$.fragment),this.h()},l(c){e=S(c,"DIV",{class:!0});var u=E(e);V(t.$$.fragment,u),r=D(u),V(n.$$.fragment,u),a=D(u),V(i.$$.fragment,u),_=D(u),V(m.$$.fragment,u),u.forEach(b),w=D(c),o=S(c,"A",{href:!0,class:!0});var f=E(o);V(d.$$.fragment,f),f.forEach(b),this.h()},h(){I(e,"class","faces svelte-17o38i1"),I(o,"href","/"),I(o,"class","close unstyled svelte-17o38i1")},m(c,u){P(c,e,u),z(t,e,null),H(e,r),z(n,e,null),H(e,a),z(i,e,null),H(e,_),z(m,e,null),P(c,w,u),P(c,o,u),z(d,o,null),h=!0,k||(g=W(o,"click",pe(s[0])),k=!0)},p:Y,i(c){h||($(t.$$.fragment,c),$(n.$$.fragment,c),$(i.$$.fragment,c),$(m.$$.fragment,c),$(d.$$.fragment,c),h=!0)},o(c){C(t.$$.fragment,c),C(n.$$.fragment,c),C(i.$$.fragment,c),C(m.$$.fragment,c),C(d.$$.fragment,c),h=!1},d(c){c&&(b(e),b(w),b(o)),L(t),L(n),L(i),L(m),L(d),k=!1,g()}}}function Te(s){return[()=>{window.confirm("Möchtest du wirklich das Spiel verlassen?")&&(window.location.href="/")}]}class Qe extends K{constructor(e){super(),Q(this,e,Te,Ae,X,{})}}export{Ke as B,Qe as P,qe as X,He as a,oe as b,Ie as g,Xe as u};
