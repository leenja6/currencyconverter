<template lang="pug">
.calculator__box
  h3.calculator__title {{ title }}
  slot
</template>
<script>
export default {
  name: 'CalculatorBox',
  props: {
    title: {
      type: String,
      default: null,
    },
  },
  setup() {},
}
</script>