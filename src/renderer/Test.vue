<template>
  <VAceEditor v-model:value="value" class="Editor" />
</template>

<script>
import { defineComponent, ref } from "vue"
import { VAceEditor } from 'vue3-ace-editor'
import { storeToRefs } from 'pinia'


import { useEditorStore } from '@/stores/editorStore.js'

export default defineComponent({
  components: {
    VAceEditor
  },
  setup(props) {
    const store = useEditorStore();
    const { value } = storeToRefs(store);

    return { value }
  }
})
</script>

<style scoped>
  .Editor {
    height: 100px;
  }
</style>