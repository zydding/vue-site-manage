// 路由缓存管理
export default {
    computed: {
        keepAliveConf() {
            return this.$store.state.menuList.list;
        }
    },
    watch: {
        keepAliveConf(e) {
            // 监听缓存列表的变化，如果缓存列表中没有当前的路由或组件则在缓存中销毁该实例
            let name = this.$options.name.toLowerCase();
            if(e && e.length>0){
                let targe=0;
                // console.log('当前',name);
                e.some((val)=>{
                    if(val.path.toLowerCase().indexOf(name)!=-1){
                        targe=1;
                        return true;
                    }
                })
                if(targe===0){
                    // console.log('销毁',this.$options.name);
                    this.$destroy()
                }
            }
        }
    },
}
