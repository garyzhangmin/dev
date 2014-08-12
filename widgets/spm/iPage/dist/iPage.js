define("alipay/iPage/1.0.0/iPage",["$","./juicer","./iPage.css"],function(a){var b=a("$"),c=a("./juicer");a("./iPage.css");var d=function(a){b.extend(this,d.defaults,a),this.init()};return d.defaults={target:"",pageSize:0,pageShow:7,tpl:'<div class="mi-paging fn-right"> <span class="mi-paging-info fn-ml15">每页</span> <div class="mi-paging-select mi-paging-select-normal-border" data-role="sizeSelect"> <p data-role="sizeValue">${pageSize}</p> <ul data-role="sizeOptions"> <li data-role="sizeOpt">10</li> <li data-role="sizeOpt" class="bg-gray">20</li> <li data-role="sizeOpt">50</li> </ul> <div class="arrow" data-role="sizeSelect"> <div></div> </div> </div><span class="mi-paging-info mi-paging-which"> <input type="text" name="pageRedirect" value="${currentPage}" data-role="gotoNum" /> </span> <a class="mi-paging-item mi-paging-goto" href="javascript:void(0)" data-role="goto"><span class="paging-text">跳转</span></a> <span class="mi-paging-info fn-ml15"><span class="paging-text mi-paging-bold">${currentPage}/${totalPage}</span>页</span>{@if isFirstPage } <span href="#" class="mi-paging-item mi-paging-prev mi-paging-prev-disabled fn-mr10"><span class="paging-text">上一页</span><span class="mi-paging-icon"></span></span> {@else} <a href="#" class="mi-paging-item mi-paging-prev fn-mr10" data-role="prev"><span class="paging-text">上一页</span><span class="mi-paging-icon"></span></a> {@/if}{@if isLastPage } <span href="#" class="mi-paging-item mi-paging-next mi-paging-next-disabled"><span class="paging-text">下一页</span><span class="mi-paging-icon"></span></span> {@else} <a href="#" class="mi-paging-item mi-paging-next" data-role="next"><span class="paging-text">下一页</span><span class="mi-paging-icon"></span></a> {@/if} </div>',totalSize:0,currentPage:1,beforeChange:null,onChange:null,auto:!0},d.prototype={init:function(){this.target&&"string"==typeof this.target&&(this.target=b(this.target)),this.target&&this.auto?this.gotoPage(this.currentPage):this.initAttr()},initAttr:function(){this.currentPage=~~this.currentPage,this.totalSize=~~this.totalSize,this.pageShow=~~this.pageShow,this.pageSize=~~this.pageSize,this.currentPage<1&&(this.currentPage=1),this.currentPage>this.totalPage&&(this.currentPage=this.totalPage),this.realPageSize=this.pageSize>this.totalSize?this.totalSize:this.pageSize,this.totalPage=0==this.realPageSize?1:Math.ceil(this.totalSize/this.realPageSize);var a,b,c=[];if(0==this.pageShow||this.pageShow>=this.totalPage)a=1,b=this.totalPage;else{var d=Math.floor(this.pageShow/2);a=this.currentPage-d,b=a+this.pageShow-1,1>a&&(a=1,b=this.pageShow),b>this.totalPage&&(b=this.totalPage,a=b-this.pageShow+1)}for(;b>=a;a++)c.push(a);this.pageNumbers=c,this.currentFrom=this.realPageSize*(this.currentPage-1)+1,this.currentTo=this.realPageSize*this.currentPage,this.isFirstPage=1==this.currentPage,this.isLastPage=this.currentPage==this.totalPage},bindEvents:function(){var a=this;this.targetHandler=this.target.click(function(c){if(a.changing)return!1;a.changing=!0;var d=b(c.target),e=d.attr("data-role")||d.parent().attr("data-role");switch(e){case"prev":a.gotoPage(a.getPrevPageIndex());break;case"next":a.gotoPage(a.getNextPageIndex());break;case"first":a.gotoPage(1);break;case"last":a.gotoPage(a.totalPage);break;case"goto":a.gotoPage(a.target.find("[data-role=gotoNum]").val());break;case"pageNum":"pageNum"==d.attr("data-role")&&(d=d.children(":first")),a.gotoPage(d.html());break;case"sizeSelect":a.target.find("[data-role=sizeOptions]").toggle();break;case"sizeOpt":a.pageSize=~~d.html(),a.gotoPage(1);break;default:d.parents("[data-role=sizeSelect]").length||a.target.find("[data-role=sizeOptions]").hide()}a.changing=!1}),b(window).click(function(c){b(c.target).parents("[data-role=sizeSelect]").length||a.target.find("[data-role=sizeOptions]").hide()})},destroy:function(){this.target.unbind("click").html("")},pgNumInputBindEvents:function(){var a=this,b=this.target.find("[data-role=gotoNum]");b.keypress(function(c){var d=c.charCode?c.charCode:c.keyCode?c.keyCode:0;13==d&&a.gotoPage(parseInt(b.val(),10))})},getPrevPageIndex:function(){return this.currentPage=~~this.currentPage,this.currentPage-1>1?this.currentPage-1:1},getNextPageIndex:function(){return this.currentPage=~~this.currentPage,this.totalPage=~~this.totalPage,this.currentPage+1<=this.totalPage?this.currentPage+1:this.totalPage},gotoPage:function(a){this.currentPage=~~a,this.initAttr(),this.beforeChange&&this.beforeChange.call(this),this.renderPage(),this.onChange&&this.onChange.call(this)},renderPage:function(){this.totalPage>1?(this.target.html(c.to_html(this.tpl,this)),this.hasBindEvents||(this.bindEvents(),this.hasBindEvents=!0),this.pgNumInputBindEvents()):this.target.html("")}},d}),define("alipay/iPage/1.0.0/juicer",[],function(a,b,c){var d=function(){var a=[].slice.call(arguments);return a.push(d.options),a[0].match(/^\s*#([\w:\-\.]+)\s*$/gim)&&a[0].replace(/^\s*#([\w:\-\.]+)\s*$/gim,function(b,c){var d=document,e=d&&d.getElementById(c);a[0]=e?e.value||e.innerHTML:b}),1==arguments.length?d.compile.apply(d,a):arguments.length>=2?d.to_html.apply(d,a):void 0},e={escapehash:{"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;","'":"&#x27;","/":"&#x2f;"},escapereplace:function(a){return e.escapehash[a]},escaping:function(a){return"string"!=typeof a?a:a.replace(/[&<>"]/gim,this.escapereplace)},detection:function(a){return"undefined"==typeof a?"":a}},f=function(a){if("undefined"!=typeof console){if(console.warn)return console.warn(a),void 0;if(console.log)return console.log(a),void 0}throw a},g=function(a,b){if(a=a!==Object(a)?{}:a,a.__proto__)return a.__proto__=b,a;var c=function(){},d=Object.create?Object.create(b):new(c.prototype=b,c);for(var e in a)a.hasOwnProperty(e)&&(d[e]=a[e]);return d};return d.__cache={},d.version="0.6.5-stable",d.settings={},d.tags={operationOpen:"{@",operationClose:"}",interpolateOpen:"\\${",interpolateClose:"}",noneencodeOpen:"\\$\\${",noneencodeClose:"}",commentOpen:"\\{#",commentClose:"\\}"},d.options={cache:!0,strip:!0,errorhandling:!0,detection:!0,_method:g({__escapehtml:e,__throw:f,__juicer:d},{})},d.tagInit=function(){var a=d.tags.operationOpen+"each\\s*([^}]*?)\\s*as\\s*(\\w*?)\\s*(,\\s*\\w*?)?"+d.tags.operationClose,b=d.tags.operationOpen+"\\/each"+d.tags.operationClose,c=d.tags.operationOpen+"if\\s*([^}]*?)"+d.tags.operationClose,e=d.tags.operationOpen+"\\/if"+d.tags.operationClose,f=d.tags.operationOpen+"else"+d.tags.operationClose,g=d.tags.operationOpen+"else if\\s*([^}]*?)"+d.tags.operationClose,h=d.tags.interpolateOpen+"([\\s\\S]+?)"+d.tags.interpolateClose,i=d.tags.noneencodeOpen+"([\\s\\S]+?)"+d.tags.noneencodeClose,j=d.tags.commentOpen+"[^}]*?"+d.tags.commentClose,k=d.tags.operationOpen+"each\\s*(\\w*?)\\s*in\\s*range\\(([^}]+?)\\s*,\\s*([^}]+?)\\)"+d.tags.operationClose,l=d.tags.operationOpen+"include\\s*([^}]*?)\\s*,\\s*([^}]*?)"+d.tags.operationClose;d.settings.forstart=new RegExp(a,"igm"),d.settings.forend=new RegExp(b,"igm"),d.settings.ifstart=new RegExp(c,"igm"),d.settings.ifend=new RegExp(e,"igm"),d.settings.elsestart=new RegExp(f,"igm"),d.settings.elseifstart=new RegExp(g,"igm"),d.settings.interpolate=new RegExp(h,"igm"),d.settings.noneencode=new RegExp(i,"igm"),d.settings.inlinecomment=new RegExp(j,"igm"),d.settings.rangestart=new RegExp(k,"igm"),d.settings.include=new RegExp(l,"igm")},d.tagInit(),d.set=function(a,b){var c=this,d=function(a){return a.replace(/[\$\(\)\[\]\+\^\{\}\?\*\|\.]/gim,function(a){return"\\"+a})},e=function(a,b){var e=a.match(/^tag::(.*)$/i);return e?(c.tags[e[1]]=d(b),c.tagInit(),void 0):(c.options[a]=b,void 0)};if(2===arguments.length)return e(a,b),void 0;if(a===Object(a))for(var f in a)a.hasOwnProperty(f)&&e(f,a[f])},d.register=function(a,b){var c=this.options._method;return c.hasOwnProperty(a)?!1:c[a]=b},d.unregister=function(a){var b=this.options._method;return b.hasOwnProperty(a)?delete b[a]:void 0},d.template=function(a){var b=this;this.options=a,this.__interpolate=function(a,b,c){var d,e=a.split("|"),f=e[0]||"";return e.length>1&&(a=e.shift(),d=e.shift().split(","),f="_method."+d.shift()+".call({}, "+[a].concat(d)+")"),"<%= "+(b?"_method.__escapehtml.escaping":"")+"("+(c&&c.detection===!1?"":"_method.__escapehtml.detection")+"("+f+")"+")"+" %>"},this.__removeShell=function(a,c){var e=0;return a=a.replace(d.settings.forstart,function(a,b,c,d){var c=c||"value",d=d&&d.substr(1),f="i"+e++;return"<% ~function() {for(var "+f+" in "+b+") {"+"if("+b+".hasOwnProperty("+f+")) {"+"var "+c+"="+b+"["+f+"];"+(d?"var "+d+"="+f+";":"")+" %>"}).replace(d.settings.forend,"<% }}}(); %>").replace(d.settings.ifstart,function(a,b){return"<% if("+b+") { %>"}).replace(d.settings.ifend,"<% } %>").replace(d.settings.elsestart,function(){return"<% } else { %>"}).replace(d.settings.elseifstart,function(a,b){return"<% } else if("+b+") { %>"}).replace(d.settings.noneencode,function(a,d){return b.__interpolate(d,!1,c)}).replace(d.settings.interpolate,function(a,d){return b.__interpolate(d,!0,c)}).replace(d.settings.inlinecomment,"").replace(d.settings.rangestart,function(a,b,c,d){var f="j"+e++;return"<% ~function() {for(var "+f+"="+c+";"+f+"<"+d+";"+f+"++) {{"+"var "+b+"="+f+";"+" %>"}).replace(d.settings.include,function(a,b,c){return"<%= _method.__juicer("+b+", "+c+"); %>"}),c&&c.errorhandling===!1||(a="<% try { %>"+a,a+='<% } catch(e) {_method.__throw("Juicer Render Exception: "+e.message);} %>'),a},this.__toNative=function(a,b){return this.__convert(a,!b||b.strip)},this.__lexicalAnalyze=function(a){var b=[],c=[],e="",f=["if","each","_","_method","console","break","case","catch","continue","debugger","default","delete","do","finally","for","function","in","instanceof","new","return","switch","this","throw","try","typeof","var","void","while","with","null","typeof","class","enum","export","extends","import","super","implements","interface","let","package","private","protected","public","static","yield","const","arguments","true","false","undefined","NaN"],g=function(a,b){if(Array.prototype.indexOf&&a.indexOf===Array.prototype.indexOf)return a.indexOf(b);for(var c=0;c<a.length;c++)if(a[c]===b)return c;return-1},h=function(a,e){if(e=e.match(/\w+/gim)[0],-1===g(b,e)&&-1===g(f,e)&&-1===g(c,e)){if("undefined"!=typeof window&&"function"==typeof window[e]&&window[e].toString().match(/^\s*?function \w+\(\) \{\s*?\[native code\]\s*?\}\s*?$/i))return a;if("undefined"!=typeof global&&"function"==typeof global[e]&&global[e].toString().match(/^\s*?function \w+\(\) \{\s*?\[native code\]\s*?\}\s*?$/i))return a;if("function"==typeof d.options._method[e]||d.options._method.hasOwnProperty(e))return c.push(e),a;b.push(e)}return a};a.replace(d.settings.forstart,h).replace(d.settings.interpolate,h).replace(d.settings.ifstart,h).replace(d.settings.elseifstart,h).replace(d.settings.include,h).replace(/[\+\-\*\/%!\?\|\^&~<>=,\(\)\[\]]\s*([A-Za-z_]+)/gim,h);for(var i=0;i<b.length;i++)e+="var "+b[i]+"=_."+b[i]+";";for(var i=0;i<c.length;i++)e+="var "+c[i]+"=_method."+c[i]+";";return"<% "+e+" %>"},this.__convert=function(a,b){var c=[].join("");return c+="'use strict';",c+="var _=_||{};",c+="var _out='';_out+='",c+=b!==!1?a.replace(/\\/g,"\\\\").replace(/[\r\t\n]/g," ").replace(/'(?=[^%]*%>)/g,"	").split("'").join("\\'").split("	").join("'").replace(/<%=(.+?)%>/g,"';_out+=$1;_out+='").split("<%").join("';").split("%>").join("_out+='")+"';return _out;":a.replace(/\\/g,"\\\\").replace(/[\r]/g,"\\r").replace(/[\t]/g,"\\t").replace(/[\n]/g,"\\n").replace(/'(?=[^%]*%>)/g,"	").split("'").join("\\'").split("	").join("'").replace(/<%=(.+?)%>/g,"';_out+=$1;_out+='").split("<%").join("';").split("%>").join("_out+='")+"';return _out.replace(/[\\r\\n]\\s+[\\r\\n]/g, '\\r\\n');"},this.parse=function(a,c){var d=this;return c&&c.loose===!1||(a=this.__lexicalAnalyze(a)+a),a=this.__removeShell(a,c),a=this.__toNative(a,c),this._render=new Function("_, _method",a),this.render=function(a,c){return c&&c===b.options._method||(c=g(c,b.options._method)),d._render.call(this,a,c)},this}},d.compile=function(a,b){b&&b===this.options||(b=g(b,this.options));try{var c=this.__cache[a]?this.__cache[a]:new this.template(this.options).parse(a,b);return b&&b.cache===!1||(this.__cache[a]=c),c}catch(d){return f("Juicer Compile Exception: "+d.message),{render:function(){}}}},d.to_html=function(a,b,c){return c&&c===this.options||(c=g(c,this.options)),this.compile(a,c).render(b,c._method)},"undefined"!=typeof c&&c.exports?c.exports=d:this.juicer=d,d}),define("alipay/iPage/1.0.0/iPage.css",[],function(){seajs.importStyle(".mi-paging{height:32px}.mi-paging,.mi-paging input{color:gray}.mi-paging .mi-paging-item,.mi-paging a.mi-paging-item,.mi-paging a.mi-paging-item:hover{color:gray;margin:0 2px 0 0}.mi-paging a,.mi-paging a:hover{text-decoration:none}.mi-paging-item,.mi-paging-item .paging-text,.mi-paging-hover a.mi-paging-hover,.mi-paging-hover .paging-text,a.mi-paging-hover .paging-text,.mi-paging-item-down,a.mi-paging-item-down,.mi-paging-item-down .paging-text,a.mi-paging-item-down .paging-text a.mi-paging-item-down:hover .paging-text,a.mi-paging-item,a.mi-paging-item .paging-text,.mi-paging-ellipsis{float:left;background:transparent url(https://i.alipayobjects.com/e/201305/PqTHSrAFJ.png) no-repeat 0 0}.mi-page-item,.mi-paging-item,.mi-page-item,a.mi-paging-item{font-weight:700;text-decoration:none;height:32px;line-height:32px;padding:0 0 0 10px;background-position:0 0;position:relative}.mi-page-item .mi-paging-icon,a.mi-paging-item .mi-paging-icon{cursor:pointer}.mi-page-item .paging-text,a.mi-paging-item .paging-text{padding:0 10px 0 0;background-position:right 0;cursor:pointer}.mi-paging-item-hover,a.mi-paging-item:hover,.mi-paging-first-hover,.mi-paging-prev-hover,.mi-paging-next-hover,.mi-paging-last-hover{background-position:0 -32px}.mi-paging-first-hover .paging-text,.mi-paging-prev-hover .paging-text,.mi-paging-next-hover .paging-text,.mi-paging-last-hover .paging-text,.mi-paging-item-hover .paging-text,a.mi-paging-item:hover .paging-text{background-position:right -32px}.mi-paging-item-down,a.mi-paging-item-down,a.mi-paging-item-down:hover,.mi-paging-prev-down,a.mi-paging-prev-down,a.mi-paging-prev-down:hover,.mi-paging-next-down,a.mi-paging-next-down,a.mi-paging-next-down:hover,.mi-paging-first-down,a.mi-paging-first-down,a.mi-paging-first-down:hover,.mi-paging-last-down,a.mi-paging-last-down,a.mi-paging-last-down:hover,.mi-paging-goto-down,a.mi-paging-goto-down,a.mi-paging-goto-down:hover{background-position:0 -64px}.mi-paging-item-down .paging-text,a.mi-paging-item-down .paging-text,a.mi-paging-item-down:hover .paging-text,.mi-paging-prev-down .paging-text,a.mi-paging-prev-down .paging-text,a.mi-paging-prev-down:hover .paging-text,.mi-paging-next-down .paging-text,a.mi-paging-next-down .paging-text,a.mi-paging-next-down:hover .paging-text,.mi-paging-first-down .paging-text,a.mi-paging-first-down .paging-text,a.mi-paging-first-down:hover .paging-text,.mi-paging-last-down .paging-text,a.mi-paging-last-down .paging-text,a.mi-paging-last-down:hover .paging-text,.mi-paging-goto-down .paging-text,a.mi-paging-goto-down .paging-text,a.mi-paging-goto-down:hover .paging-text{background-position:right -64px}.mi-paging-current,a.mi-paging-current,a.mi-paging-current:hover{background-position:0 -96px}.mi-paging-current span,a.mi-paging-current .paging-text,a.mi-paging-current:hover .paging-text{background-position:right -96px}.mi-paging-first .paging-text,a.mi-paging-first .paging-text,.mi-paging-prev .paging-text,a.mi-paging-prev .paging-text,.mi-paging-next .paging-text,a.mi-paging-next .paging-text,.mi-paging-last .paging-text,a.mi-paging-last .paging-text{width:28px;padding:0;overflow:hidden;text-indent:-999px}.mi-paging .mi-paging-icon{background:url(https://i.alipayobjects.com/e/201305/QA8ASXpTZ.png) no-repeat}.mi-paging-first .mi-paging-icon,.mi-paging-prev .mi-paging-icon,.mi-paging-next .mi-paging-icon,.mi-paging-last .mi-paging-icon{background-position:0 0;width:6px;height:11px;position:absolute}.mi-paging-first .mi-paging-icon{width:13px;background-position:-217px -1px;top:11px;left:12px}.mi-paging-last .mi-paging-icon{width:13px;background-position:-245px -1px;top:11px;right:12px}.mi-paging-prev .mi-paging-icon{background-position:-7px 0;top:11px;left:14px}.mi-paging-next .mi-paging-icon{background-position:-28px 0;top:11px;right:15px}.mi-paging-item-disabled,a.mi-paging-item-disabled,a.mi-paging-item-disabled:hover,.mi-paging-first-disabled,a.mi-paging-first-disabled,a.mi-paging-first-disabled:hover,.mi-paging-last-disabled,a.mi-paging-last-disabled,a.mi-paging-last-disabled:hover,.mi-paging-prev-disabled,a.mi-paging-prev-disabled,a.mi-paging-prev-disabled:hover,.mi-paging-next-disabled,a.mi-paging-next-disabled,a.mi-paging-next-disabled:hover{cursor:default;background-position:0 -96px}.mi-paging-first-disabled .paging-text,a.mi-paging-first-disabled .paging-text,a.mi-paging-first-disabled:hover .paging-text,.mi-paging-first-disabled-hover .paging-text,.mi-paging-prev-disabled .paging-text,a.mi-paging-prev-disabled .paging-text,a.mi-paging-prev-disabled:hover .paging-text,.mi-paging-prev-disabled-hover .paging-text,.mi-paging-next-disabled .paging-text,a.mi-paging-next-disabled .paging-text,a.mi-paging-next-disabled:hover .paging-text,.mi-paging-next-disabled-hover .paging-text{cursor:default;background-position:right -96px}.mi-paging-first-disabled .mi-paging-icon,a.mi-paging-first-disabled .mi-paging-icon,a.mi-paging-first-disabled:hover .mi-paging-icon,.mi-paging-first-disabled-hover .mi-paging-icon{background-position:-231px -1px}.mi-paging-prev-disabled .mi-paging-icon,a.mi-paging-prev-disabled .mi-paging-icon,a.mi-paging-prev-disabled:hover .mi-paging-icon,.mi-paging-prev-disabled-hover .mi-paging-icon{background-position:-14px 0}.mi-paging-next-disabled .mi-paging-icon,a.mi-paging-next-disabled .mi-paging-icon,a.mi-paging-next-disabled:hover .mi-paging-icon,.mi-paging-next-disabled-hover .mi-paging-icon{background-position:-35px 0}.mi-paging-info{height:32px;line-height:32px;line-height:34px\\9;*line-height:34px;_line-height:32px;float:left;display:inline;margin:0 6px 0 5px;overflow:hidden;color:#A6A6A6}.mi-paging-ellipsis{width:35px;height:32px;text-indent:-10em;overflow:hidden;margin:0 2px 0 0;background-position:0 -160px}.mi-paging-goto .paging-text{font-weight:400}.mi-paging-which{padding:0 0 0 5px}.mi-paging-which input{height:30px;line-height:30px;font-size:14px;*margin-top:-1px;padding:0 6px;width:20px;font-weight:700;border:1px solid #CCC;overflow:hidden}.mi-paging-bold{font-weight:700}.mi-paging-select{width:58px;border:1px solid;position:relative;cursor:pointer;font-size:14px;display:inline-block;float:left}.mi-paging-select-normal-border{border-color:#a6a6a6 #ccc #ccc}.mi-paging-select-focus-border{border-color:#39f;box-shadow:0 0 1px 1px #39f;-webkit-box-shadow:0 0 1px 1px #39f;-moz-box-shadow:0 0 1px 1px #39f;-ms-box-shadow:0 0 1px 1px #39f;-o-box-shadow:0 0 1px 1px #39f}.mi-paging-select>ul{position:absolute;top:30px;left:-1px;background-color:#fff;width:100%;border-bottom:1px solid #ccc;border-left:1px solid #ccc;border-right:1px solid #ccc;display:none}.mi-paging-select>p,.mi-paging-select li{padding:6px 4px;height:17px;line-height:17px}.mi-paging-select li.selected,.mi-paging-select li:hover{color:#fff;background:#d9524e}.mi-paging-select .arrow{width:29px;height:29px;position:absolute;top:0;right:0}.mi-paging-select .arrow div{position:absolute;height:0;width:0;border-width:6px;border-style:solid;border-color:#666 transparent transparent;right:9px;top:13px}.mi-paging-select .bg-gray{background-color:#f2f2f2}")});
