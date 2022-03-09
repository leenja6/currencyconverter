<template lang="pug">
.crypto-exchange 
  .crypto-exchange__title
    img(src='../static/img/revers.svg')
    span Обмен криптовалюты
  AppInfoBlock(
    :title='titleInfoBox.title',
    :status='titleInfoBox.status',
    v-if='titleInfoBox.if'
  ) 
  .calculator
    AppCalculatorBox(:title='`Обменять ${firstCurrency} на ${lastCurrency}`')
      .calculator__form-group
        AppCalculatorFormField(
          title='Вы платите',
          placehold='Сумма платежа',
          idInput='input1',
          :currencyArray='currency',
          :currency='firstCurrency',
          @setFirstCurrency='getFirstCurrency($event)',
          @uptadeValue='uptadeOneCurrency($event)'
        ) 
        AppCalculatorFormField(
          title='Вы получаете',
          idInput='input2',
          placehold='Сумма получения',
          :currencyArray='currency',
          :currency='lastCurrency',
          @setFirstCurrency='getLastCurrency($event)',
          @uptadeValue='uptadeTwoCurrency($event)'
        ) 

    AppCalculatorBox(title='Краткое описание')
      ul.list-between
        li 
          span.list-between-first Ваш {{ firstCurrency }} баланс
          span.list-between-last 0 {{ firstCurrency }}
        li 
          span.list-between-first Ваш {{ lastCurrency }} баланс
          span.list-between-last 0 {{ lastCurrency }}
        li 
          span.list-between-first Курс
          span.list-between-last 
            | {{ listCurrency.length == 0 ? "" : `1 ${listCurrency[0].base_currency}` }}
            | {{ listExchangeRate.length == 0 ? "" : `= ${listExchangeRate[0].rate}` }}
            | {{ listCurrency.length == 0 ? "" : listCurrency[0].quote_currency }}
        li 
          span.list-between-first Следующее обновление
          span.list-between-last через {{ currentTime }} секунд
        .list-btn
        button.btn.btn_blue(@click='onSubmit') Обменять
</template>
<script>
import {
  computed,
  ref,
  onMounted,
  useStore,
  watch,
} from '@nuxtjs/composition-api'
import AppCalculatorBox from '../components/commons/AppCalculatorBox.vue'
import AppCalculatorFormField from '../components/commons/AppCalculatorFormField.vue'
import AppInfoBlock from '../components/commons/AppInfoBlock.vue'
export default {
  name: 'ExchangePage',
  components: { AppCalculatorBox, AppCalculatorFormField, AppInfoBlock },
  layout: 'dashboard',
  setup() {
    const store = useStore()
    const timer = ref()
    const currentTime = ref(10)
    const oneCurrency = ref()
    const twoCurrency = ref()
    const currency = computed(() => store.getters['exchange/getCurrency'])
    const titleInfoBox = ref({
      title: null,
      status: null,
      if: false,
    })
    const firstCurrency = ref(currency.value[0])
    const lastCurrency = ref(currency.value[1])

    onMounted(() => {
      sttarTimer()
      store.dispatch('exchange/fetchCurrencyPairs')
      store.dispatch('exchange/fetchExchangeRatePairs')
      store.dispatch('exchange/fetchCurrencyPairsItem', {
        firstCurrency: firstCurrency.value,
        lastCurrency: lastCurrency.value,
      })
      store.dispatch('exchange/fetchExchangeRatePairsItem', {
        firstCurrency: firstCurrency.value,
        lastCurrency: lastCurrency.value,
      })
    })

    const listCurrency = computed(
      () => store.getters['exchange/getListCurrency']
    )
    const listExchangeRate = computed(
      () => store.getters['exchange/getListExchangeRate']
    )

    function sttarTimer() {
      timer.value = setInterval(() => {
        currentTime.value--
      }, 1000)
    }

    function stopTimer() {
      clearTimeout(timer.value)
    }

    watch(currentTime, (value) => {
      if (value === 0) {
        currentTime.value = 10
        store.dispatch('exchange/fetchCurrencyPairs')
        store.dispatch('exchange/fetchExchangeRatePairs')
        store.dispatch('exchange/fetchCurrencyPairsItem', {
          firstCurrency: firstCurrency.value,
          lastCurrency: lastCurrency.value,
        })
        store.dispatch('exchange/fetchExchangeRatePairsItem', {
          firstCurrency: firstCurrency.value,
          lastCurrency: lastCurrency.value,
        })
      }
    })

    watch([oneCurrency], (value) => {
      if (value[0] === '') {
        document.getElementById('input2').value = ''
      } else {
        const count =
          Number(value[0]) * listExchangeRate.value[0].rate -
          Number(value[0]) * listExchangeRate.value[0].rate * 0.05
        if (isNaN(count)) {
          document.getElementById('input2').value = ''
        } else {
          document.getElementById('input2').value = (
            Math.trunc(count * 100) / 100
          ).toString()
        }
      }
    })

    watch([twoCurrency], (value) => {
      if (value[0] === '') {
        document.getElementById('input1').value = ''
      } else {
        const count =
          Number(value[0]) / listExchangeRate.value[0].rate -
          (Number(value[0]) / listExchangeRate.value[0].rate) * 0.05
        if (isNaN(count)) {
          document.getElementById('input1').value = ''
        } else {
          document.getElementById('input1').value = (
            Math.trunc(count * 100) / 100
          ).toString()
        }
      }
    })

    watch(listExchangeRate, (value) => {
      const inputOne = document.getElementById('input1').value
      const inputtwo = document.getElementById('input1').value
      if (inputOne === '' || inputtwo === '') {
        document.getElementById('input2').value = ''
      } else {
        const countTwo = Number(inputOne) * value[0].rate
        if (isNaN(countTwo)) {
          twoCurrency.value = null
        } else {
          document.getElementById('input2').value = (
            Math.trunc(countTwo * 100) / 100
          ).toString()
        }
      }
    })

    function getFirstCurrency(event) {
      firstCurrency.value = event
      store.dispatch('exchange/fetchCurrencyPairsItem', {
        firstCurrency: event,
        lastCurrency: lastCurrency.value,
      })
      store.dispatch('exchange/fetchExchangeRatePairsItem', {
        firstCurrency: event,
        lastCurrency: lastCurrency.value,
      })
    }

    function getLastCurrency(event) {
      lastCurrency.value = event
      store.dispatch('exchange/fetchCurrencyPairsItem', {
        firstCurrency: firstCurrency.value,
        lastCurrency: event,
      })
      store.dispatch('exchange/fetchExchangeRatePairsItem', {
        firstCurrency: firstCurrency.value,
        lastCurrency: event,
      })
    }

    function uptadeOneCurrency(event) {
      oneCurrency.value = event
    }

    function uptadeTwoCurrency(event) {
      twoCurrency.value = event
    }

    watch(firstCurrency, (value) => {
      const index = currency.value.findIndex((c) => c === value)
      const length = currency.value.length - 1
      if (value === lastCurrency.value) {
        if (length === index) {
          getLastCurrency(currency.value[0])
        } else {
          getLastCurrency(currency.value[index + 1])
        }
      }
    })

    watch(lastCurrency, (value) => {
      const index = currency.value.findIndex((c) => c === value)
      const length = currency.value.length - 1
      if (value === firstCurrency.value) {
        if (length === index) {
          getFirstCurrency(currency.value[0])
        } else {
          getFirstCurrency((firstCurrency.value = currency.value[index + 1]))
        }
      }
    })

    function onSubmit() {
      const inputOne = document.getElementById('input1').value
      const inputTwo = document.getElementById('input2').value
      if (
        inputOne === '' ||
        inputTwo === '' ||
        inputOne === '0' ||
        inputTwo === '0'
      ) {
        titleInfoBox.value = {
          title: 'Некорректные данные',
          status: 'red',
          if: true,
        }
      } else {
        titleInfoBox.value = {
          title: 'Обмен выполнен успешно!',
          status: 'green',
          if: true,
        }
      }

      setTimeout(() => {
        titleInfoBox.value = {
          title: null,
          status: null,
          if: false,
        }
      }, 1000)
    }

    return {
      titleInfoBox,
      onSubmit,
      stopTimer,
      listCurrency,
      firstCurrency,
      listExchangeRate,
      currency,
      lastCurrency,
      oneCurrency,
      twoCurrency,
      uptadeOneCurrency,
      uptadeTwoCurrency,
      getFirstCurrency,
      getLastCurrency,
      sttarTimer,
      timer,
      currentTime,
    }
  },
}
</script>
