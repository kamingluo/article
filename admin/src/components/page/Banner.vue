<template>
  <div class="table">
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item
          ><i class="el-icon-lx-cascades"></i> 文章列表</el-breadcrumb-item
        >
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-input
          v-model="select_word"
          placeholder="筛选关键词"
          class="handle-input mr10"
        ></el-input>
        <el-button type="primary" class="search" @click="search">搜索</el-button>
        <el-button type="primary" class="search" @click="reset">重置</el-button>
        <el-button type="primary" class="handle-del mr10" @click="add"
          >新增轮播图</el-button
        >
      </div>

      <el-table :data="tableData" border class="table" ref="multipleTable">
        <el-table-column prop="id" label="id" width="80"> </el-table-column>
        <el-table-column prop="title" label="标题" width="150">
        </el-table-column>
        <el-table-column label="图片" width="180">
          <template slot-scope="scope">
            <img :src="scope.row.image" alt="" class="img">
          </template>
        </el-table-column>
        <el-table-column prop="jumpurl" label="跳转路径" width="180">
        </el-table-column>
        <el-table-column prop="seenum" label="查看次数" width="50">
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="160">
        </el-table-column>
        <el-table-column prop="update_time" label="更新时间" width="160">
        </el-table-column>
        <el-table-column prop="switch" label="开关" width="100">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.switch"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              @change="onSwitchChange(scope.row)"  
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="类型" width="180">
          <template slot-scope="scope">
            <span>{{getType(scope.row.type)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              @click="handleEdit(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="text"
              icon="el-icon-delete"
              class="red"
              @click="handleDelete(scope.row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        :total="datapages"
      >
      </el-pagination>
    </div>



    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="delVisible" width="300px" center>
      <div class="del-dialog-cnt">删除不可恢复，是否确定删除？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteRow">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "basetable",
  data() {
    return {
      url: "",
      tableData: [],
      cur_page: 1,
      editVisible: false,
      delVisible: false,
      form: {},
      idx: -1,
      deleteid: "",
      select_word: "",
      datapages: 0,
      jumptypeList:[]
    };
  },
  created() {
    this.getData();
    this.getJumpType();
  },
  computed: {
    data() {
      return this.tableData.filter((d) => {
        let is_del = false;
        for (let i = 0; i < this.del_list.length; i++) {
          if (d.name === this.del_list[i].name) {
            is_del = true;
            break;
          }
        }
      });
    },
  },
  methods: {
    getType(type){
      return this.jumptypeList.find(item=>item.type===type).name
    },
    //当开关改变
    async onSwitchChange(arg){
      let url = "/admin.php/configure/banner/modifystate";
      let params = {
        id: arg.id,
        switch: arg.switch
      }
      try{
        const res = await this.$axios.get(url,{params:params})
        if(res.status == '200'){
          this.$message({
            message: '轮播图状态修改成功',
            type: 'success'
          });
        }else{
          this.$message({
            message: res.message,
            type: 'error'
          });
          arg.switch?arg.switch=0:arg.switch=1
          console.log(res.message)
        }
      }catch(error){
        console.log(error)
      }
    },
    //筛选
    search() {
      console.log("点击筛选");
      let select_word = this.select_word; //关键词
      console.log("打印关键词", select_word);
      if (select_word == null || select_word == "") {
        console.log("11111111");
        this.$message.error(`关键词不能为空！！！`);
        return;
      }
      this.cur_page = 1;
      this.getData()
    },
    //重置
    reset(){
      this.cur_page = 1;
      this.select_word = "";
      this.getData();
    },

    async getJumpType(){
      let url = "/admin.php/configure/currency/jumptype";
      try{
        const res = await this.$axios.get(url)
        if(res.status == '200'){
          this.jumptypeList = res.data.data
        }else{
          this.$message({
            message: res.message,
            type: 'error'
          });
          console.log(res.message)
        }
      }catch(error){
        console.log(error)
      }
    },





    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },

    //获取数据
    getData() {
      this.url = "/admin.php/configure/banner/lists";
      const params = {
        pages: this.cur_page,
        search: this.select_word
      }
      this.$axios.post(this.url,params).then((res) => {
        console.log("基础表格请求返回数据", res.data.data);
        this.tableData = res.data.data;
        this.datapages = res.data.count || 0;
      });
    },
    add() {
      this.$router.push({
        path:"/bannerEdit"
      })
    },
    handleEdit(id) {
      this.$router.push({
        path:"/bannerEdit?id="+id
      })
    },
    async handleDelete(id) {
      this.deleteid = id;
      this.delVisible = true;
    },
    // 确定删除
    async deleteRow(id) {
      let url = "/admin.php/configure/banner/delete";
      let params = {
        id: this.deleteid,
      }
      try{
        const res = await this.$axios.get(url,{params:params})
        if(res.status == '200'){
          this.$message({
            message: '轮播图删除成功',
            type: 'success'
          });
          let index = this.tableData.findIndex(item=>item.id === this.deleteid)
          console.log(index)
          this.tableData.splice(index,1)
        }else{
          this.$message({
            message: res.message,
            type: 'error'
          });
          console.log(res.message)
        }
        this.delVisible = false;

      }catch(error){
        console.log(error)
        this.delVisible = false;

      }
    },
  },
};
</script>

<style scoped>
.search {
  margin-left: 10px;
}
.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
  display: inline-block;
}
.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
.img{
  width:200px;
}
</style>
