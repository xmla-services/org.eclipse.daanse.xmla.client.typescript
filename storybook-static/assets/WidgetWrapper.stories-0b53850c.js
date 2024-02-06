import{c as R,V as I,a as N,b as h}from"./create-vuestic-essential-2ac30646.js";import{d as w,u as T,e,f as E,o as n,g as s,j as c,k as _,l as i,t as W,m as y,n as $,T as P,F as j}from"./vue.esm-bundler-e31f75a1.js";import{_ as A}from"./_plugin-vue_export-helper-c27b6911.js";import{I as D}from"./ImageWidget-5a47adc4.js";import{s as L}from"./chunk-UXHY756F-2120675b.js";import"./v4-4a60fe23.js";const M={class:"wrapper-container"},O={key:0,class:"wrapper-fullscreen_icon"},X={key:1,class:"wrapper-title"},G={class:"fullscreen-container"},H={class:"wrapper-fullscreen_icon"},J={key:0,class:"wrapper-title"},q=w({__name:"WidgetWrapper",props:{title:{type:String,required:!1,default:""},backgroundColor:{type:String,required:!1,default:"#fff"},titleColor:{type:String,required:!1,default:"#000"},titleFontSize:{type:Number,required:!1,default:20},borderSize:{type:Number,required:!1,default:1},borderColor:{type:String,required:!1,default:"#000"},borderRadius:{type:Number,required:!1,default:4},fullscreen:{type:Boolean,required:!1,default:!1}},setup(o,{expose:f}){T(u=>({"3f079d63":p.value,a12ab7b6:b.value,f7addb08:o.borderSize+"px","6673209d":C.value+"px","450a3077":g.value+"px","2da9cc9d":m.value}));const t=e(!1),r=o,a=e(r.title),p=e(r.backgroundColor),m=e(r.titleColor),g=e(r.titleFontSize),x=e(r.borderSize),b=e(r.borderColor),C=e(r.borderRadius),v=e(r.fullscreen);return f({title:a,backgroundColor:p,titleColor:m,titleFontSize:g,borderSize:x,borderColor:b,borderRadius:C,fullscreen:v}),(u,l)=>{const S=E("VaButton");return n(),s(j,null,[c("div",M,[v.value?(n(),s("div",O,[_(S,{preset:"secondary",icon:"fullscreen",onClick:l[0]||(l[0]=B=>t.value=!0)})])):i("",!0),a.value?(n(),s("div",X,W(a.value),1)):i("",!0),y(u.$slots,"default",{},void 0,!0)]),t.value?(n(),$(P,{key:0,to:"body"},[c("div",G,[c("div",H,[_(S,{preset:"secondary",icon:"close",onClick:l[1]||(l[1]=B=>t.value=!1)})]),a.value?(n(),s("div",J,W(a.value),1)):i("",!0),y(u.$slots,"default",{},void 0,!0)])])):i("",!0)],64)}}});const F=A(q,[["__scopeId","data-v-c80903f3"]]);q.__docgenInfo={exportName:"default",displayName:"WidgetWrapper",description:"",tags:{},expose:[{name:"title"},{name:"backgroundColor"},{name:"titleColor"},{name:"titleFontSize"},{name:"borderSize"},{name:"borderColor"},{name:"borderRadius"},{name:"fullscreen"}],props:[{name:"title",type:{name:"string"},required:!1,defaultValue:{func:!1,value:'""'}},{name:"backgroundColor",type:{name:"string"},required:!1,defaultValue:{func:!1,value:'"#fff"'}},{name:"titleColor",type:{name:"string"},required:!1,defaultValue:{func:!1,value:'"#000"'}},{name:"titleFontSize",type:{name:"number"},required:!1,defaultValue:{func:!1,value:"20"}},{name:"borderSize",type:{name:"number"},required:!1,defaultValue:{func:!1,value:"1"}},{name:"borderColor",type:{name:"string"},required:!1,defaultValue:{func:!1,value:'"#000"'}},{name:"borderRadius",type:{name:"number"},required:!1,defaultValue:{func:!1,value:"4"}},{name:"fullscreen",type:{name:"boolean"},required:!1,defaultValue:{func:!1,value:"false"}}],slots:[{name:"default"}],sourceFiles:["/home/markus/dev/xmla_slava/XMLAClient/src/components/Widgets/WidgetWrapper/WidgetWrapper.vue"]};L(async o=>{console.log([{name:"mdi-{icon}",resolve:({icon:t})=>({class:"material-icons-outlined",content:t,tag:"span"})}]),o.use(R({components:{VaIcon:I,VaButton:N},config:{icons:h({fonts:[{name:"mdi-{icon}",resolve:({icon:t})=>({class:"material-icons-outlined",content:t,tag:"span"})}]})}}))});const re={title:"Widget/StaticWidgets/Wrapper",component:F,tags:["autodocs"]},d={render:o=>({setup(){return{args:o}},template:`
      <WidgetWrapper
        :title="args.title"
        :backgroundColor="args.backgroundColor"
        :titleColor="args.titleColor"
        :titleFontSize="args.titleFontSize"
        :borderSize="args.borderSize"
        :borderColor="args.borderColor"
        :borderRadius="args.borderRadius"
        :fullscreen="args.fullscreen"
      >
        <ImageWidget imgSrc="https://placekitten.com/2000/1000" />
      </WidgetWrapper>
    `,components:{ImageWidget:D,WidgetWrapper:F}}),args:{title:"Widget title",backgroundColor:"#fff",titleColor:"#000",titleFontSize:20,borderSize:1,borderColor:"#000",borderRadius:4,fullscreen:!1}};var k,z,V;d.parameters={...d.parameters,docs:{...(k=d.parameters)==null?void 0:k.docs,source:{originalSource:`{
  render: (args: any) => ({
    setup() {
      return {
        args
      };
    },
    template: \`
      <WidgetWrapper
        :title="args.title"
        :backgroundColor="args.backgroundColor"
        :titleColor="args.titleColor"
        :titleFontSize="args.titleFontSize"
        :borderSize="args.borderSize"
        :borderColor="args.borderColor"
        :borderRadius="args.borderRadius"
        :fullscreen="args.fullscreen"
      >
        <ImageWidget imgSrc="https://placekitten.com/2000/1000" />
      </WidgetWrapper>
    \`,
    components: {
      ImageWidget,
      WidgetWrapper
    }
  }),
  args: {
    title: "Widget title",
    backgroundColor: "#fff",
    titleColor: "#000",
    titleFontSize: 20,
    borderSize: 1,
    borderColor: "#000",
    borderRadius: 4,
    fullscreen: false
  }
}`,...(V=(z=d.parameters)==null?void 0:z.docs)==null?void 0:V.source}}};const te=["Primary"];export{d as Primary,te as __namedExportsOrder,re as default};
