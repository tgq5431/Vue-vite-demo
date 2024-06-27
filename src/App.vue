<template>
  <div class="person">
    <Person ref="ren"/>
  </div>
</template>
<script lang="ts" setup name="App">
// JS或TS
import Person from './components/Person.vue'
import {ref} from 'vue'
let ren=ref()
function test(){
  console.log('ren.value.name :>> ', ren.value.name);
}
</script>
<style scoped></style>