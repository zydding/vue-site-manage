<template>
    <el-container class="news-container" ref="newsPublic">
        <el-aside style="padding-right: 15px; border-right: 1px solid #ddd;">
            <el-tree ref="tree1" lazy node-key="id" :load="getTreeChildNode" @node-expand="nodeExpand" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </el-aside>
        <el-main class="nopadding">
            <el-container style="height: 100%;">
                <el-header class="nopadding">
                    <el-button v-if="this.$store.state.user.prop=='1'" @click="handleAdd" icon="el-icon-plus" size="small" type="primary" plain style="margin:10px 0px 10px 0px;">添加</el-button>
                    <!-- <el-input v-model="title" placeholder="请输入标题" size="small"></el-input> -->
                    <!-- <el-button @click="handleSearch" type="primary" size="small" icon="el-icon-search" plain>查询</el-button> -->
                    <el-input placeholder="请输入标题" v-model="title" class="input-with-select" size="small" style="width: 250px; float: right; margin-top: 9px" clearable>
                        <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
                    </el-input>
                </el-header>
                <el-main class="nopadding">
                    <el-table :data="tableData" border stripe style="width: 100%;" size="small" height="100%" :header-cell-style="{background:'#ECF5FF',color:'#606266'}" fit v-loading="loading"
                        highlight-current-row>
                        <el-table-column prop="name" label="name" width="300" header-align="center" fixed>
                            <!-- <template slot-scope="scope">
                                <a class="activeLink" @click="modifyRow(scope.row)">{{scope.row.title}}</a>
                            </template> -->
                        </el-table-column>
                        <el-table-column prop="value" label="值" align="center"></el-table-column>
                        <el-table-column prop="remake" label="备注" align="center"></el-table-column>
                        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                        <el-table-column v-if="this.$store.state.user.prop=='1'" label="操作" align="center" width="150">
                            <template slot-scope="scope">
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
    name: 'EnumIndex',
    data() {
        return {
            treeData:[],
            tableData: [],
            loading: false,
            title: "",
            page: 1,
            rows: 15,
            total: 0,
            defaultProps:{
                children: 'children',
                label: 'name',
                isLeaf: 'leaf',
            },
        }
    },
    created() {
        // this.getTreeData(0);
        // this.getTableData();
    },
    methods: {
        nodeExpand(data,node,tag){
            // if(data.id){
            //     this.getTreeData(data.id);
            // }
            // console.log(data,node,tag);
        },
        handleNodeClick(){
            this.getTableData();
        },
       
        getTreeChildNode(node, resolve){
            // console.log("getTreeChildNode",node);
            if (node.level === 0) {
                //初始parendId
                return resolve([{ name: '枚举',id:-1 }]);
            }
            if (node.level > 1) return resolve([]);
            if(node.data){
                // console.log("请求",node);
                this.$axios.get(
                    "/api/enum/treeList?parentId="+node.data.id
                ).then(res => {
                    res.data.map((val,index)=>{
                        val.leaf=val.count==0?true:false;
                    });
                    // console.log("jiguo",res.data);
                    resolve(res.data);
                }).catch(err => {
                    console.log(err);
                })
            }
        },
        getTableData() {
            this.loading = true;
            let node = this.$refs.tree1.getCurrentNode();
            this.$axios.get(
                "/api/enum/list?name="+this.title+"&page="+ this.page + "&row="+ this.rows+"&parentId="+node.id
            ).then(res => {
                this.tableData = res.data.content;
                this.total = res.data.totalElements;
                this.loading = false
            }).catch(err => {
                this.loading = false
                console.log(err);
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
            // window.open("/enumEdit?isAdd=true")
            let node = this.$refs.tree1.getCurrentNode();
            if(node && node.id){
                this.$router.push({path:'./enumEdit', query:{isAdd: true,parentId:node.id}})
            }else{
                this.$message.error("请选择节点后添加！");
            }
        },
        //编辑
        modifyRow(row) {
            this.$router.push({ path: './enumEdit', query:
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
                    "/api/enum/"+row.id
                ).then(res => {
                    if (res.data) {
                        this.$message({ type: 'success', message: '删除成功!' });
                        this.getTableData();
                        let node = this.$refs.tree1.getCurrentNode();
                        if(node && !node.leaf){
                            this.$axios.get(
                                "/api/enum/treeList?parentId="+node.id
                            ).then(res => {
                                res.data.map((val,index)=>{
                                    val.leaf=val.count==0?true:false;
                                });
                                this.$refs.tree1.updateKeyChildren(""+node.id,res.data);
                            }).catch(err => {
                                console.log(err);
                            })
                        }
                    } else {
                        this.$message.error("删除失败！");
                    }
                }).catch(err => {
                    console.log(err);
                })

            }).catch(() => { });

        },
    },
    watch:{
        $route(newVal, oldVal){
            //从详情页跳转到列表页，刷新数据
            // console.log("route",newVal,oldVal);
            if(oldVal.path==="/enumEdit"){
                let node = this.$refs.tree1.getCurrentNode();
                // console.log("node",node);
                //有子节点才刷新
                if(node && !node.leaf){
                    this.$axios.get(
                        "/api/enum/treeList?parentId="+node.id
                    ).then(res => {
                        res.data.map((val,index)=>{
                            val.leaf=val.count==0?true:false;
                        });
                        // console.log("node11",node);
                        this.$refs.tree1.updateKeyChildren(""+node.id,res.data);
                    }).catch(err => {
                        console.log(err);
                    })
                }
                this.getTableData();
            }
		},
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
.nopadding {
    padding: 0 !important;
}
</style>

