<template>
	<el-container>
		<el-header>
			<Header></Header>
		</el-header>
		<el-main class="nopadding">
			<el-container>
				<!-- 左侧菜单 -->
				<el-aside width="auto" style="border-right: 1px solid #ddd;">
					<el-menu default-active="1-4-1" class="el-menu-vertical-demo" :collapse="isCollapse">
						<el-submenu index="1">
							<template slot="title">
							<i class="el-icon-location"></i>
							<span slot="title">导航一</span>
							</template>
							<el-menu-item-group>
							<span slot="title">分组一</span>
							<el-menu-item index="1-1">选项1</el-menu-item>
							<el-menu-item index="1-2">选项2</el-menu-item>
							</el-menu-item-group>
							<el-menu-item-group title="分组2">
							<el-menu-item index="1-3">选项3</el-menu-item>
							</el-menu-item-group>
							<el-submenu index="1-4">
							<span slot="title">选项4</span>
							<el-menu-item index="1-4-1">选项1</el-menu-item>
							</el-submenu>
						</el-submenu>
						<el-menu-item index="2">
							<i class="el-icon-menu"></i>
							<span slot="title">导航二</span>
						</el-menu-item>
						<el-menu-item index="3" disabled>
							<i class="el-icon-document"></i>
							<span slot="title">导航三</span>
						</el-menu-item>
						<el-menu-item index="4">
							<i class="el-icon-setting"></i>
							<span slot="title">导航四</span>
						</el-menu-item>
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
								closable
								:disable-transitions="false"
								@close="handleClose(tag)">
								{{tag.name}}
								</el-tag>
						</el-header>
						<el-main class="nopadding">
							<router-view></router-view>
						</el-main>
					</el-container>
				</el-main>
			</el-container>
		</el-main>
	</el-container>
</template>

<script>
import Header from "./../components/Header.vue";
export default {
	components: {
		Header
	},
    data(){
        return {
			tags: [
				{ name: '标签一', type: '' },
				{ name: '标签二', type: 'success' },
				{ name: '标签三', type: 'info' },
				{ name: '标签四', type: 'warning' },
				{ name: '标签五', type: 'danger' }
			],
			isCollapse: true,
			collspan: '<i class="el-icon-s-unfold" title="展开"></i>'
        };
    },
    name:'Home',
    methods:{
		//collspanChange
		collspanChange(){
			this.isCollapse = this.isCollapse?false: true;
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
		
        
    }
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
		left: auto;
		right: 0;
		top: auto;
		bottom: 0;
		cursor: pointer;
	}
</style>