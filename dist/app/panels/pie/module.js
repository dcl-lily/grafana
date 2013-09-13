define("panels/pie/module",["angular","app","underscore","jquery","kbn","config"],function(e,t,n,r,i,s){var o=e.module("kibana.panels.pie",[]);t.useModule(o),o.controller("pie",["$scope","$rootScope","querySrv","dashboard","filterSrv",function(t,r,i,o,u){t.panelMeta={status:"Deprecated",description:"Uses an Elasticsearch terms facet to create a pie chart. You should really only point this at not_analyzed fields for that reason. This panel is going away soon, it has <strong>been replaced by the terms panel</strong>. Please use that one instead."};var a={editorTabs:[{title:"Queries",src:"app/partials/querySelect.html"}],query:{field:"_type",goal:100},queries:{mode:"all",ids:[]},size:10,exclude:[],donut:!1,tilt:!1,legend:"above",labels:!0,mode:"terms",default_field:"DEFAULT",spyable:!0};n.defaults(t.panel,a),t.init=function(){t.$on("refresh",function(){t.get_data()}),t.get_data()},t.set_mode=function(e){switch(e){case"terms":t.panel.query={field:"_all"};break;case"goal":t.panel.query={goal
:100}}},t.set_refresh=function(e){t.refresh=e},t.close_edit=function(){t.refresh&&t.get_data(),t.refresh=!1,t.$emit("render")},t.get_data=function(){if(o.indices.length===0)return;t.panelMeta.loading=!0;var e=t.ejs.Request().indices(o.indices);t.panel.queries.ids=i.idsByMode(t.panel.queries);var r=t.ejs.BoolQuery();n.each(t.panel.queries.ids,function(e){r=r.should(i.getEjsObj(e))});var s;t.panel.mode==="terms"?(e=e.facet(t.ejs.TermsFacet("pie").field(t.panel.query.field||t.panel.default_field).size(t.panel.size).exclude(t.panel.exclude).facetFilter(t.ejs.QueryFilter(t.ejs.FilteredQuery(r,u.getBoolFilter(u.ids))))).size(0),t.populate_modal(e),s=e.doSearch(),s.then(function(e){t.panelMeta.loading=!1,t.hits=e.hits.total,t.data=[];var r=0;n.each(e.facets.pie.terms,function(e){var n={label:e.term,data:e.count};t.data.push(),t.data.push(n),r+=1}),t.$emit("render")})):(e=e.query(r).filter(u.getBoolFilter(u.ids)).size(0),t.populate_modal(e),s=e.doSearch(),s.then(function(e){t.panelMeta.loading=!1
;var n=e.hits.total,r=t.panel.query.goal-n;t.data=[{label:"Complete",data:n,color:"#BF6730"},{data:r,color:"#e2d0c4"}],t.$emit("render")}))},t.populate_modal=function(n){t.modal={title:"Inspector",body:"<h5>Last Elasticsearch Query</h5><pre>curl -XGET "+s.elasticsearch+"/"+o.indices+"/_search?pretty -d'\n"+e.toJson(JSON.parse(n.toString()),!0)+"'</pre>"}}}]),o.directive("pie",["querySrv","filterSrv","dashboard",function(t,s,o){return{restrict:"A",link:function(u,a){function f(){a.css({height:u.panel.height||u.row.height});var e;u.panel.mode==="goal"?e={show:u.panel.labels,radius:0,formatter:function(e,t){var r=parseInt(u.row.height.replace("px",""),10)/8+String("px");return n.isUndefined(e)?"":'<div style="font-size:'+r+';font-weight:bold;text-align:center;padding:2px;color:#fff;">'+Math.round(t.percent)+"%</div>"}}:e={show:u.panel.labels,radius:2/3,formatter:function(e,t){return'<div "style="font-size:8pt;text-align:center;padding:2px;color:white;">'+e+"<br/>"+Math.round(t.percent)+"%</div>"
},threshold:.1};var i={series:{pie:{innerRadius:u.panel.donut?.45:0,tilt:u.panel.tilt?.45:1,radius:1,show:!0,combine:{color:"#999",label:"The Rest"},label:e,stroke:{width:0}}},grid:{backgroundColor:null,hoverable:!0,clickable:!0},legend:{show:!1},colors:t.colors};a.is(":visible")&&require(["vendor/jquery/jquery.flot.pie.js"],function(){u.legend=r.plot(a,u.data,i).getData(),u.$$phase||u.$apply()})}a.html('<center><img src="img/load_big.gif"></center>'),u.$on("render",function(){f()}),e.element(window).bind("resize",function(){f()}),a.bind("plotclick",function(e,t,n){if(!n)return;u.panel.mode==="terms"&&(s.set({type:"terms",field:u.panel.query.field,value:n.series.label}),o.refresh())});var l=r("<div>");a.bind("plothover",function(e,t,n){n?l.html([i.query_color_dot(n.series.color,15),n.series.label||"",parseFloat(n.series.percent).toFixed(1)+"%"].join(" ")).place_tt(t.pageX,t.pageY,{offset:10}):l.remove()})}}}])});