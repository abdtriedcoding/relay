(function(){"use strict";const r={WIDGET_URL:"http://localhost:3001",DEFAULT_POSITION:"bottom-right"},u=`<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 40 40" fill="none" aria-hidden="true">
  <path d="M13 30V11H20.5C25.2 11 25.2 20 20.5 20H13M19.5 20L27 29" stroke="#F3F5F2" stroke-width="3.2" stroke-linecap="square" stroke-linejoin="miter"/>
  <circle cx="28" cy="29.5" r="2.8" fill="#FFC94A"/>
</svg>`,y=`<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F3F5F2" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter">
  <path d="M18 6 6 18M6 6l12 12"></path>
</svg>`;(function(){let o=null,e=null,t=null,d=!1,n=null,s=r.DEFAULT_POSITION;const c=document.currentScript;if(c)n=c.getAttribute("data-org-id"),s=c.getAttribute("data-position")||r.DEFAULT_POSITION;else{const i=document.querySelectorAll('script[src*="relay-widget"], script[src*="echo-widget"], script[src*="embed"]'),a=Array.from(i).find(l=>l.hasAttribute("data-org-id"));a&&(n=a.getAttribute("data-org-id"),s=a.getAttribute("data-position")||r.DEFAULT_POSITION)}if(!n){console.error("Relay Widget: data-org-id attribute is required");return}function h(){document.readyState==="loading"?document.addEventListener("DOMContentLoaded",g):g()}function g(){t=document.createElement("button"),t.type="button",t.id="relay-widget-button",t.innerHTML=u,t.setAttribute("aria-label","Open Relay support chat"),t.style.cssText=`
      position: fixed;
      ${s==="bottom-right"?"right: 20px;":"left: 20px;"}
      bottom: 20px;
      width: 60px;
      height: 60px;
      border-radius: 14px;
      background: #0e2229;
      color: #f3f5f2;
      border: 1px solid #24434b;
      cursor: pointer;
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 6px 20px rgba(14, 34, 41, 0.28);
      transition: transform 0.18s ease, box-shadow 0.18s ease;
    `,t.addEventListener("click",L),t.addEventListener("mouseenter",()=>{t&&(t.style.transform="scale(1.05)")}),t.addEventListener("mouseleave",()=>{t&&(t.style.transform="scale(1)")}),document.body.appendChild(t),e=document.createElement("div"),e.id="relay-widget-container",e.style.cssText=`
      position: fixed;
      ${s==="bottom-right"?"right: 20px;":"left: 20px;"}
      bottom: 90px;
      width: 400px;
      height: 600px;
      max-width: calc(100vw - 40px);
      max-height: calc(100vh - 110px);
      z-index: 999998;
      border-radius: 6px;
      overflow: hidden;
      box-shadow: 0 12px 36px rgba(14, 34, 41, 0.22);
      display: none;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.3s ease;
    `,o=document.createElement("iframe"),o.src=w(),o.style.cssText=`
      width: 100%;
      height: 100%;
      border: none;
    `,o.allow="microphone; clipboard-read; clipboard-write",e.appendChild(o),document.body.appendChild(e),window.addEventListener("message",f)}function w(){const i=new URLSearchParams;return i.append("orgId",n),`${r.WIDGET_URL}?${i.toString()}`}function f(i){if(i.origin!==new URL(r.WIDGET_URL).origin||typeof i.data!="object"||i.data===null)return;const{type:a,payload:l}=i.data;switch(a){case"close":p();break;case"resize":l.height&&e&&(e.style.height=`${l.height}px`);break}}function L(){d?p():m()}function m(){e&&t&&(d=!0,e.style.display="block",setTimeout(()=>{e&&(e.style.opacity="1",e.style.transform="translateY(0)")},10),t.innerHTML=y)}function p(){e&&t&&(d=!1,e.style.opacity="0",e.style.transform="translateY(10px)",setTimeout(()=>{e&&(e.style.display="none")},300),t.innerHTML=u,t.style.background="#0e2229")}function b(){window.removeEventListener("message",f),e&&(e.remove(),e=null,o=null),t&&(t.remove(),t=null),d=!1}function v(i){b(),i.orgId&&(n=i.orgId),i.position&&(s=i.position),h()}const x={init:v,show:m,hide:p,destroy:b};window.RelayWidget=x,window.EchoWidget=x,h()})()})();
