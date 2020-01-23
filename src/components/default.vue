<template lang="pug">
  div(id='app')
    div
      span nombre de point: {{ count }}
      //- input(type='number', v-model='blobOptions.complexity')
      input(type='range', min=0, max=1, step=0.1, v-model='blobOptions.complexity')
    div
      span Seed:
      input(type='text', v-model='blobOptions.seed')
    div
      span contrast
      input(type='range', min=0, max=1, step=0.1, v-model='blobOptions.contrast')
    div
      span count countFactor
      input(type='range', min=1, max=100, step=1, v-model='countFactor')
    div
      h3 RANDOM FACTOR
      input(type='range', min=1, max=100, step=1, v-model='randomFactor')
    div(id='blob')
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
  props: {
    nb_points: { required: false, type: Number, default: 0 },
    complexite: { required: false, type: Number, default: 0 },
    couleur_debut: { required: false, type: String, default: '' },
    couleur_fin: { required: false, type: String, default: '' },
    transition: { required: false, type: Number, default: 0 }
  },
  data () {
    return {
      // blobOptions.complexity: 0.4,
      countFactor: 14,
      randomFactor: 20,
      blobOptions: {        
        closed: true,
        fill: '#ec576b',
        width: 600,
        height: 600,
        size: null, // Bounding box dimensions.
        complexity: 0.5, // chiffre entre 0 et 1 nombre de point entre 4 et 16
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
    'countFactor' (newVal, oldVal) {
      if (newVal !== oldVal) {
        const temp = document.getElementById('blob')
        while(temp.firstChild) {
          temp.removeChild(temp.firstChild)
        }
        this.renderBlob()
      }
    },
    'blobOptions.complexity' (newVal, oldVal) {
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
    },
    'nb_points' (newVal) {
        if (newVal) {
          this.blobOptions.complexity = newVal
          const temp = document.getElementById('blob')
          while(temp.firstChild) {
            temp.removeChild(temp.firstChild)
          }
          this.renderBlob()
        }
    },
    complexite (newVal) {
      if (newVal) {
        this.blobOptions.contrast = newVal
        const temp = document.getElementById('blob')
        while(temp.firstChild) {
          temp.removeChild(temp.firstChild)
        }
        this.renderBlob()
      }
    },
    'couleur_debut' (newVal) {
      if (newVal) {
        this.blobOptions.fill = newVal
        const temp = document.getElementById('blob')
        while(temp.firstChild) {
          temp.removeChild(temp.firstChild)
        }
        this.renderBlob()
      }
    },
    'randomFactor' (newVal) {
      if (newVal) {
        this.renderBlob()
      }
    }
  },
  computed: {
    count () {
      // pris du fichier de base countFactor = 14
      return 3 + Math.floor(this.countFactor * this.blobOptions.complexity) 
    },
    radius () {
      return 600 / Math.E
    },
    angle () {
      return (360 / this.count)
      // return 20 * Math.PI / this.count
    },
    calcseed () {
      return rand((this.blobOptions.seed || String(Date.now())))
    },
    points () {
      const temp = []
      if (this.count > 0) {
        for (let i = 0; i < this.count; i++) {
          const rand = 1 - (0.8 * this.blobOptions.contrast) * this.calcseed
          temp.push({
            x: Math.sin(rad(i * this.angle)) * this.radius * rand + 600 / 2,
            y: Math.cos(rad(i * this.angle)) * this.radius * rand + 600 / 2
          })
        }
      }
      return temp
    }
  },
  created () {
    if (this.nb_points) this.blobOptions.complexity = this.nb_points
    if (this.complexite) this.blobOptions.contrast = this.complexite
    if (this.couleur_debut) this.blobOptions.fill = this.couleur_debut 
  },
  mounted () {
    // this.oldRender()
    this.renderBlob()
  },
  methods: {
    forceWaitin() {
      this.$nextTick(() => '')
    },
    rgen () {
      // on a rajouté un random entre 0 et 1 pour être sur que les chiffres générés ne sont pas les mêmes
      // mais qu'ils restent proches
      return rand(String(Date.now()) + Math.random(0, this.randomFactor))()
    },
    renderBlob () {
      // const rgen = rand(this.blobOptions.seed || String(Date.now()))
      const count = 3 + Math.floor(this.countFactor * 0.4)
      const angle = 360 / count
      // const angle = 90
      const radius = 300 / Math.E
      const points = []
      for (let i = 0; i < count; i++) {
        const random = 1 - 0.8 * this.blobOptions.contrast * this.rgen()
        points.push({
            x: Math.sin(rad(i * angle)) * radius * random + 600 / 2,
            y: Math.cos(rad(i * angle)) * radius * random + 600 / 2
        })
      }
      const smoth = smooth(points, {
        closed: true,
        strength: ((4 / 3) * Math.tan(rad(angle / 4))) / Math.sin(rad(angle / 2)),
      })

      this.blobOptions['transform'] = `rotate(${this.rgen() * this.angle / Math.PI},${600 / 2},${600 / 2})`
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
        console.log(this.blobOptions.fill)
        path.setAttribute('fill', this.blobOptions.fill)
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
