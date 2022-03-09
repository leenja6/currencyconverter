<template lang="pug">
.calculator__form-field 
  .calculator__form-title {{ title }}
  .calculator__form-select
    .calculator__form-input-box
      AppInputText(:ids='idInput', :placehold='placehold', v-model='valueItem') 
    .calculator__form-select-box
      span(@click.stop='toogle') {{ currency }}
      .scrollbar(@click.stop)
        vue-custom-scrollbar.calculator__select-currency.scroll-area(
          v-if='toog',
          :settings='settings'
        )
          div(
            v-for='item in currencyArray',
            :key='item',
            @click.stop='addCurrency(item)'
          ) {{ item }}
  .calculator__form-text Доступно: 0 {{ currency }}
</template>
<script>
import { ref, watch } from '@nuxtjs/composition-api'
import vueCustomScrollbar from 'vue-custom-scrollbar'
import AppInputText from '../commons/AppInputText.vue'
export default {
  name: 'CalculatorFormField',
  components: { vueCustomScrollbar, AppInputText },
  props: {
    idInput: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: null,
    },
    placehold: {
      type: String,
      default: null,
    },
    currencyArray: {
      type: Array,
      default: null,
    },
    currency: {
      type: String,
      default: null,
    },
  },
  setup(props, { emit }) {
    const toog = ref(false)
    const valueCurrency = ref()
    const valueItem = ref()
    const settings = {
      suppressScrollY: false,
      suppressScrollX: true,
      wheelPropagation: false,
    }
    function toogle() {
      toog.value = !toog.value
      closeModal()
    }

    function addCurrency(item) {
      emit('setFirstCurrency', item)
      toog.value = false
    }

    function closeModal() {
      document.body.addEventListener('click', () => {
        toog.value = false
      })
    }

    watch(valueItem, (val) => {
      emit('uptadeValue', val)
    })

    return {
      toog,
      toogle,
      addCurrency,
      valueCurrency,
      closeModal,
      settings,
      valueItem,
    }
  },
}
</script>