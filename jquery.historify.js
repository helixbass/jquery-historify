((function(){var a=Array.prototype.slice;(function(b){var c,d,e;return e=function(a,b){return a.substring(0,b.length)===b},c=function(){var b;return b=1<=arguments.length?a.call(arguments,0):[],function(a){var c,d,e;for(d=0,e=b.length;d<e;d++){c=b[d];if((c!=null?c[a]:void 0)!=null)return c[a]}return}},b.historify=d={options:{linkSelector:"a:internal:not(.no-ajaxy)",contentSelector:"#content",hide:function(a){return d.content.animate({opacity:0},800,a)},stopHide:function(){return d.content.stop(!0,!0)},show:function(a){return d.content.html(a.html()).animate({opacity:1},800)},afterShow:function(){},scrollOptions:{duration:800,easing:"swing"},matchingLinkSelector:function(a,b){return"a[href='"+b+"'],\na[href='/"+b+"'],\na[href='"+a+"']"},navActiveFilter:function(a,c,d){return function(){return b(this).has(a("matchingLinkSelector")(c,d))}},updateNav:function(a,c,d){return b(a("navSelector")).removeClass(a("navActiveClass")).filter(a("navActiveFilter")(a,c,d)).addClass(a("navActiveClass"))},navSelector:"nav li",navActiveClass:"active"},init:function(a){var f,g,h,i,j,k,l;return(typeof History!="undefined"&&History!==null?!History.enabled:!void 0)?!1:(j=History.getRootUrl(),b.expr[":"].internal=function(a){var c;return alert(a),c=b(a).attr("href"),e(c,j)||c.indexOf(":")===-1},l=c(a,d.options),f=b("body"),f.on("click",l("linkSelector"),function(a){var c,d;return a.which===2||a.metaKey?!0:(c=b(this),History.pushState(null,(d=c.attr("title"))!=null?d:null,c.attr("href")),a.preventDefault(),!1)}),g=d.content=b(l("contentSelector")),h=function(){return b.getScript(b(this).attr("src"))},k=function(){document.title=b(this).text();try{return document.getElementsByTagName("title")[0].innerHTML=document.title.replace("<","&lt;").replace(">","&gt;").replace(" & "," &amp; ")}catch(a){}},i=function(a){return String(a).replace(/<\!DOCTYPE[^\>]*/i,"").replace(/<(html|head|body|title|meta|script)([\s\>])/gi,"<div class='document-$1'$2").replace(/<\/(html|head|body|title|meta|script)\>/gi,"</div>")},b(window).on("statechange",function(){var a,c,d,e;return f.addClass("loading"),e=History.getState().url,a=function(){return document.location.href=e,!1},d=b.get(e).fail(a),c=function(c){var d,g,m,n,o,p;return d=b(i(c)),g=d.find(l("contentSelector")),m=d.find(".document-script"),m.length&&m.detach(),g.html()||a,n=e.replace(j,""),typeof (o=l("updateNav"))=="function"&&o(l,e,n),typeof (p=l("stopHide"))=="function"&&p(),l("show")(g),l("afterShow")(),d.find(".document-title").each(k),m.each(h),typeof f.scrollTo=="function"&&f.scrollTo(l("scrollOptions")),f.removeClass("loading"),typeof pageTracker!="undefined"&&pageTracker!==null&&pageTracker._trackPageview(n),typeof reinvigorate!="undefined"&&reinvigorate!==null?typeof reinvigorate.ajax_track=="function"?reinvigorate.ajax_track(e):void 0:void 0},l("stopHide")?(l("hide")(function(){}),d.done(c)):b.when(d,b.Deferred(function(a){return l("hide")(a.resolve)}).promise()).done(c)}))}}})(jQuery)})).call(this);