<template>
    <div class="header">
        <el-menu :default-active="activeIndex" class="el-menu-demo hidden-sm-and-down" mode="horizontal" @select="handleSelect">
            <el-menu-item index="1"><a href="/">首页</a></el-menu-item>
            <el-menu-item index="2"><a href="article.html">文章</a></el-menu-item>
            <el-menu-item index="3"><a href="product.html">作品</a></el-menu-item>
            <el-menu-item index="4"><a href="contact.html">留言</a></el-menu-item>
            <el-menu-item index="5"><a href="about.html">关于</a></el-menu-item>
        </el-menu>
        <el-form :inline="true" :model="formInline" size="small" class="demo-form-inline">
            <el-form-item>
                <el-input v-model="formInline.key" placeholder="搜索"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit"><i class="iconfont iconfont-icon-search"></i></el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    data(){
        return ({
            activeIndex: "1",
            formInline: {
                key:""
            }
        })
    },
    name:'Header',
    methods:{
        handleSelect(e){
            console.log(e)
        },
        onSubmit(){

        }
    }
}
</script>

<style lang="scss">
    .header{
        display: flex;
        flex-flow: row nowrap;
        justify-content: space-between;
        align-items: center;
        .el-form{
            .el-button--small, .el-button--small.is-round{
                line-height: inherit;
                padding: 0 15px;
                border: 0;
                .iconfont-icon-search{
                    font-size: 16px;
                }
            }
        }
    }
    .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
        margin-bottom: 0;
    }

</style>