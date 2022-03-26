<template>
  <VAceEditor v-model:value="editorValue" class="Editor" />
</template>

<script>
import { defineComponent, ref } from "vue"
import { VAceEditor } from 'vue3-ace-editor'

export default defineComponent({
  components: {
    VAceEditor
  },
  setup(props) {
    const editorValue = ref('');
      return { editorValue }
  }
})
</script>

<style scoped>
  .Editor {
    height: 100px;
  }
</style>