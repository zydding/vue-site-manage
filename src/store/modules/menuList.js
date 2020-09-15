/**
 * Created by vxg on 2019/04/16.
 */
const state = {
  list:[],
}

//同步操作
const mutations = {
  //添加
  addItem(state,item){
    //不能重复添加
    let flag = false;
    state.list.some((val)=>{
      if(val.path==item.path){
        flag = true;
        return true;//结束
      }
    })
    if(!flag){
      state.list.push(item);
    }
  },
  //删除
  delItem(state,item){
    let target = -1;
    state.list.some((val,index)=>{
      if(val.path==item.path){
        target = index;
        return true;//结束
      }
    })
    if(target!=-1){
      state.list.splice(target,1);
    }
  }
}

//异步操作
const actions = {

}

//state的一些派生状态，也可以理解为一种计算属性
const getters = {

}

export default {
  namespaced: true,
  getters,
  state,
  mutations,
  actions
}
