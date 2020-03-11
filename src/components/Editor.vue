<template>
    <div>
        <!-- 图片上传组件辅助-->
        <el-upload class="avatar-uploader" :action="serverUrl" name="img" :headers="header" :show-file-list="false" :on-success="uploadSuccess" :on-error="uploadError" :before-upload="beforeUpload">
        </el-upload>
        <!--   -->
        <quill-editor class="editor" v-model="content" ref="myQuillEditor" :options="editorOption" @change="onEditorChange($event)" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"></quill-editor>
    </div>
</template>
<script>
import { quillEditor } from "vue-quill-editor"
import "quill/dist/quill.core.css"
import "quill/dist/quill.snow.css"
import "quill/dist/quill.bubble.css"

export default {
    name: 'Editor',
    props: {
        /*编辑器的内容*/
        value: {
            type: String
        },
        /*图片大小*/
        maxSize: {
            type: Number,
            default: 4000 //kb
        }
    },

    components: {
        quillEditor
    },

    data() {
        return {
            content: this.value,
            quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
            editorOption: {
                placeholder: "",
                theme: "snow", // or 'bubble'
                placeholder: "说点什么？",
                modules: {
                    toolbar: {
                        // 工具栏配置
                        container: [
                            ['bold', 'italic', 'underline', 'strike'],
                            ['blockquote', 'code-block'],
                            [{ 'header': 1 }, { 'header': 2 }],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                            [{ 'script': 'sub' }, { 'script': 'super' }],
                            [{ 'indent': '-1' }, { 'indent': '+1' }],
                            [{ 'direction': 'rtl' }],
                            [{ 'size': ['small', false, 'large', 'huge'] }],
                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                            [{ 'color': [] }, { 'background': [] }],
                            [{ 'font': [] }],
                            [{ 'align': [] }],
                            ['clean'],
                            ['link', 'image']
                        ],
                        // container: "#toolbar",
                        handlers: {
                            image: function(value) {
                                if (value) {
                                    // 触发input框选择图片文件
                                    document.querySelector(".avatar-uploader input").click();
                                } else {
                                    this.quill.format("image", false);
                                }
                            },
                            link: function(value) {
                              if (value) {
                                var href = prompt('请输入url');
                                this.quill.format("link", href);
                              } else {
                                this.quill.format("link", false);
                              }
                            },
                        }
                    }
                }
            },
            serverUrl: "/api/file/upload", // 这里写你要上传的图片服务器地址
            header: {
                "Zeke_Up": 1,
                // token: sessionStorage.token
            } // 有的图片服务器要求请求头需要有token
        };
    },

    methods: {
        onEditorBlur() {
            //失去焦点事件
            // this.$emit("input", this.content);
        },
        onEditorFocus() {
            //获得焦点事件

        },
        onEditorChange() {
            //内容改变事件
            this.$emit("input", this.content);
        },

        // 富文本图片上传前
        beforeUpload() {
            // 显示loading动画
            this.quillUpdateImg = true;
        },
        uploadSuccess(res, file) {
            // console.log(res);
            // console.log(file)
            // res为图片服务器返回的数据
            // 获取富文本组件实例
            let quill = this.$refs.myQuillEditor.quill;
            // 如果上传成功
            if (res.length>0) {
                // 获取光标所在位置
                let length = quill.getSelection().index;
                // 插入图片  res.url为服务器返回的图片地址
                quill.insertEmbed(length, "image", "/api/file/view?id="+res[0].id);
                // 调整光标到最后
                quill.setSelection(length + 1);
            } else {
                this.$message.error("图片插入失败");
            }
            // loading动画消失
            this.quillUpdateImg = false;
        },
        // 富文本图片上传失败
        uploadError() {
            // loading动画消失
            this.quillUpdateImg = false;
            this.$message.error("图片插入失败");
        }
    },
    watch: {
        value(newval){
            // console.log("newval",newval);
            this.content = newval;
        }
    }
};
</script>
<style lang="scss">
    .editor {
        .ql-container {
            height: 400px !important;
            border-color:#DCDFE6;
            border-bottom-left-radius: 4px;
            border-bottom-right-radius: 4px;
        }
        .ql-toolbar {
            border-color:#DCDFE6;
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
        }
    }
</style>
<style lang="scss" scoped>
.editor {
    line-height: normal !important;
    width: auto;
    margin: 0 auto;
}
.ql-toolbar {
    border-color:#DCDFE6;
}
.ql-container {
    height: 400px !important;
    border-color:#DCDFE6;
}
.ql-editor {
    height: 400px!important;
}


.ql-snow .ql-tooltip[data-mode=link]::before {
    content: "请输入链接地址:";
}

.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
    border-right: 0px;
    content: '保存';
    padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode=video]::before {
    content: "请输入视频地址:";
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
    content: '14px';
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=small]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=small]::before {
    content: '10px';
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=large]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=large]::before {
    content: '18px';
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value=huge]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value=huge]::before {
    content: '32px';
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
    content: '文本';
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
    content: '标题1';
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
    content: '标题2';
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
    content: '标题3';
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
    content: '标题4';
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
    content: '标题5';
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
    content: '标题6';
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
    content: '标准字体';
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=serif]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=serif]::before {
    content: '衬线字体';
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=monospace]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=monospace]::before {
    content: '等宽字体';
}
</style>
