(this["webpackJsonpreact-adminv4"]=this["webpackJsonpreact-adminv4"]||[]).push([[10],{206:function(e,t,n){},229:function(e,t,n){e.exports={root:"root-fIjVT","role-menu-tip":"role-menu-tip-2A5Pr"}},244:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return w}));n(115);var a,i=n(86),r=(n(116),n(87)),o=(n(66),n(33)),l=(n(21),n(24)),c=n(5),s=n(1),u=n(2),d=n(3),f=n(4),m=n(0),p=n.n(m),h=n(78),b=n(18),v=n(8),g=n(9),y=n(11),j=n(83),S=n(22);n(206);var E,k,x=Object(b.a)({ajax:!0})(a=function(e){Object(f.a)(n,e);var t=Object(d.a)(n);function n(){var e;Object(s.a)(this,n);for(var a=arguments.length,i=new Array(a),r=0;r<a;r++)i[r]=arguments[r];return(e=t.call.apply(t,[this].concat(i))).state={loading:!1,menus:[],expandedRowKeys:[]},e.columns=[{title:"\u540d\u79f0",dataIndex:"text",key:"text",render:function(e,t){var n=t.icon;return n?p.a.createElement("span",null,p.a.createElement(y.e,{type:n})," ",e):e}},{title:"\u7c7b\u578b",dataIndex:"type",key:"type",render:function(e,t){return t.url?"\u7ad9\u5916\u83dc\u5355":"1"===e?"\u7ad9\u5185\u83dc\u5355":"2"===e?"\u529f\u80fd":"\u83dc\u5355"}}],e}return Object(u.a)(n,[{key:"componentDidMount",value:function(){this.handleSearch()}},{key:"handleSearch",value:function(){var e=this;Object(j.a)().then((function(t){var n=Object(g.a)(t).sort((function(e,t){var n=e.order||0,a=t.order||0;return n||a?a-n:e.text>t.text?1:-1})),a=Object(S.a)(n),i=t.map((function(e){return e.key}));e.setState({menus:a,expandedRowKeys:i})}))}},{key:"render",value:function(){var e=this,t=this.state,n=t.menus,a=t.loading,i=t.expandedRowKeys,r=this.props,o=r.value,l=r.onChange,c=Object(v.a)(r,["value","onChange"]);return p.a.createElement(y.k,Object.assign({expandable:{expandedRowKeys:i,onExpandedRowsChange:function(t){return e.setState({expandedRowKeys:t})}},rowSelection:{selectedRowKeys:o,onChange:l},loading:a,columns:this.columns,dataSource:n,pagination:!1},c))}}]),n}(m.Component))||a,O=Object(b.a)({ajax:!0,modal:{title:function(e){return e.isEdit?"\u4fee\u6539":"\u6dfb\u52a0"}}})(E=function(e){Object(f.a)(n,e);var t=Object(d.a)(n);function n(){var e;Object(s.a)(this,n);for(var a=arguments.length,i=new Array(a),r=0;r<a;r++)i[r]=arguments[r];return(e=t.call.apply(t,[this].concat(i))).state={loading:!1,data:{}},e.fetchData=function(){if(!e.state.loading){var t=e.props.id;e.setState({loading:!0}),e.props.ajax.get("/mock/roles/".concat(t)).then((function(t){e.setState({data:t||{}}),e.form.setFieldsValue(t)})).finally((function(){return e.setState({loading:!1})}))}},e.handleSubmit=function(t){if(!e.state.loading){var n=e.props.isEdit,a=n?"\u4fee\u6539\u6210\u529f\uff01":"\u6dfb\u52a0\u6210\u529f\uff01",i=n?e.props.ajax.put:e.props.ajax.post;e.setState({loading:!0}),i("/role",t,{successTip:a}).then((function(){var t=e.props.onOk;t&&t()})).finally((function(){return e.setState({loading:!1})}))}},e}return Object(u.a)(n,[{key:"componentDidMount",value:function(){this.props.isEdit&&this.fetchData()}},{key:"render",value:function(){var e=this,t=this.props.isEdit,n=this.state,a=n.loading,i=n.data,r={labelWidth:100};return p.a.createElement(y.g,{loading:a,okText:"\u4fdd\u5b58",cancelText:"\u91cd\u7f6e",onOk:function(){return e.form.submit()},onCancel:function(){return e.form.resetFields()}},p.a.createElement(o.default,{ref:function(t){return e.form=t},onFinish:this.handleSubmit,initialValues:i},t?p.a.createElement(y.c,Object.assign({},r,{type:"hidden",name:"id"})):null,p.a.createElement(y.c,Object.assign({},r,{label:"\u89d2\u8272\u540d\u79f0",name:"name",required:!0})),p.a.createElement(y.c,Object.assign({},r,{label:"\u63cf\u8ff0",name:"description"}))))}}]),n}(m.Component))||E;n(229);var w=Object(b.a)({path:"/roles",ajax:!0})(k=function(e){Object(f.a)(n,e);var t=Object(d.a)(n);function n(){var e;Object(s.a)(this,n);for(var a=arguments.length,i=new Array(a),r=0;r<a;r++)i[r]=arguments[r];return(e=t.call.apply(t,[this].concat(i))).state={loading:!1,dataSource:[],deleting:!1,visible:!1,id:null,loadingRoleMenu:!1,selectedKeys:[],selectedRoleId:void 0},e.columns=[{title:"\u89d2\u8272\u540d\u79f0",dataIndex:"name",width:150},{title:"\u63cf\u8ff0",dataIndex:"description"},{title:"\u64cd\u4f5c",dataIndex:"operator",width:100,render:function(t,n){var a=n.id,i=n.name,r=[{label:"\u4fee\u6539",onClick:function(t){t.stopPropagation(),e.setState({visible:!0,id:a})}},{label:"\u5220\u9664",color:"red",confirm:{title:'\u60a8\u786e\u5b9a\u5220\u9664"'.concat(i,'"?'),onConfirm:function(t){t.stopPropagation(),e.handleDelete(a)}}}];return p.a.createElement(y.h,{items:r})}}],e.handleSubmit=function(t){if(!e.state.loading){var n=Object(c.a)({},t);e.setState({loading:!0}),e.props.ajax.get("/mock/role",n).then((function(t){var n=t||[];e.setState({dataSource:n}),n[0]&&e.handleRowClick(n[0])})).finally((function(){return e.setState({loading:!1})}))}},e.handleDelete=function(t){e.state.deleting||(e.setState({deleting:!0}),e.props.ajax.del("/mock/roles/".concat(t),null,{successTip:"\u5220\u9664\u6210\u529f\uff01",errorTip:"\u5220\u9664\u5931\u8d25\uff01"}).then((function(){return e.form.submit()})).finally((function(){return e.setState({deleting:!1})})))},e.handleRowClick=function(t){var n=t.id;e.setState({selectedRoleId:n,selectedKeys:[]});var a={roleId:n};e.setState({loadingRoleMenu:!0}),e.props.ajax.get("/mock/roles/menus",a).then((function(t){e.setState({selectedKeys:t})})).finally((function(){return e.setState({loadingRoleMenu:!1})}))},e.handleSaveRoleMenu=function(){var t={ids:e.state.selectedKeys};e.setState({loading:!0}),e.props.ajax.post("/mock/roles/menus",t,{successTip:"\u4fdd\u5b58\u89d2\u8272\u6743\u9650\u6210\u529f\uff01"}).then((function(e){})).finally((function(){return e.setState({loading:!1})}))},e}return Object(u.a)(n,[{key:"componentDidMount",value:function(){this.handleSubmit()}},{key:"render",value:function(){var e,t=this,n=this.state,a=n.loading,c=n.dataSource,s=n.visible,u=n.id,d=n.selectedRoleId,f=n.selectedKeys,m=n.loadingRoleMenu,b={form:this.props.form,width:220,style:{paddingLeft:16}},v=null===(e=c.find((function(e){return e.id===d})))||void 0===e?void 0:e.name;return p.a.createElement(h.a,{className:"root-fIjVT",loading:a||m},p.a.createElement(y.j,null,p.a.createElement(o.default,{onFinish:this.handleSubmit,ref:function(e){return t.form=e}},p.a.createElement(y.d,null,p.a.createElement(y.c,Object.assign({},b,{label:"\u89d2\u8272\u540d",name:"name"})),p.a.createElement(y.c,{layout:!0},p.a.createElement(l.default,{type:"primary",htmlType:"submit"},"\u67e5\u8be2"),p.a.createElement(l.default,{onClick:function(){return t.form.resetFields()}},"\u91cd\u7f6e"),p.a.createElement(l.default,{type:"primary",onClick:function(){return t.setState({visible:!0,id:null})}},"\u6dfb\u52a0")),p.a.createElement("div",{className:"role-menu-tip-2A5Pr"},v?p.a.createElement("span",null,"\u5f53\u524d\u89d2\u8272\u6743\u9650\uff1a\u300c",v,"\u300d"):p.a.createElement("span",null,"\u8bf7\u5728\u5de6\u4fa7\u5217\u8868\u4e2d\u9009\u62e9\u4e00\u4e2a\u89d2\u8272\uff01"),p.a.createElement(l.default,{disabled:!v,type:"primary",onClick:this.handleSaveRoleMenu},"\u4fdd\u5b58\u6743\u9650"))))),p.a.createElement(i.default,null,p.a.createElement(r.default,{span:14},p.a.createElement(y.k,{rowClassName:function(e){return e.id===d?"role-table selected":"role-table"},serialNumber:!0,columns:this.columns,dataSource:c,rowKey:"id",onRow:function(e,n){return{onClick:function(){return t.handleRowClick(e,n)}}}})),p.a.createElement(r.default,{span:10},p.a.createElement(x,{value:f,onChange:function(e){return t.setState({selectedKeys:e})}}))),p.a.createElement(O,{visible:s,id:u,isEdit:null!==u,onOk:function(){return t.setState({visible:!1},t.form.submit)},onCancel:function(){return t.setState({visible:!1})}}))}}]),n}(m.Component))||k}}]);
//# sourceMappingURL=10.fb82c96c.chunk.js.map