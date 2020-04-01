import axios from 'axios'

function getEnumList(code) {
    return new Promise((resolve, reject) => {
        axios
        .get("/api/enumClassify/list?typeName="+code)
        .then(response => {
            if(response.data && response.data.length>0){
                resolve(response.data);
            }else{
                resolve([]);
            }
        })
        .catch(error => {
            reject(error)
            // this.$message.error("数据获取失败");
            console.log("error:" + error.toString());
        });
    })
}

export default getEnumList