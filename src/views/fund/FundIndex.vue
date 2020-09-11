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
                            <el-input placeholder="请输入标题" v-model="formSearch.name" class="input-with-select" size="small" clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="状态">
                            <el-select
                            size="small"
                             v-model="formSearch.status" placeholder="请选择">
                                <el-option value="" label="全部">全部</el-option>
                                <el-option
                                v-for="item in statusList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                    <el-button @click="handleSearch" icon="el-icon-search" size="small" type="primary" plain style="margin:10px 0px 10px 10px;">搜索</el-button>
                </el-header>
                <el-main class="nopadding">
                    <el-table :data="tableData" border stripe style="width: 100%;" size="small" height="100%" :header-cell-style="{background:'#ECF5FF',color:'#606266'}" fit v-loading="loading"
                        highlight-current-row>
                        <el-table-column prop="name" label="名称" width="300" header-align="center">
                            <!-- <template slot-scope="scope">
                                <a class="activeLink" @click="modifyRow(scope.row)">{{scope.row.name}}</a>
                            </template> -->
                        </el-table-column>
                        <el-table-column prop="industryName" label="行业" align="center">
                        </el-table-column>
                        <el-table-column prop="statusName" label="状态" align="center">
                        </el-table-column>
                        <el-table-column prop="manager" label="经理" align="center"></el-table-column>
                        <el-table-column prop="remark" label="备注" align="center">
                        </el-table-column>
                        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                        <el-table-column v-if="this.$store.state.user.prop=='1'" label="操作" align="center" width="150">
                            <template slot-scope="scope">
                                <el-tooltip content="编辑" placement="top">
                                    <el-button size="mini" type="primary" icon="el-icon-edit" @click="modifyRow(scope.row)" circle plain></el-button>
                                </el-tooltip>
                                <el-tooltip content="明细" placement="top">
                                    <el-button size="mini" type="primary" icon="el-icon-document" @click="details(scope.row)" circle plain></el-button>
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
        <!-- 明细 -->
        <el-dialog class="full_height" title="基金明细" :visible.sync="visibleModel" width="60%">
            <div>
                <el-button @click="addSubData()" icon="el-icon-plus" size="small" type="primary" plain style="margin:10px 0px 10px 0px;">新增</el-button>
                <!-- <el-button @click="deleteSub()" icon="el-icon-delete" size="small" type="primary" plain style="margin:10px 0px 10px 10px;">删除</el-button> -->
            </div>
            <vxe-table
            :keep-source="true"
            :data="subTableData" border size="mini"
            :header-cell-style="{background:'#ECF5FF',color:'#606266',fontWeight:'bold'}"
            style="width: 100%;" highlight-current-row
            ref="xTable"
            height="300"
            :scroll-y="{gt:-1}"
            :auto-resize="true"
            :edit-config="{trigger: 'click', mode: 'cell'}">
                <vxe-table-column type="checkbox" width="60"></vxe-table-column>
                <vxe-table-column type="seq" title="序号" width="50"></vxe-table-column>
                <template v-for="item in tableCol">
                    <vxe-table-column :key="item.label"
                    :show-overflow="item.show_overflow"
                    :field="item.prop" :title="item.label" :min-width="item.width"
                    show-overflow-tooltip :align="item.align"
                    :header-align="item.headerAlign" :fixed="item.fixed"
                    :edit-render="item.edit_render">
                        <template v-if="item.children">
                            <vxe-table-column 
                            v-for="(child, id) in item.children" :key="id" :field="child.prop"
                            :show-overflow="child.show_overflow"
                            :title="child.label" :align="item.align" :min-width="child.width"
                            :header-align="child.headerAlign" show-overflow-tooltip
                            :edit-render="child.edit_render">
                            </vxe-table-column>
                        </template>
                    </vxe-table-column>
                </template>
                <vxe-table-column title="操作" width="100" align="center">
                    <template slot-scope="scope">
                        <el-tooltip content="删除" placement="top">
                            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteSub(scope.row)" circle plain></el-button>
                        </el-tooltip>
                    </template>
                </vxe-table-column>
            </vxe-table>
            <el-pagination @size-change="handleSizeChange2" @current-change="handleCurrentChange2" :current-page="subPage" :page-sizes="[10, 20, 30, 50]" :page-size="subRows"
                layout="total, sizes, prev, pager, next, jumper" :total="subTotal">
            </el-pagination>
            <div slot="footer" class="dialog-footer">
                <el-button :loading="btn_loading" type="primary" @click="saveSub()">保 存</el-button>
                <el-button @click="visibleModel = false">关 闭</el-button>
            </div>
        </el-dialog>
    </el-container>
</template>

<script>
import getEnumList from './../../assets/js/common.js'
import tableCol from './index'

export default {
    name: 'FundIndex',
    data() {
        return {
            tableCol: tableCol,
            tableData: [],
            loading: false,
            formSearch: {
                name: '',
                status: ''
            },
            page: 1,
            rows: 15,
            total: 0,
            statusList:[],
            industryList: [],
            visibleModel: false,
            btn_loading: false,
            subTableData: [],
            subPage: 1,
            subRows: 15,
            subTotal: 0,
            currentData: {},
        }
    },
    async created() {
        this.industryList = await getEnumList("fund_industry");
        this.statusList = await getEnumList("fund_status");
        this.getTableData();
    },
    methods: {
        getTableData() {
            this.loading = true
            this.$axios.get(
                "/api/fund/list?name="+this.formSearch.name +"&status="+ this.formSearch.status +"&page="+ this.page + "&row="+ this.rows
            ).then(res => {
                if(res.data.content){
                    res.data.content.map((item)=>{
                        let industryName='';
                        if(item.industry && item.industry.length>0){
                            item.industry.map((item1)=>{
                                this.industryList.some((val)=>{
                                    if(item1.enumId==val.id){
                                        industryName+='['+val.name+']';
                                        return true;
                                    }
                                })
                            })
                        }
                        item.industryName=industryName;
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
        handleSearch() {
            this.getTableData()
        },
        handleSizeChange(val) {
            this.rows = val
            this.page = 1
            this.getTableData()
        },
        handleCurrentChange(val) {
            this.page = val
            this.getTableData()
        },
        handleAdd() {
            // window.open("/fundEdit?isAdd=true")
            this.$router.push({path:'./fundEdit', query:{isAdd: true}})
        },
        //编辑
        modifyRow(row) {
            // window.open("/fundEdit?isAdd=true")
            this.$router.push({ path: './fundEdit', query:
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
                    "/api/fund/"+row.id
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
            this.$router.push({ path: './fundView', query:
                {
                    id: row.id,
                }
            })
            // window.open("../fundView?id=" + row.id);
        },
        details(row){
            console.log(row);
            this.currentData=row;
            // return;
            this.getDetails();
        },
        //基金记录
        getDetails(){
            this.$axios.get(
                "/api/fund/getDetails/"+this.currentData.id+"?page="+this.subPage+"&row="+this.subRows
            ).then(res => {
                if(res.data.content){
                    // res.data.content.map((item)=>{

                    // })
                }
                this.subTableData = res.data.content;
                this.subTotal=res.data.totalElements
                this.visibleModel=true;
            }).catch(err => {
                console.log(err);
            })
        },
        handleSizeChange2(val) {
            this.subRows = val
            this.subPage = 1
            this.getDetails()
        },
        handleCurrentChange2(val) {
            this.subPage = val
            this.getDetails()
        },
        //新增详细数据
        async addSubData(row){
            let record = {
                mainId: this.currentData.id,
                fillDate: new Date(),
            }
            let { row: newRow } = await this.$refs.xTable.insertAt(record, row);
            await this.$refs.xTable.setActiveCell(newRow,'fillDate');
        },
        saveSub(){
            const { insertRecords, removeRecords, updateRecords } = this.$refs.xTable.getRecordset();
            // console.log(insertRecords, removeRecords, updateRecords);
            if((insertRecords && insertRecords.length>0) || (removeRecords && removeRecords.length>0) 
            || (updateRecords && updateRecords.length>0)){
                
                }else{
                    this.$message.warning("没有修改任何记录!");
                return;
            }
            this.btn_loading=true;
            this.$axios.post("/api/fund/saveDetails",
                this.$qs.stringify({
                    insertList: JSON.stringify(insertRecords),
                    deleteList: JSON.stringify(removeRecords),
                    updateList: JSON.stringify(updateRecords),
                })
            ).then(res => {
                if (res.data) {
                    this.$message({ type: 'success', message: '保存成功' });
                    this.getDetails();
                } else {
                    this.$message.error(res.data)
                }
                this.btn_loading=false;
            }).catch(err => {
                this.btn_loading=false;
                console.log(err);
            })
        },
        deleteSub(data){
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                cancelButtonClass: "btn-custom-cancel",
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.delCommit(data)
            }).catch(() => {});
        },
        //删除数据
        delCommit(data) {
            this.$axios({
                method: 'delete',
                url: '/api/fund/delDetail/'+ data.id,
            }).then(res => {
                if (res.data) {
                    this.getDetails();
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                } else {
                    this.$message({
                        message: res.data,
                        showClose: true,
                        type: 'error'
                    })
                }
            }).catch(error => {
                console.log('error:' + error.toString())
            })
        },
    },
    watch:{
        $route(newVal, oldVal){
            //从详情页跳转到列表页，刷新数据
            // console.log("route",newVal,oldVal);
            if(oldVal.path==="/fundEdit"){
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
<style lang="less" scoped>
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

