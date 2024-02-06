import{d as W,e as S,w as $,f as v,o as C,g as x,k as l,p as i,F as b,j as m,q as j,y as L,z as M,A as w,v as I,B as T}from"./vue.esm-bundler-e31f75a1.js";import{_ as N}from"./_plugin-vue_export-helper-c27b6911.js";const O=c=>(L("data-v-9a9d5f93"),c=c(),M(),c),A={class:"settings-container"},B=O(()=>m("div",{class:"settings-container"},[m("div",null,[m("h3",{class:"mb-2"},"Select store")])],-1)),U=W({__name:"SvgWidgetSettings",props:["component"],setup(c){const p=c,d=S({textSection:!1,storeSection:!1}),t=S([{className:"",fill:"",stroke:"",strokeWidth:""}]),g=()=>t.value.push({className:"",fill:"",stroke:"",strokeWidth:""});return $(t,()=>{const n={};t.value.forEach(({className:a,fill:s,stroke:o,strokeWidth:u})=>{n[a]||(n[a]={fill:s,stroke:o,strokeWidth:u})},{}),p.component.classesConfig={...n}},{deep:!0}),(n,a)=>{const s=v("va-input"),o=v("va-button"),u=v("va-color-input"),k=v("va-data-table"),f=v("va-collapse");return C(),x(b,null,[l(f,{modelValue:d.value.textSection,"onUpdate:modelValue":a[1]||(a[1]=e=>d.value.textSection=e),header:"SVG  widget settings"},{default:i(()=>[m("div",A,[l(s,{modelValue:p.component.src,"onUpdate:modelValue":a[0]||(a[0]=e=>p.component.src=e),label:"SVG"},null,8,["modelValue"]),l(o,{class:"add-button",onClick:g},{default:i(()=>[j(" Add items ")]),_:1}),l(k,{class:"table-config",items:t.value,columns:[{key:"className"},{key:"fill"},{key:"stroke"},{key:"strokeWidth"}]},{"cell(className)":i(({rowIndex:e})=>[l(s,{class:"input-class-name",modelValue:t.value[e].className,"onUpdate:modelValue":r=>t.value[e].className=r},null,8,["modelValue","onUpdate:modelValue"])]),"cell(fill)":i(({rowIndex:e})=>[l(u,{class:"color-fill",modelValue:t.value[e].fill,"onUpdate:modelValue":r=>t.value[e].fill=r},null,8,["modelValue","onUpdate:modelValue"])]),"cell(stroke)":i(({rowIndex:e})=>[l(u,{class:"color-stroke",modelValue:t.value[e].stroke,"onUpdate:modelValue":r=>t.value[e].stroke=r},null,8,["modelValue","onUpdate:modelValue"])]),"cell(strokeWidth)":i(({rowIndex:e})=>[l(s,{class:"input-stroke-width",modelValue:t.value[e].strokeWidth,"onUpdate:modelValue":r=>t.value[e].strokeWidth=r},null,8,["modelValue","onUpdate:modelValue"])]),_:1},8,["items"])])]),_:1},8,["modelValue"]),l(f,{modelValue:d.value.storeSection,"onUpdate:modelValue":a[2]||(a[2]=e=>d.value.storeSection=e),header:"Store settings"},{default:i(()=>[B]),_:1},8,["modelValue"])],64)}}});const F=N(U,[["__scopeId","data-v-9a9d5f93"]]);U.__docgenInfo={exportName:"default",displayName:"SvgWidgetSettings",description:"",tags:{},props:[{name:"component",type:{name:"undefined"}}],sourceFiles:["/home/markus/dev/xmla_slava/XMLAClient/src/components/Widgets/Svg/SvgWidgetSettings.vue"]};const H=["innerHTML"],E=["innerHTML"],q=W({__name:"SvgWidget",props:{initialState:{type:Object,required:!1},src:{type:String,required:!1,default:"/demo/test.svg"},classesConfig:{type:Object,required:!1,default:null}},setup(c,{expose:p}){const d=F,t=S(""),g=c,n=S(g.classesConfig||null),a=w(()=>{let s="";const o=T(),u=o==null?void 0:o.type.__scopeId;if(n.value){s+="<style>";for(const[k,f]of Object.entries(n.value))s+=`
        [${u}] .${k} {
          stroke: ${f.stroke};
          fill: ${f.fill};
          stroke-width: ${f.strokeWidth};
        }
      `;s+="</style>"}return s});return I(async()=>{if(!g.src)return;const o=await(await fetch(g.src)).text();t.value=o}),p({src:t,classesConfig:n,settings:d}),(s,o)=>(C(),x(b,null,[m("div",{innerHTML:a.value},null,8,H),m("div",{class:"svg",innerHTML:t.value},null,8,E)],64))}});const G=N(q,[["__scopeId","data-v-333d8f29"]]);q.__docgenInfo={exportName:"default",displayName:"SvgWidget",description:"",tags:{},expose:[{name:"src"},{name:"classesConfig"},{name:"settings"}],props:[{name:"initialState",type:{name:"object"},required:!1},{name:"src",type:{name:"string"},required:!1,defaultValue:{func:!1,value:'"/demo/test.svg"'}},{name:"classesConfig",type:{name:"object"},required:!1,defaultValue:{func:!1,value:"null"}}],sourceFiles:["/home/markus/dev/xmla_slava/XMLAClient/src/components/Widgets/Svg/SvgWidget.vue"]};const P=""+new URL("test-c0fc04b1.svg",import.meta.url).href,R={title:"Widget/StaticWidgets/Svg",component:G,tags:["autodocs"]},_={args:{src:P,classesConfig:{primary:{stroke:"#fff",fill:"#000"},secondary:{stroke:"#ffffff",fill:"#ff0000"},ternary:{stroke:"#aaaaff",fill:"#ffff00"}}}};var y,V,h;_.parameters={..._.parameters,docs:{...(y=_.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    src: Svg,
    classesConfig: {
      primary: {
        stroke: "#fff",
        fill: "#000"
      },
      secondary: {
        stroke: "#ffffff",
        fill: "#ff0000"
      },
      ternary: {
        stroke: "#aaaaff",
        fill: "#ffff00"
      }
    }
  }
}`,...(h=(V=_.parameters)==null?void 0:V.docs)==null?void 0:h.source}}};const D=["Primary"];export{_ as Primary,D as __namedExportsOrder,R as default};
