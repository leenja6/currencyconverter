const state = () => ({
    listCurrency:[],
    listExchangeRate:[],
    currency:[
        'CNY',
        'USD',
        'EUR',
        'JPY',
        'GBP',
        'KRW',
        'INR',
        'CAD',
        'HKD',
        'BRL',
        'TWD',
    ],
    commission:['1.00', '2.00', '3.00', '4.00', '5.00'],
    currencyPairs:[],
    exchangeRatePairs:[]
})

const actions={
   fetchCurrencyPairs({state, commit}){
    function generateListCurrency(item) {
        if (item.length < 2) {
          return []
        }
        const first = item[0]
        const rest = item.slice(1)
    
        const pairs = rest.map(function (x) {
          const random = (
            Math.random() * (state.commission.length - 1 - 0) +
            0
          ).toFixed(0)
          return {
            base_currency: first,
            quote_currency: x,
            commission: state.commission[random],
          }
        })
        return pairs.concat(generateListCurrency(rest))
    }
    const data = generateListCurrency(state.currency)
    commit('setCurrencyPairs', data)    
   },
   
   fetchExchangeRatePairs({state, commit}){
    function generateExchangeRate(item) {
        if (item.length < 2) {
          return []
        }
        const first = item[0]
        const rest = item.slice(1)
    
        const pairs = rest.map(function (x) {
          const random = (
            Math.random() * (100 - 10) +
            10
          ).toFixed(0)
          return {
            pair: `${first}/${x}`,        
            rate: random,
          }
        })
        return pairs.concat(generateExchangeRate(rest))
    }     
    const data = generateExchangeRate(state.currency) 

    commit('setExchangeRatePairs', data)
   },

   fetchCurrencyPairsItem({state, commit}, payload){
    const combinationOne = state.currencyPairs.filter(
        (r) =>
          r.quote_currency === payload.lastCurrency &&
          r.base_currency === payload.firstCurrency
      )
      const combinationTwo = state.currencyPairs.filter(
        (r) =>
          r.base_currency === payload.lastCurrency &&
          r.quote_currency === payload.firstCurrency
      )
      let dataitem
      if (combinationOne.length > 0) {
        dataitem = combinationOne
      } else if (combinationTwo.length > 0) {
        dataitem = combinationTwo.map((r) => {
          return {
            base_currency: r.quote_currency,
            quote_currency: r.base_currency,
            commission: r.commission,
          }
        })
      } else {
        dataitem = [
          {
            base_currency: '',
            quote_currency: '',
            commission: 0,
          },
        ]
      }     
    commit('setCurrencyPairsItem', dataitem)
   },
   
   fetchExchangeRatePairsItem({state, commit}, payload){    
    const combinationOne = state.exchangeRatePairs.filter(
        (r) => r.pair === `${payload.firstCurrency}/${payload.lastCurrency}`
    )
    const combinationTwo = state.exchangeRatePairs.filter(
        (r) => r.pair === `${payload.lastCurrency}/${payload.firstCurrency}`
    )
    let dataitem
    if (combinationOne.length > 0) {
        dataitem = combinationOne
    } else if (combinationTwo.length > 0) {
        dataitem = combinationTwo.map((r) => {
          return {
            pair: r.pair,
            rate: 1 / Number(r.rate),
          }
        })
    } else {
        dataitem = [
          {
            pair: '',
            rate: 0,
          },
        ]
    }
    commit('setExchangeRatePairsItem', dataitem)
}   
}

const mutations={
    setCurrencyPairs(state, payload){
      state.currencyPairs = payload
    },
    setExchangeRatePairs(state, payload){
        state.exchangeRatePairs = payload
    },
    setCurrencyPairsItem(state, payload){
        state.listCurrency = payload
    },
    setExchangeRatePairsItem(state, payload){
        state.listExchangeRate = payload
    }
}

const getters={
    getListCurrency(state){
        return state.listCurrency
    },
    getListExchangeRate(state){
        return state.listExchangeRate 
    },
    getCurrency(state){
        return state.currency
    }
}

export default{
    namespaced:true,
    state,
    getters,
    mutations,
    actions
}
