<template>
    <el-container class="news-container" ref="newsPublic">
        <el-header class="nopadding">
        </el-header>
        <el-main class="nopadding">
            <el-container style="height: 100%;">
                <el-header class="nopadding search_head">
                    <el-button v-if="this.$store.state.user.prop=='1'" @click="handleAdd" icon="el-icon-plus" size="small" type="primary" plain style="margin:10px 0px 10px 0px;">添加</el-button>
                    <el-form :model="formSearch" label-width="80px">
                        <el-form-item label="名称">
                            <el-input placeholder="请输入标题" v-model="formSearch.title" class="input-with-select" size="small" clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="类型">
                            <el-select v-model="formSearch.type" placeholder="请选择">
                                <el-option value="" label="全部">全部</el-option>
                                <el-option
                                v-for="item in typeList"
                                :key="item.key"
                                :label="item.value"
                                :value="item.key">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <el-button @click="handleSearch" icon="el-icon-search" size="small" type="primary" plain style="margin:10px 0px 10px 10px;">搜索</el-button>
                </el-header>
                <el-main class="nopadding">
                    <el-table :data="tableData" border stripe style="width: 100%;" size="small" height="100%" :header-cell-style="{background:'#ECF5FF',color:'#606266'}" fit v-loading="loading"
                        highlight-current-row>
                        <el-table-column prop="title" label="标题" width="300" header-align="center" fixed>
                            <!-- <template slot-scope="scope">
                                <a class="activeLink" @click="modifyRow(scope.row)">{{scope.row.title}}</a>
                            </template> -->
                        </el-table-column>
                        <el-table-column prop="typeName" label="类型" align="center">
                        </el-table-column>
                        <el-table-column prop="author" label="作者" align="center"></el-table-column>
                        <el-table-column label="置顶" align="center">
                            <template slot-scope="scope">
                                {{scope.row.isRecommend==0 ? '否' : '是'}}
                            </template>
                        </el-table-column>
                        <el-table-column label="对外" align="center">
                            <template slot-scope="scope">
                                {{scope.row.isOuter==0 ? '否' : '是'}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                        <el-table-column v-if="this.$store.state.user.prop=='1'" label="操作" align="center" width="150">
                            <template slot-scope="scope">
                                <el-tooltip content="预览" placement="top">
                                    <el-button size="mini" type="primary" icon="el-icon-view" @click="viewRow(scope.row)" circle plain></el-button>
                                </el-tooltip>
                                <el-tooltip content="编辑" placement="top">
                                    <el-button size="mini" type="primary" icon="el-icon-edit" @click="modifyRow(scope.row)" circle plain></el-button>
                                </el-tooltip>
                                <el-tooltip content="删除" placement="top">
                                    <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteRow(scope.row)" circle plain></el-button>
                                </el-tooltip>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-main>
                <el-footer>
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 50]" :page-size="rows"
                        layout="total, sizes, prev, pager, next, jumper" :total="total">
                    </el-pagination>
                </el-footer>
            </el-container>
        </el-main>
    </el-container>
</template>

<script>
import getEnumList from './../../assets/js/common.js'

export default {
    name: 'ArticleIndex',
    data() {
        return {
            tableData: [],
            loading: false,
            formSearch: {
                title: '',
                type: ''
            },
            page: 1,
            rows: 15,
            total: 0,
            typeList:[],
        }
    },
    async created() {
        this.typeList = await getEnumList("ArticleEnum");
        this.getTableData()
    },
    methods: {
        getTableData() {
            this.loading = true
            this.$axios.get(
                "/api/article/list?title="+this.formSearch.title +"&type="+ this.formSearch.type +"&page="+ this.page + "&row="+ this.rows
            ).then(res => {
                if(res.data.content){
                    res.data.content.map((item)=>{
                        if(item.type){
                            item.typeName = this.getTypeName(item.type);
                        }
                    })
                }
                this.tableData = res.data.content;
                this.total = res.data.totalElements;
                this.loading = false
            }).catch(err => {
                this.loading = false
                console.log(err);
            })
        },
        getTypeName(code){
            let typeName = "";
            this.typeList.some((item)=>{
                if(item.key==code){
                    typeName= item.value;
                    return true;
                }
            })
            return typeName;
        },
        handleSearch() {
            this.getTableData()
        },
        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
            this.rows = val
            this.page = 1
            this.getTableData()
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.page = val
            this.getTableData()
        },
        handleAdd() {
            // window.open("/articleEdit?isAdd=true")
            this.$router.push({path:'./articleEdit', query:{isAdd: true}})
        },
        //编辑
        modifyRow(row) {
            // window.open("/articleEdit?isAdd=true")
            this.$router.push({ path: './articleEdit', query:
                {
                    id: row.id,
                }
            })
        },
        deleteRow(row) {
            this.$confirm('是否确定删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.delete(
                    "/api/article/"+row.id
                ).then(res => {
                    if (res.data) {
                        this.$message({ type: 'success', message: '删除成功!' });
                        this.getTableData()
                    } else {
                        this.$message.error("删除失败！");
                    }
                }).catch(err => {
                    console.log(err);
                })

            }).catch(() => { });

        },
        viewRow(row) {
            this.$router.push({ path: './articleView', query:
                {
                    id: row.id,
                }
            })
            // window.open("../articleView?id=" + row.id);
        },

    },
    activated(){
        let that = this
        Self.$on('detailShow',(data)=>{ // 接收
            if(data.isAdd){ // 是新增还是编辑--这个是在跳转的时候带过去的--新增/编辑页面也会根据这个显示内容有所区别
               that.tableData.push(data)
               that.tableData = Array.from(new Set(that.addParams.SubsidyInfos)) // 为避免重复去个重
            }else{
　　　　　　　　　//　that.addParams[that.editIndex] = data // 刚开始想通过直接修改，后来发现不行，因为页面是有缓存的，显示的还是未修改之前的
                Vue.set(that.tableData,that.editIndex,data) // 用set方法修改数据
            }
        })

    },
}
</script>

<style lang="scss" scoped>
.news-container {
    padding: 10px;
    height: 100%;
    box-sizing: border-box;
    .el-header {
        height: auto !important;
    }
    .el-footer {
        height: auto !important;
        background-color: #ecf5ff;
    }
}
.demo-form-inline {
    text-align: right;
    .el-form-item {
        margin-bottom: 10px;

        &:last-child {
            float: left;
        }
    }
}

.el-tabs__header {
    margin-bottom: 10px;
}

.demo-ruleForm {
    .el-date-editor {
        width: 100%;
    }
    .el-form-item {
        width: 90%;
    }
    .el-upload-list {
        display: flex;
        li {
            flex: 0 0 50%;
        }
    }
}

.activeLink {
    color: #008cd6;
    cursor: pointer;
}

.activeLink:hover {
    color: #606266;
}
</style>
<style lang="scss" scoped>
.demo-ruleForm {
    .el-upload-list {
        flex-flow: row wrap;
        display: flex;
        li {
            // margin: 0 10px 10px 0;
            flex: 0 0 50%;
        }
    }
}
</style>

