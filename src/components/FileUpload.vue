<template>
  <el-upload
        class="upload-demo"
        action="/api/file/upload"
        :before-upload="beforeAvatarUpload"
        :file-list="fileList1"
        list-type="picture-card"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :multiple ="multiple"
        :data="fileData1"
        :headers="{'Zeke_Up':'1'}"
        :on-success="handleAvatarSuccess">
        <i class="el-icon-plus"></i>
        <!-- <el-button style="margin:10px 0px 10px 10px;" size="small" icon="el-icon-plus" type="primary">选择文件</el-button> -->
    </el-upload>
</template>

<script>
export default {
    mounted() {
        //第一次进来需要加载
        this.fileData1 = this.fileData;
        if(this.fileData && this.mountedLoad){
            this.getFilesData(this.fileData.bizPk,this.fileData.bizType);
        }
    },
    data(){
        return {
            fileList1: [],
            fileData1: {},
            headers: {"Zeke_Up": 1}
        }
    },
    props: {
        fileData: Object,
        multiple: Boolean,
        autoUpdate: Boolean,
        mountedLoad: Boolean,//用在弹出框加载时
    },
    watch: {
        fileData: {
            deep: true,
            handler: function(value,oldVal) {
                //自动更新
                if(this.autoUpdate){
                    this.fileData1 = this.fileData;
                    this.fileList1=[];
                    this.getFilesData(value.bizPk,value.bizType);
                }else{
                    if(value && value!=oldVal){
                        if(value.bizPk === oldVal.bizPk && value.bizType === oldVal.bizType)
                            return;
                        this.fileData1 = this.fileData;
                        this.fileList1=[];
                        this.getFilesData(value.bizPk,value.bizType);
                    }
                }
            }
        }
    },
    methods:{
        //上传前校验
        beforeAvatarUpload(file){
            let fileName = file.name.toLowerCase();
            const isExcel = (fileName.indexOf(".png")!=-1 || fileName.indexOf(".jpeg")!=-1 || fileName.indexOf(".jpg")!=-1
             || fileName.indexOf(".doc")!=-1 || fileName.indexOf(".docx")!=-1 || fileName.indexOf(".xlsx")!=-1
              || fileName.indexOf(".pdf")!=-1);
            if (!isExcel) {
                this.$message.error('支持上传doc、docx、xlsx、pdf、png、jpeg、jpg等格式文件!');
            }
            // this.fileData1["metaData.fileName"] = file.name;
            return isExcel;

            //限定文件上传大小
            const isLt200M= file.size / 1024/ 1024< 200;
            if (!isLt200M) {
                this.$message.error('上传文件大小不能超过 200M!');
            }
            return isLt200M;
        },
        //删除选择文件1
        handleRemove(file, fileList) {
            this.$axios.delete(
                '/api/file/deleteFileList?id=' + file.id
            ).then(res => {
                this.getFilesData(file.bizPk,file.bizType);
            }).catch(error => {
                console.log('error:' + error.toString())
            })
        },
        //Excel上传成功,重新刷新数据
        handleAvatarSuccess(res, file){
            this.getFilesData(this.fileData.bizPk,this.fileData.bizType);
        },
        //点击图片
        handlePreview(file){
            window.open(window.location.origin + "/api/file/view?id=" + file.id);
        },
        //获取table数据
        getFilesData(bizPk,type) {
            this.fileList1 =[];
            //,this.$qs.stringify(params)
            this.$axios.get(
                "/api/file/getFileList?bizPk=" + bizPk+"&bizType="+type+"&page=1&row=100"
            ).then(res => {
                //判断是否有文件上传
                if(res.data.content && res.data.content.length>0){
                    res.data.content.map((item,index)=>{
                        item.name = item.originalName;
                        item.url = "/api/file/view?id="+item.id;
                        this.fileList1.push(item);
                    })
                }
            }).catch(error => {
                console.log('error:' + error.toString())
               })
        },
    }
}
</script>

<style>

</style>
