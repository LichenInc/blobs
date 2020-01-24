<script>
import Animations from '@/mixins/animations.js'

export default {
  name: 'glitch-filter',
  components: {
  },
  mixins: [Animations],
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
  },
  methods: {
  }
}
</script>

<template lang="pug">
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="svg-filters">
    <defs>
    <filter id="filter">
      <feImage xlink:href="/ripple.png" x="30" y="20" width="0" height="0" result="ripple"></feImage>
      <feDisplacementMap xChannelSelector="R" yChannelSelector="G" color-interpolation-filters="sRGB" in="SourceGraphic" in2="ripple" scale="20" result="displacementMap" />
      <feComposite operator="in" in2="ripple"></feComposite>
      <feComposite in2="SourceGraphic"></feComposite>
    </filter>
    </defs>
  </svg>
</template>
