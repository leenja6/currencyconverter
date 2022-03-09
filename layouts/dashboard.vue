<template lang="pug">
.main.exchange-page
  TheHeader
  .main__body
    .main__inner.child-view
      .crypro-exchange-index 
        Nuxt
</template>
<script>
import TheHeader from '~/components/markup/TheHeader.vue'
import TheMenu from '~/components/markup/TheMenu.vue'
export default {
  name: 'DashboardPage',
  components: {
    TheHeader,
    TheMenu,
  },
}
</script>