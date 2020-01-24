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
          <feTurbulence type="fractalNoise" baseFrequency="0.00001 0.00001" numOctaves="1" result="warp"></feTurbulence>
          <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="30" in="SourceGraphic" in2="warpOffset" />
      </filter>
    </defs>
  </svg>
</template>
