import axios from 'axios'

function getEnumList(value) {
    return new Promise((resolve, reject) => {
        axios
        .get("/api/enum/findListByValue?value="+value)
        .then(response => {
            if(response.data.data && response.data.data.length>0){
                resolve(response.data.data);
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