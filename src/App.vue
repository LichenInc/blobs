<template lang="pug">
  div(id='app')
    div
      span nombre de point: {{ count }}
      //- input(type='number', v-model='nbpoint')
      input(type='range', min=0, max=1, step=0.1, v-model='nbpoint')
    div
      span Seed:
      input(type='text', v-model='blobOptions.seed')
    div
      span contrast
      input(type='range', min=0, max=1, step=0.1, v-model='blobOptions.contrast')
      //- input(type='text', v-model='blobOptions.contrast')
    //- div
      //- span complexity
      //- input(type='text', v-model='blobOptions.complexity')
    div angle {{360 / count }}
    div radius {{ 600 / Math.E }} test
    div(id='blob')
    pre(v-if='points') {{points}}
</template>

<script>
import { rand } from '@/mixins/rand.js'
import { rad } from '@/mixins/unit.js'
import { renderEditable } from '@/mixins/render.js'
import { smooth } from '@/mixins/smooth.js'
export default {
  name: 'app',
  components: {
  },
  data () {
    return {
      nbpoint: 0.4,
      blobOptions: {
        closed: true,
        fill: '#ec576b',
        width: 600,
        height: 600,
        size: null, // Bounding box dimensions.
        // complexity: 0.5, // chiffre entre 0 et 1 nombre de point entre 4 et 16
        contrast: 0.4, // chiffre entre 0 et 1
        color: null, // string hexa
        stroke: {
          color: null, // string hex
          width: 600 //number
        },
        seed: 'blob', //string
        guides: false //rendu des points et barres
      }
    }
  },
  watch: {
    nbpoint (newVal, oldVal) {
      if (newVal !== oldVal) {
        const temp = document.getElementById('blob')
        while(temp.firstChild) {
          temp.removeChild(temp.firstChild)
        }
        this.renderBlob()
      }
    },
    'blobOptions.seed' (newVal, oldVal) {
      if (newVal !== oldVal) {
        const temp = document.getElementById('blob')
        while(temp.firstChild) {
          temp.removeChild(temp.firstChild)
        }
        this.renderBlob()
      }
    },
    'blobOptions.contrast' (newVal, oldVal) {
      if (newVal !== oldVal) {
        const temp = document.getElementById('blob')
        while(temp.firstChild) {
          temp.removeChild(temp.firstChild)
        }
        this.renderBlob()
      }
    }
  },
  computed: {
    count () {
      return 3 + Math.floor(14 * this.nbpoint) 
    },
    radius () {
      return 300 / Math.E
    },
    angle () {
      return (360 / this.count)
    },
    calcseed () {
      return rand((this.blobOptions.seed || String(Date.now())))
    },
    points () {
      const temp = []
      if (this.count > 0) {
        for (let i = 0; i < this.count; i++) {
          const rand = 1 - (0.8 * this.nbpoint) * this.calcseed
          temp.push({
            x: Math.sin(rad(i * this.angle)) * this.radius * rand + 600 / 2,
            y: Math.cos(rad(i * this.angle)) * this.radius * rand + 600 / 2,
          })
        }
      }
      return temp
    }
  },
  mounted () {
    this.renderBlob()
  },
  methods: {
    renderBlob () {
      const smoth = smooth(this.points, {
        closed: true,
        // strength: ((4 / 3) * Math.tan(rad(this.angle / 4))) / Math.sin(rad(this.angle / 2)) STRENGHT ORIG
        strength: ((4 / 3) * Math.tan(rad(this.angle / 4))) / Math.sin(rad(this.angle / 2))
      })
      this.blobOptions['transform'] = `rotate(${this.calcseed * this.angle / Math.PI},${600 / 2},${600 / 2})`
      let temp = renderEditable(smoth, this.blobOptions)
      const elem = document.createElementNS('http://www.w3.org/2000/svg', temp.tag)
      elem.id = 'svblob'
      elem.setAttribute('width', 600)
      elem.setAttribute('height', 600)
      elem.setAttribute('viewbox', temp.attributes.viewBox)
      document.getElementById('blob').appendChild(elem) // on mets notre blob sous elem
      for (let i = 0; i < temp.children.length; i++) {
        const g = document.createElementNS('http://www.w3.org/2000/svg', temp.children[i].tag)
        g.setAttribute('transform', temp.children[i].attributes.transform)
        const enf = temp.children[i].children[0]
        const path = document.createElementNS('http://www.w3.org/2000/svg', enf.tag)
        path.setAttribute('d', enf.attributes.d)
        // path.setAttribute('stroke', enf.attributes.fill)
        // path.setAttribute('stroke-width', 2)
        path.setAttribute('fill', enf.attributes.fill)
        g.appendChild(path)
        elem.appendChild(g)
      }
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
