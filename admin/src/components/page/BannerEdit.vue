<template>
  <div class="formEdit">
    <img src="wxarticles.tao618.cn/rule_foot3.png" alt="">
    <el-form :model="formData" :rules="rules" ref="formData" label-width="100px" class="demo-formData">
      <el-form-item label="图片" prop="name">
        <el-upload
          class="upload-demo"
          action="http://up-z2.qiniup.com"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :before-upload="beforeAvatarUpload"
          :on-success="handleAvatarSuccess"
          :data="uploadForm"
          list-type="picture"
          :file-list="fileList">
            <i slot="default" class="el-icon-plus" style="font-size:50px;color:#409EFF;"></i>
            <div slot="file" slot-scope="{file}">
              <img
                class="el-upload-list__item-thumbnail"
                :src="file.raw" alt=""
              >
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-preview"
                  @click="handlePictureCardPreview(file)"
                >
                  <i class="el-icon-zoom-in"></i>
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleDownload(file)"
                >
                  <i class="el-icon-download"></i>
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="跳转链接" prop="jumpurl">
        <el-input v-model="formData.jumpurl" placeholder="请输入跳转链接"></el-input>
      </el-form-item>
      <el-form-item label="观看次数" prop="seenum">
        <el-input v-model="formData.seenum" placeholder="请输入观看次数"></el-input>
      </el-form-item>
      <el-form-item label="开关" prop="switch">
        <el-switch
          v-model="formData.switch"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value="1"
          :inactive-value="0"
        >
        </el-switch>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="formData.type" placeholder="请选择">
          <el-option
            v-for="item in jumptypeList"
            :key="item.type"
            :label="item.name"
            :value="item.type">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">确定</el-button>
        <el-button @click="$router.replace('article')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "basetable",
  data() {
    return {
      editId:'',
      formData:{
        switch: 1
      },
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ],
        jumpurl: [
          { required: true, message: '请输入跳转链接', trigger: 'blur' },
          { min: 1, max: 250, message: '长度在 1 到 250 个字符', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ]
      },
      fileList: [

      ],
      uploadForm:{
        token:'',
        key:""
      },
      jumptypeList:[]
    };
  },

  created(){
    this.getJumpType();
    this.getQiNiuToken();
  },
 
  activated(){
    this.init()
  },
  deactivated(){
 
  },

  methods: {
    init(){
      console.log('init')
      this.editId = this.$route.query.id || '';
      this.getQiNiuToken();
      if(this.editId){
        this.formData.id = this.editId
        this.getDetail();
      }else{
        this.clearFormData()
      }
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
    async getDetail(){
      let url = "/admin.php/configure/banner/details";
      let params = {
        id: this.editId
      }
      try{
        const res = await this.$axios.get(url,{params:params})
        if(res.status == '200'){
          this.formData = res.data.data
          if(res.data.data.image){
            const fileList = []
            fileList.push({ url:res.data.data.image })
            this.fileList = fileList
          }
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
    async save(){
      let url = "/admin.php/configure/banner/add";
      let params = this.formData
      if(this.fileList.length>0)params.image = this.fileList[0].url
      try{
        const res = await this.$axios.post(url,params)
        if(res.status == '200'){
           this.$message({
            message: "保存成功",
            type: 'success',
            onClose:()=>{
              this.$router.push("banner");
            }
          });
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
    submitForm(){
      this.$refs.formData.validate((valid) => {
        if (valid) {
          this.save()
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    clearFormData(){
      this.formData = {
        switch:1
      }
      this.fileList = []
    },
 


    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    beforeAvatarUpload(file) {
      this.uploadForm.key = file.name
    },
    handleAvatarSuccess(res, file) {
      let obj = {}
      obj.name = file.name
      obj.url = `http://wxarticles.tao618.cn/${file.name}`
      const arr = []
      arr.push(obj)
      this.fileList = arr
    },
    async getQiNiuToken(){
      let url = "/admin.php/configure/currency/qiniu";
      const res = await this.$axios.get(url)
      try{
        if(res.status == '200'){
          this.uploadForm.token = res.data.uptoken
        }else{
          console.log(res.message)
        }
      }catch(error){
        console.log(error)
      }
    },
  }
};
</script>

<style scoped>
.formEdit{
  background: #fff;
  padding: 20px;
}
</style>
