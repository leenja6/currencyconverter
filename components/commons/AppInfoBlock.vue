<template lang="pug">
.info__box(:class='status')
  p {{ title }}
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      default: '',
    },
  },
  setup() {},
}
</script>