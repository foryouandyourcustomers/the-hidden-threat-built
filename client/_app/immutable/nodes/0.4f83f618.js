import{s as f,n as m,c as $,a as h,u as g,g as y,b as S}from"../chunks/scheduler.2144c616.js";import{S as _,i as d,e as b,A as k,c as q,d as c,q as l,h as A,k as B,s as E,l as G,f as T,m as U,g as W,n as u,o as p,p as v}from"../chunks/index.ae0c723c.js";import{p as w}from"../chunks/stores.04ad8d40.js";function C(i){let s,a;return document.title=s="UniBW - "+(i[0]??"Serious Game"),{c(){a=b("meta"),this.h()},l(n){const o=k("svelte-14ks68m",document.head);a=q(o,"META",{name:!0,content:!0}),o.forEach(c),this.h()},h(){l(a,"name","description"),l(a,"content","This is a serious game")},m(n,o){A(document.head,a)},p(n,[o]){o&1&&s!==(s="UniBW - "+(n[0]??"Serious Game"))&&(document.title=s)},i:m,o:m,d(n){c(a)}}}function L(i,s,a){let n,o,t;return $(i,w,e=>a(2,t=e)),i.$$.update=()=>{i.$$.dirty&4&&a(1,n=t.data.seo),i.$$.dirty&2&&a(0,o=n==null?void 0:n.title)},[o,n,t]}class M extends _{constructor(s){super(),d(this,s,L,C,f,{})}}function j(i){let s,a,n;s=new M({});const o=i[1].default,t=h(o,i,i[0],null);return{c(){B(s.$$.fragment),a=E(),t&&t.c()},l(e){G(s.$$.fragment,e),a=T(e),t&&t.l(e)},m(e,r){U(s,e,r),W(e,a,r),t&&t.m(e,r),n=!0},p(e,[r]){t&&t.p&&(!n||r&1)&&g(t,o,e,e[0],n?S(o,e[0],r,null):y(e[0]),null)},i(e){n||(u(s.$$.fragment,e),u(t,e),n=!0)},o(e){p(s.$$.fragment,e),p(t,e),n=!1},d(e){e&&c(a),v(s,e),t&&t.d(e)}}}function z(i,s,a){let{$$slots:n={},$$scope:o}=s;return i.$$set=t=>{"$$scope"in t&&a(0,o=t.$$scope)},[o,n]}class I extends _{constructor(s){super(),d(this,s,z,j,f,{})}}export{I as component};
