<template>
	<el-container>
		<el-header>
			<Header></Header>
		</el-header>
		<el-main class="nopadding">
			<el-container>
				<!-- 左侧菜单 -->
				<el-aside :width="menuWidth" style="border-right: 1px solid #ddd;">
					<el-menu class="el-menu-vertical-demo" 
						:collapse="isCollapse" 
						:default-active="activeMenu"
						:default-openeds="openeds"
						@select="handSelect"
						router>
						<!-- 游客 -->
						<NavMenu v-if="this.$store.state.user.prop==0" :className="className" :navMenus="menuData1"></NavMenu>
						<!-- 管理员 -->
						<NavMenu v-else :className="className" :navMenus="menuData"></NavMenu>
					</el-menu>
					<div class="collspan" v-html="collspan" @click="collspanChange">{{collspan}}</div>
				</el-aside>
				<el-main class="main_content nopadding">
					<!-- 内容区 -->
					<el-container>
						<el-header height="auto">
							<el-tag
								:key="tag.name"
								v-for="tag in tags"
								:closable="tag.isClose"
								:disable-transitions="false"
								:class="{'active': tag.isActive==true}"
								@close="handleClose(tag)"
								@click="tagClick(tag)"
								>
								{{tag.name}}
								</el-tag>
							<!-- <ul class="tags">
								<li class="tags-li el-tag" :class="{'active': item.isActive==true}" v-for="(item,index) in tags" :key="index">
									<router-link :to="item.path" class="tags-li-title">
										{{item.name}}
									</router-link>
									<span v-if="item.isClose" class="tags-li-icon" @click="handleClose(item)"><i class="el-icon-close"></i></span>
								</li>
							</ul> -->
						</el-header>
						<el-main class="nopadding">
							<transition name="move" mode="out-in">
								<keep-alive>
									<router-view></router-view>
								</keep-alive>
							</transition>
						</el-main>
					</el-container>
				</el-main>
			</el-container>
		</el-main>
	</el-container>
</template>

<script>
import Header from "./../components/Header.vue";
import NavMenu from "./../components/NavMenu.vue";
export default {
	components: {
		Header,NavMenu
	},
    data(){
        return {
			tags: [
				// { name: '主页', isActive: true,isClose: false },
				// { name: '标签二', isActive: false,isClose: true },
				// { name: '标签三', isActive: false,isClose: true },
				// { name: '标签四', isActive: false,isClose: true },
				// { name: '标签五', isActive: false,isClose: true }
			],
			isCollapse: true,
			collspan: '<i class="el-icon-s-unfold" title="展开"></i>',
			className: "el-menu--collapse",
			activeMenu: '/home',
			openeds: ['/home'],
			menuWidth: '',
			menuData: [
				{
					"id": "11", 
					"name": "主页", 
					"parentId": "-1", 
					"orderNo": 1,
					"target": "_self",
					"url": "/home",
					"childNum": null,
					"children": null,
					icon: "el-icon-s-home",
					isRouter: true,
				},
				{
					"id": "269633163607670784", 
					"name": "后台管理", 
					"parentId": "-1", 
					"orderNo": 1, 
					"target": "_self", 
					"childNum": null, 
					"url": "11",
					icon: "el-icon-setting",
					isRouter: true,
					"children": [
						{
							"id": "281924385252573184", 
							"name": "文章管理", 
							"parentId": "269633163607670784", 
							"orderNo": 1, 
							"target": "_self", 
							"url": "/articleIndex", 
							"childNum": null, 
							"children": null, 
							isRouter: true,
						},
						{
							"id": "281924385252573184", 
							"name": "作品管理", 
							"parentId": "269633163607670784", 
							"orderNo": 1, 
							"target": "_self", 
							"url": "/productIndex", 
							"childNum": null, 
							"children": null, 
							isRouter: true,
						},
						{
							"id": "281924385252573184", 
							"name": "用户管理", 
							"parentId": "269633163607670784", 
							"orderNo": 1, 
							"target": "_self", 
							"url": "/userIndex", 
							"childNum": null, 
							"children": null, 
							isRouter: true,
						},
						{
							"id": "281924385252573184",
							"name": "访问记录",
							"parentId": "269633163607670784",
							"orderNo": 1,
							"target": "_self",
							"url": "/pageViewLog",
							"childNum": null,
							"children": null,
							isRouter: true,
						},
						
					], 
				}, 
			],
			menuData1: [
				{
					"id": "11", 
					"name": "主页", 
					"parentId": "-1", 
					"orderNo": 1,
					"target": "_self",
					"url": "/home",
					"childNum": null,
					"children": null,
					icon: "el-icon-s-home",
					isRouter: true,
				},
				{
					"id": "269633163607670784", 
					"name": "后台管理", 
					"parentId": "-1", 
					"orderNo": 1, 
					"target": "_self", 
					"childNum": null, 
					"url": "11",
					icon: "el-icon-setting",
					isRouter: true,
					"children": [
						{
							"id": "281924385252573184", 
							"name": "文章管理", 
							"parentId": "269633163607670784", 
							"orderNo": 1, 
							"target": "_self", 
							"url": "/articleIndex", 
							"childNum": null, 
							"children": null, 
							isRouter: true,
						},
						{
							"id": "281924385252573184", 
							"name": "作品管理", 
							"parentId": "269633163607670784", 
							"orderNo": 1, 
							"target": "_self", 
							"url": "/productIndex", 
							"childNum": null, 
							"children": null, 
							isRouter: true,
						},
					], 
				}, 
			],
        };
    },
    name:'Home',
    methods:{
		//左边缩回或者打开菜单
		collspanChange(){
			this.isCollapse = this.isCollapse?false: true;
			this.className = this.isCollapse?"el-menu--collapse":'';
			this.menuWidth = this.isCollapse?"":'200px';
			this.collspan = this.collspan == '<i class="el-icon-s-fold" title="收回"></i>'?
				'<i class="el-icon-s-unfold" title="展开"></i>':'<i class="el-icon-s-fold" title="收回"></i>'
		},
		//关闭tag
        handleClose(tag) {
			// console.log("关闭",tag);
			this.tags.splice(this.tags.indexOf(tag), 1);
			if(tag.isActive){
				let active = this.tags[this.tags.length-1];
				this.$router.push(active);
				//选择最后一个
				this.handSelect(active.path);
			}
		},
		handleAdd() {
			let inputValue = this.inputValue;
			if (inputValue) {
				this.tags.push(inputValue);
			}
			this.inputVisible = false;
			this.inputValue = '';
		},
		//选择左边的菜单
		handSelect(key, keyPath){
			// console.log("选择"+key);
			this.openeds = [];
			var parents = this.menuData;
			var data = this.findPath(key, parents);
			this.activeMenu = data?data.url:"";
		},
		//选择tag
		tagClick(route){
			if(!route.isActive){
				this.$router.push(route);
				this.handSelect(route.path);
			}
		},
		//找到选中的对象
		findPath(key, parents) {
			for (var index in parents) {
				if (parents[index].url === key) {
					this.openeds.push(parents[index].url);
					return parents[index];
					break;
				}
				if(parents[index].children && parents[index].children.length>0){
					this.openeds.push(parents[index].url);
					return this.findPath(key,parents[index].children)
				}
			}
		},
        setTags(route){
			let isExist = true;
            this.tags.map((item) => {
				if(item.path === route.fullPath){
					item.isActive=true;
					isExist= false;
				}else{
					item.isActive=false;
				}
			})
			//如果是空的，加入首页
			if(this.tags.length==0 && route.fullPath!=="/home"){
				this.tags.push({
					title: "系统首页",
                    path: "/home",
					name: "系统首页",
					isClose: false,
					isActive: false,
				})
			}
			//不存在
            if(isExist){
				let isClose=true;
				if(route.fullPath=="/home"){
					isClose=false;
				}
                this.tags.push({
                    title: route.name,
                    path: route.fullPath,
					name: route.name,
					isClose: isClose,
					isActive: true,
                })
            }
        },
	},
	watch:{
        $route(newVal, oldVal){
			// console.log("路由变化",newVal);
			//不是路由，不加入
			if(newVal.meta.isRouter){
				this.setTags(newVal);
			}
		},
	},
	mounted(){
		let route= this.$route;
		if(route.meta.isRouter){
			this.handSelect(route.fullPath);
			this.setTags(route);
		}
	},
}
</script>

<style lang="scss" scoped>
	/**header */
	.el-header{
		background: linear-gradient(to right,#1278f6,#00b4aa);
		color: #eff4fe;
	}
	.main_content{
		.el-header{
			padding: 10px 10px;
			background: transparent;
			border-bottom: 1px solid #ddd;
			box-shadow: 0px 0px 1px #eee;
		}
	}
	/**tag */
	.el-tag{
		cursor: pointer;
		a{
			color: inherit;
		}
	}

	.el-tag.active{
		background-color: #4DA7FD;
		color: #fff;
	}
	
	.el-tag + .el-tag {
		margin-left: 10px;
	}

	
	.button-new-tag {
		margin-left: 10px;
		height: 32px;
		line-height: 30px;
		padding-top: 0;
		padding-bottom: 0;
	}
	.input-new-tag {
		width: 90px;
		margin-left: 10px;
		vertical-align: bottom;
	}
	//菜单

	.el-menu{
		border-right: 0;
		height: calc( 100% - 40px);
	}
	.collspan{
		height: 40px;
		width: 40px;
		display: flex;
		flex-flow: row nowrap;
		justify-content: center;
		font-size: 1.2rem;
		position: absolute;
		left: 50%;
		margin-left: -20px;
		top: auto;
		bottom: 0;
		cursor: pointer;
	}
</style>