<template lang="pug">
input.calculator__form-input(
  :id='ids',
  :placeholder='placehold',
  @keypress='isNumber($event)',
  :value='value',
  @input='onInput'
)
</template>
<script>
export default {
  props: {
    ids: {
      type: String,
      default: null,
    },
    placehold: {
      type: String,
      default: null,
    },
    value: {
      type: String,
      default: null,
    },
  },
  setup(_, { emit }) {
    function onInput(event) {
      emit('input', event.target.value)
    }
    function isNumber(evt) {
      evt = evt || window.event
      const charCode = evt.which ? evt.which : evt.keyCode
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault()
      } else {
        return true
      }
    }
    return { onInput, isNumber }
  },
}
</script>