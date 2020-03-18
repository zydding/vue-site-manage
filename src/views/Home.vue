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
						<NavMenu :className="className" :navMenus="menuData"></NavMenu>
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
								@close="handleClose(tag)">
								{{tag.name}}
								</el-tag>
						</el-header>
						<el-main class="nopadding">
							<keep-alive :include="tags">
								<router-view></router-view>
							</keep-alive>
							<!-- <router-view></router-view> -->
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
				{ name: '主页', type: '',isClose: false },
				{ name: '标签二', type: 'success',isClose: true },
				{ name: '标签三', type: 'info',isClose: true },
				{ name: '标签四', type: 'warning',isClose: true },
				{ name: '标签五', type: 'danger',isClose: true }
			],
			isCollapse: true,
			collspan: '<i class="el-icon-s-unfold" title="展开"></i>',
			className: "el-menu--collapse",
			activeMenu: '/home/',
			openeds: ['/home/'],
			menuWidth: '',
			menuData: [
				{
					"id": "11", 
					"name": "主页", 
					"parentId": "-1", 
					"orderNo": 1,
					"target": "_self",
					"url": "/home/",
					"childNum": null,
					"children": null,
					icon: "el-icon-s-home",
				},
				{
					"id": "269633163607670784", 
					"name": "后台管理", 
					"parentId": "-1", 
					"orderNo": 1, 
					"target": "_self", 
					"url": "/home", 
					"childNum": null, 
					icon: "el-icon-setting",
					"children": [
						{
							"id": "281924385252573184", 
							"name": "文章管理", 
							"parentId": "269633163607670784", 
							"orderNo": 1, 
							"target": "_self", 
							"url": "/home/articleIndex", 
							"childNum": null, 
							"children": null, 
						},
						{
							"id": "281924385252573184", 
							"name": "作品管理", 
							"parentId": "269633163607670784", 
							"orderNo": 1, 
							"target": "_self", 
							"url": "/home/productIndex", 
							"childNum": null, 
							"children": null, 
						},
						{
							"id": "281924385252573184", 
							"name": "用户管理", 
							"parentId": "269633163607670784", 
							"orderNo": 1, 
							"target": "_self", 
							"url": "/home/userIndex", 
							"childNum": null, 
							"children": null, 
						},
						
					], 
				}, 
			],
        };
    },
    name:'Home',
    methods:{
		//collspanChange
		collspanChange(){
			this.isCollapse = this.isCollapse?false: true;
			this.className = this.isCollapse?"el-menu--collapse":'';
			this.menuWidth = this.isCollapse?"":'200px';
			this.collspan = this.collspan == '<i class="el-icon-s-fold" title="收回"></i>'?
				'<i class="el-icon-s-unfold" title="展开"></i>':'<i class="el-icon-s-fold" title="收回"></i>'
		},
        handleClose(tag) {
			this.tags.splice(this.tags.indexOf(tag), 1);
		},
		handleAdd() {
			let inputValue = this.inputValue;
			if (inputValue) {
			this.tags.push(inputValue);
			}
			this.inputVisible = false;
			this.inputValue = '';
		},
		handSelect(key, keyPath){
			this.openeds = [];
			var parents = this.menuData;
			var data = this.findPath(key, parents);
			this.activeMenu = data?data.url:"";
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
            const isExist = this.tags.some(item => {
                return item.path === route.fullPath;
            })
            if(!isExist){
                this.tags.push({
                    title: route.name,
                    path: route.fullPath,
					name: route.name,
					isClose: true
                })
            }
        },
	},
	watch:{
        $route(newValue, oldValue){
			console.log(newValue);
            this.setTags(newValue);
        }
	},
	created(){
        // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
        bus.$on('tags', msg => {
            let arr = [];
            for(let i = 0, len = msg.length; i < len; i ++){
                // 提取组件名存到tags中，通过include匹配
                msg[i].name && arr.push(msg[i].name);
            }
            this.tags = arr;
        })
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