import{Context as n,DynamicStyleSheet as r,InlineHyperZone as o,MemoSignal_Factory as s,StateSignal_Factory as p,TsignalHTMLRender as c,VanillaComponentRender as i,VanillaFragmentRender as m,VanillaTemplateRender as g}from"../chunk-SBL3M62D.js";var a=new n,h=a.addClass(p),S=a.addClass(s),d=new c({ctx:a}),{h:e,Fragment:b}=o.create({default:[new m,new g,d,new i]}),[,u,y]=h("My Paragraph Template"),l=new r;l.setRule("p",{color:"white",backgroundColor:"#666",padding:"5px"});var T=e("template",{id:"my-paragraph",sheets:[l.getSheet()]},e("p",null,u),e("slot",{name:"slot-1"},e("p",null,"Default Text")));console.log(T);var t=()=>e("my-paragraph",null);document.body.append(e(t,{"on:click":()=>console.log("This will NOT log, because 'MyParagraph' is a document fragment, not just any element. thereby unclickable.")},e("div",{"on:click":()=>console.log("This will log, because it is visible to the outer DOM scope, threby clickable."),slot:"slot-1"},"YAHAHA!! you found me")),e(t,null,e("p",{slot:"slot-1"},"another paragraph"),e("p",null,"BEGONE, ILLEGAL CHILD!! THERE IS NO EMPTY SLOT FOR YOU! YOU SHALL NEVER SEE THE LIGHT OF THE Document!")),e(t,null)),setTimeout(()=>{y("Paragraph text has been changed after 2000ms")},2e3);