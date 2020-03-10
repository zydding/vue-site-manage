<template>
    <el-container class="news-container" ref="newsPublic">
        <el-header class="nopadding">
        </el-header>
        <el-main class="nopadding">
            <el-container style="height: 100%;">
                <el-header class="nopadding">
                    <el-button @click="handleAdd" icon="el-icon-plus" size="small" type="primary" plain style="margin:10px 0px 10px 0px;">添加</el-button>
                    <!-- <el-input v-model="title" placeholder="请输入标题" size="small"></el-input> -->
                    <!-- <el-button @click="handleSearch" type="primary" size="small" icon="el-icon-search" plain>查询</el-button> -->
                    <el-input placeholder="请输入标题" v-model="title" class="input-with-select" size="small" style="width: 250px; float: right; margin-top: 9px" clearable>
                        <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
                    </el-input>
                </el-header>
                <el-main class="nopadding">
                    <el-table :data="tableData" border stripe style="width: 100%;" size="small" height="100%" :header-cell-style="{background:'#ECF5FF',color:'#606266'}" fit v-loading="loading"
                        highlight-current-row>
                        <el-table-column prop="title" label="标题" width="300" header-align="center" fixed>
                            <template slot-scope="scope">
                                <a class="activeLink" @click="modifyRow(scope.row)">{{scope.row.title}}</a>
                            </template>
                        </el-table-column>
                        <!--                    <el-table-column prop="columnName" label="类型" align="center"></el-table-column>-->
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
                        <el-table-column label="操作" align="center" width="150">
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

export default {
    name: 'ArticleIndex',
    data() {
        return {
            tableData: [],
            loading: false,
            title: "",
            page: 1,
            rows: 15,
            total: 0,
        }
    },
    created() {
        this.getTableData()
    },
    methods: {
        getTableData() {
            this.loading = true
            this.$axios.get(
                "/api/article/list?title="+this.title+"&page="+ this.page + "&row="+ this.rows
            ).then(res => {
                this.tableData = res.data.content;
                this.total = res.data.totalElements;
                this.loading = false
            }).catch(err => {
                this.loading = false
                this.$message.error(err)
            })
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
            this.$router.push({path:'/articleEdit', query:{isAdd: true}})
        },
        //编辑
        modifyRow(row) {
            // window.open("/articleEdit?isAdd=true")
            this.$router.push({ path: '/articleEdit', query:
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
                    this.$message.error(err)
                })

            }).catch(() => { });

        },
        viewRow(row) {
            window.open("articleView?id=" + row.id);
        },

    }
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
.nopadding {
    padding: 0 !important;
}
</style>

