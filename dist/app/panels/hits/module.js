define("panels/hits/module",["angular","app","underscore","jquery","kbn","jquery.flot","jquery.flot.pie"],function(e,t,n,r,i){var s=e.module("kibana.panels.hits",[]);t.useModule(s),s.controller("hits",["$scope","querySrv","dashboard","filterSrv",function(t,r,i,s){t.panelMeta={editorTabs:[{title:"Queries",src:"app/partials/querySelect.html"}],status:"Stable",description:"The total hits for a query or set of queries. Can be a pie chart, bar chart, list, or absolute total of all queries combined"};var o={queries:{mode:"all",ids:[]},style:{"font-size":"10pt"},arrangement:"horizontal",chart:"bar",counter_pos:"above",donut:!1,tilt:!1,labels:!0,spyable:!0};n.defaults(t.panel,o),t.init=function(){t.hits=0,t.$on("refresh",function(){t.get_data()}),t.get_data()},t.get_data=function(o,u){delete t.panel.error,t.panelMeta.loading=!0;if(i.indices.length===0)return;var a=n.isUndefined(o)?0:o,f=t.ejs.Request().indices(i.indices[a]);t.panel.queries.ids=r.idsByMode(t.panel.queries),n.each(t.panel.queries
.ids,function(e){var n=t.ejs.FilteredQuery(r.getEjsObj(e),s.getBoolFilter(s.ids));f=f.facet(t.ejs.QueryFacet(e).query(n)).size(0)}),t.inspector=e.toJson(JSON.parse(f.toString()),!0);var l=f.doSearch();l.then(function(e){t.panelMeta.loading=!1,a===0&&(t.hits=0,t.data=[],u=t.query_id=(new Date).getTime());if(!n.isUndefined(e.error)){t.panel.error=t.parse_error(e.error);return}var s=n.map(n.keys(e.facets),function(e){return parseInt(e,10)});if(t.query_id===u&&n.intersection(s,t.panel.queries.ids).length===t.panel.queries.ids.length){var o=0;n.each(t.panel.queries.ids,function(i){var s=e.facets[i],u=n.isUndefined(t.data[o])||a===0?s.count:t.data[o].hits+s.count;t.hits+=s.count,t.data[o]={info:r.list[i],id:i,hits:u,data:[[o,u]]},o++}),t.$emit("render"),a<i.indices.length-1&&t.get_data(a+1,u)}})},t.set_refresh=function(e){t.refresh=e},t.close_edit=function(){t.refresh&&t.get_data(),t.refresh=!1,t.$emit("render")}}]),s.directive("hitsChart",["querySrv",function(t){return{restrict:"A",link:function(
s,o){function u(){o.css({height:s.panel.height||s.row.height});try{n.each(s.data,function(e){e.label=e.info.alias,e.color=e.info.color})}catch(e){return}try{s.panel.chart==="bar"&&(s.plot=r.plot(o,s.data,{legend:{show:!1},series:{lines:{show:!1},bars:{show:!0,fill:1,barWidth:.8,horizontal:!1},shadowSize:1},yaxis:{show:!0,min:0,color:"#c8c8c8"},xaxis:{show:!1},grid:{borderWidth:0,borderColor:"#eee",color:"#eee",hoverable:!0},colors:t.colors})),s.panel.chart==="pie"&&(s.plot=r.plot(o,s.data,{legend:{show:!1},series:{pie:{innerRadius:s.panel.donut?.4:0,tilt:s.panel.tilt?.45:1,radius:1,show:!0,combine:{color:"#999",label:"The Rest"},stroke:{width:0},label:{show:s.panel.labels,radius:2/3,formatter:function(e,t){return"<div ng-click=\"build_search(panel.query.field,'"+e+"')"+' "style="font-size:8pt;text-align:center;padding:2px;color:white;">'+e+"<br/>"+Math.round(t.percent)+"%</div>"},threshold:.1}}},grid:{hoverable:!0,clickable:!0},colors:t.colors}))}catch(e){o.text(e)}}s.$on("render",function(
){u()}),e.element(window).bind("resize",function(){u()});var a=r("<div>");o.bind("plothover",function(e,t,n){if(n){var r=s.panel.chart==="bar"?n.datapoint[1]:n.datapoint[1][0][1];a.html(i.query_color_dot(n.series.color,20)+" "+r.toFixed(0)).place_tt(t.pageX,t.pageY)}else a.remove()})}}}])});