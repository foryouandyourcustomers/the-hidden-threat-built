import{S as _,i as f,s as d,k as $,C as h,l as g,h as c,n as l,D as y,E as u,F as S,G as b,y as B,a as E,z as G,c as k,A,b as C,H as T,I as U,J as W,g as m,d as p,B as q}from"../chunks/index.8741fe9c.js";import{p as v}from"../chunks/stores.e523f392.js";function w(i){let s,n;return document.title=s="UniBW - "+(i[0]??"Serious Game"),{c(){n=$("meta"),this.h()},l(a){const o=h("svelte-14ks68m",document.head);n=g(o,"META",{name:!0,content:!0}),o.forEach(c),this.h()},h(){l(n,"name","description"),l(n,"content","This is a serious game")},m(a,o){y(document.head,n)},p(a,[o]){o&1&&s!==(s="UniBW - "+(a[0]??"Serious Game"))&&(document.title=s)},i:u,o:u,d(a){c(n)}}}function z(i,s,n){let a,o,t;return S(i,v,e=>n(2,t=e)),i.$$.update=()=>{i.$$.dirty&4&&n(1,a=t.data.seo),i.$$.dirty&2&&n(0,o=a==null?void 0:a.title)},[o,a,t]}class D extends _{constructor(s){super(),f(this,s,z,w,d,{})}}function F(i){let s,n,a;s=new D({});const o=i[1].default,t=b(o,i,i[0],null);return{c(){B(s.$$.fragment),n=E(),t&&t.c()},l(e){G(s.$$.fragment,e),n=k(e),t&&t.l(e)},m(e,r){A(s,e,r),C(e,n,r),t&&t.m(e,r),a=!0},p(e,[r]){t&&t.p&&(!a||r&1)&&T(t,o,e,e[0],a?W(o,e[0],r,null):U(e[0]),null)},i(e){a||(m(s.$$.fragment,e),m(t,e),a=!0)},o(e){p(s.$$.fragment,e),p(t,e),a=!1},d(e){q(s,e),e&&c(n),t&&t.d(e)}}}function H(i,s,n){let{$$slots:a={},$$scope:o}=s;return i.$$set=t=>{"$$scope"in t&&n(0,o=t.$$scope)},[o,a]}class L extends _{constructor(s){super(),f(this,s,H,F,d,{})}}export{L as default};
