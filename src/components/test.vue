<script>

export default {
  name: 'app',
  components: {
  },
  props: {
  },
  data () {
    return {
    }
  },
  watch: {
  },
  computed: {
  },
  created () {
  },
  mounted () {
    // this.oldRender()
    this.renderBlob()
  },
  methods: {
  }
}
</script>

<template lang="pug">
  .test-index
    kinesis-container.container
      kinesis-element(:strength='10')
        h1 Salut bohnomme
      kinesis-element(:strength='20')

        h2 Bonjour
</template>
<style lang="sass">
.test-index
  .container
    width: 300px
    height: 300px
    background-color: green
    h1
      color: white
    h2
      color: yellow

</style>
