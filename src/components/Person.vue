<template>
  <el-button type="primary" @click="handleAdd()">
    创建规则
  </el-button>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column label="规则名称" prop="RN" />
    <el-table-column label="规则条件" prop="C.GR" />
    <el-table-column label="分组" prop="C.GC" >
      <template #default="scope">
        {{  scope.row}}
      </template>
    </el-table-column>
    <el-table-column align="right">
      <!-- <template #header>
        <el-input v-model="search" size="small" placeholder="字段名称 to search" />
      </template> -->
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
          修改
        </el-button>
        <el-button
          size="small"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)"
        >
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog
    v-model="dialogVisible"
    title="表单逻辑定义"
    width="700"
    :before-close="handleClose"
  >
    <div>
      <el-form :model="form" label-width="auto" style="max-width: 700px">
        <el-form-item label="规则名称" prop="RN">
          <el-input v-model="form.RN" :rules="[
            {
              required: true,
              message: 'Please input email address',
              trigger: 'blur',
            },
            {
              type: 'RN',
              message: 'Please input correct email address',
              trigger: ['blur', 'change'],
            },
      ]"/>
        </el-form-item>

        <div>当满足以下条件时</div>
        <div  v-for="(i,index) in form.C.GC" :key="index">
          <div v-if="index==1">
            <el-select
              v-model="form.C.GR"
              style="padding: 0 0px 18px;width: 60px"
              class="item2"
            >
              <el-option
                v-for="item in fzs"
                :key="item.FV"
                :label="item.FN"
                :value="item.FV"
              >
            </el-option>
            </el-select>
          </div>
          <div class="box">
            <div class="" v-for="(j,jIndex) in i.C" :key="jIndex">
              <el-row >
                <el-col :span="3" class="cl" style="justify-content: space-around;">
                  <div style="padding: 0 12px 18px;" v-if="jIndex<=0">当</div>
                  <div >
                    <el-select
                      v-if="jIndex==1"
                      v-model="i.R"
                      style="padding: 0 0px 18px;width: 60px"
                      class="item2"
                    >
                      <el-option
                        v-for="item in fzs"
                        :key="item.FV"
                        :label="item.FN"
                        :value="item.FV"
                      >
                    </el-option>
                    </el-select>
                  </div>
                </el-col>
                <el-col :span="21">
                  <el-form-item label="" label-width="0px" prop="email">
                    <div class="cl">
                      <el-select
                        class="item"
                        v-model="j.F"
                        placeholder="比较的字段"
                        style="width: 240px"
                      >
                        <el-option
                          v-for="item in fields"
                          :key="item.FK"
                          :label="item.FN"
                          :value="item.FK"
                        />
                      </el-select>
                      <el-select
                        class="item"
                        v-model="j.O"
                        placeholder="比较操作符"
                        style="width: 240px"
                      >
                        <el-option
                          v-for="item in symbol"
                          :key="item.FV"
                          :label="item.FN"
                          :value="item.FV"
                        />
                      </el-select>
                      <!-- <el-input class="item" v-model="j.F" /> -->
                      <!-- <el-input class="item" v-model="j.O" /> -->
                      <el-input class="item" v-model="j.V" />
                      <div style="width: 30px;">
                        <el-icon color="#555" v-if="jIndex>0" style="cursor: pointer;" @click="deleteGC(j)">
                        <Delete />
                      </el-icon>
                      </div>
                    </div>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div class="addBtn">
              <el-button link type="primary" @click="addTj(index)">+ 添加条件</el-button>
              <el-button link type="primary" @click="addTjz(index)">+ 添加条件组</el-button>
            </div>
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save()">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { computed, ref, reactive} from 'vue'
import { ElMessageBox } from 'element-plus'
import { Delete} from '@element-plus/icons-vue'
const getForm=()=>(
  {
    ID:'',
    "RN": "",
    "C": //条件，支持and or 条件组
    {
        "GR": "", // 组之间 为or 逻辑
        "GC": [ //2个分组
            {
                "R": "AND", //
                "C": [
                {
                  ID:'',
                    "F": "", //假设检查结果对应字段编号为FK001
                    "O": "", //比较操作符=,>,>=,<,<=,<>,in,notin,BETWEEN
                    "VT": "", //值类型，0 自定义
                    "V": "" //比较的值，值域列表自行定义即可
                // },
                // {
                //     "F": "FK002",
                //     "O": "=",
                //     "VT": "1",
                //     "V": "张三"
                }]
            },
            // {
            //     "R": "AND", //只有一个条件也是用AND
            //     "C": [
            //     {
            //         "F": "FK002",
            //         "O": "=",
            //         "VT": "1",
            //         "V": "李四"
            //     }]
            // }
        ]
    }
  }
)
interface Fields {
  RN:string
  C:string
  ID:string
  FN: string
  FK: string
  VT: string
}
let fzs=reactive( [
{
    "FN": "或",
    "FV": "OR",
},
{
    "FN": "且",
    "FV": "AND",
}])
let fields=reactive( [
{
    "FN": "检查结果",
    "FK": "FK001",
    "VT": "1"
},
{
    "FN": "检查人",
    "FK": "FK002",
    "VT": "1"
},
{
    "FN": "检查时间",
    "FK": "FK003",
    "VT": "2"
},
{
    "FN": "问题数量",
    "FK": "FK004",
    "VT": "3"
},
{
    "FN": "设备异常",
    "FK": "FK005",
    "VT": "4"
}])
let symbol=reactive( [
{
    "FN": "=",
    "FV": "=",
},
{
    "FN": ">",
    "FV": ">",
},
{
    "FN": ">=",
    "FV": ">=",
},
{
    "FN": "<",
    "FV": "<",
},
{
    "FN": "<=",
    "FV": "<=",
},
{
    "FN": "<>",
    "FV": "<>",
},
{
    "FN": "in",
    "FV": "in",
},
{
    "FN": "notin",
    "FV": "notin",
},
{
    "FN": "BETWEEN",
    "FV": "BETWEEN",
},])
let viewType=ref(0)
let formData = reactive([] as any)
let form  = reactive(getForm())
let dialogVisible = ref(false)
const search = ref('')

let tableData=ref([])
// let tableData: Fields[] = []
const deleteGC = (jTem:any) => {
  console.log('deleteGC!',jTem)
  form.C.GC.map(e => {
    e.C=e.C.filter(k => k.ID!==jTem.ID)
  });
}
const addTj = (index:number) => {
  form.C.GC[index].C.push(
    {
      ID:new Date().getTime().toString(),
      "F": "",
      "O": "",
      "VT": "",
      "V": ""
    }
  );
}
const addTjz = (index:number) => {
  form.C.GR=form.C.GR?form.C.GR:'OR'
  form.C.GC.push(
    {
      "R": "AND", //只有一个条件也是用AND
      "C": [
        {
          ID:new Date().getTime().toString(),
            "F": "",
            "O": "",
            "VT": "",
            "V": ""
        }]
    }
  );
}
const filterTableData = computed(() =>
  tableData.value.filter(
    (data:any) =>
      !search.value ||
      data.FN.toLowerCase().includes(search.value.toLowerCase())
  )
)

const handleAdd = () => {
  form = reactive(getForm())
  handleDetail(1,{})
}
const handleDetail = (type:number,obj:any) => {
  form = reactive(getForm())
  viewType.value=type
  if(type===2){
    form = obj
  }
  dialogVisible.value = true
}
const save = () => {
  console.log('formData :>> ', formData);
  if(viewType.value===1){
    let date=new Date().getTime().toString();
    form.ID=date
    formData.push(form)
  }else if(viewType.value===2){
    let arr=sessionStorage.getItem('formData')? JSON.parse(sessionStorage.getItem('formData') || '') : null
    formData=arr.map((item:any)=>{
      if(item.ID==form.ID){
        item=form
      }
      return item
    })
  }
  console.log('formData :>> ', formData);
  sessionStorage.setItem('formData',JSON.stringify(formData))
  dialogVisible.value = false
  init()

}
const handleEdit = (index: number, row: Fields) => {
  console.log(index, row)
    dialogVisible.value = true
    handleDetail(2,row)
}
const handleDelete = (index: number, row: Fields) => {
  console.log(index, row)
  console.log('tableData.value :>> ', tableData.value);
  tableData.value.splice(index, 1)
  formData.splice(index, 1)
  // let arr=tableData.value.filter((k:any) => k.ID!==row.ID)
  // console.log('arr :>> ', arr);
  sessionStorage.setItem('formData',JSON.stringify(tableData))
  // init()
}

const init = () => {
  let arr=sessionStorage.getItem('formData')? JSON.parse(sessionStorage.getItem('formData') || '') : null
  
  tableData=ref(arr)
  console.log('tableData :>> ', tableData);
}
const handleClose = (done: () => void) => {
  ElMessageBox.confirm('Are you sure to close this dialog?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}
</script>
<style scoped>
.box{
  border:1px solid #ddd;
  padding:10px;
  border-radius: 5px;
  margin: 10px 0;
}
.cl{
  display: flex;
  align-items: center;
  justify-content: center;
}
.item{
  flex: 1;
  margin-right: 10px;
}
.addBtn{
  padding-left: 30px
}
::v-deep .el-select__wrapper,
::v-deep .el-input__wrapper,
::v-deep .el-select__wrapper.is-hovering:not(.is-focused){
  box-shadow:none;
}
.item ::v-deep .el-input__wrapper,.item ::v-deep .el-select__wrapper{
  
    background-color:#f2f3f5; 
  }
</style>