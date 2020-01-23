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
      span RANDOM FACTOR
      input(type='range', min=1, max=100, step=1, v-model='randomFactor')
    div
      span Angle influencer (1 / 360)
      input(type='range', min=1, max=100, step=1, v-model='angleFactor')
    div(id='blob')
    div current path: {{currentPath}}
    div old path: {{oldPath}}
    button(@click='goIdle') Idle animation
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
    transition: { required: false, type: Number, default: 0 },
    effects: { required: false, type: Array, default: () => [] }
  },
  data () {
    return {
      // blobOptions.complexity: 0.4,
      countFactor: 14,
      randomFactor: 20,
      currentPath: null,
      oldPath: null,
      angleFactor: 360,
      startIdle: false,
      stockPoint: null,
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
        // console.log(document.getElementById('svblob'))
        let svg = document.getElementById('svblob')
        if (svg.children[0]) {
          // console.log(svg.children[0])
          const g = svg.children[0]
          const path = g.children[0]
          // console.log('g', g)
          this.oldPath = path.getAttribute('d')
        }
        this.renderNewValBlob()
      }
    },
    'blobOptions.complexity' (newVal, oldVal) {
      if (newVal !== oldVal) {
        let svg = document.getElementById('svblob')
        if (svg.children[0]) {
          const g = svg.children[0]
          const path = g.children[0]
          this.oldPath = path.getAttribute('d')
        }
        this.renderNewValBlob()
      }
    },
    'blobOptions.seed' (newVal, oldVal) {
      if (newVal !== oldVal) {
        let svg = document.getElementById('svblob')
        if (svg.children[0]) {
          const g = svg.children[0]
          const path = g.children[0]
          this.oldPath = path.getAttribute('d')
        }
        this.renderNewValBlob()
      }
    },
    'blobOptions.contrast' (newVal, oldVal) {
      if (newVal !== oldVal) {
        let svg = document.getElementById('svblob')
        if (svg.children[0]) {
          const g = svg.children[0]
          const path = g.children[0]
          this.oldPath = path.getAttribute('d')
        }
        this.renderNewValBlob()
      }
    },
    'nb_points' (newVal) {
        if (newVal) {
          let svg = document.getElementById('svblob')
          if (svg.children[0]) {
            const g = svg.children[0]
            const path = g.children[0]
            this.oldPath = path.getAttribute('d')
          }
          this.renderNewValBlob()
        }
    },
    complexite (newVal) {
      if (newVal) {
        let svg = document.getElementById('svblob')
        if (svg.children[0]) {
          const g = svg.children[0]
          const path = g.children[0]
          this.oldPath = path.getAttribute('d')
        }
        this.renderNewValBlob()
      }
    },
    'couleur_debut' (newVal) {
      if (newVal) {
        this.blobOptions.fill = newVal
        let svg = document.getElementById('svblob')
        if (svg.children[0]) {
          const g = svg.children[0]
          const path = g.children[0]
          this.oldPath = path.getAttribute('d')
        }
        this.renderNewValBlob()
      }
    },
    'randomFactor' (newVal) {
      if (newVal) {
        let svg = document.getElementById('svblob')
        if (svg.children[0]) {
          const g = svg.children[0]
          const path = g.children[0]
          this.oldPath = path.getAttribute('d')
        }
        this.renderNewValBlob()
      }
    },
    'angleFactor' (newVal) {
      if (newVal) {
        let svg = document.getElementById('svblob')
        if (svg.children[0]) {
          const g = svg.children[0]
          const path = g.children[0]
          this.oldPath = path.getAttribute('d')
        }
        this.renderNewValBlob()
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
      return (Math.random(1, this.angleFactor) / this.count)
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
    goIdle () {
      this.startIdle = !this.startIdle
      if (this.startIdle) {
        let up = true
        window.interAnim = setInterval(() => {
          if (up) {
            up = false
          } else {
            up = true
          }
          console.log(up)
          this.changValue(up)
        }, 500)
      } else {
        clearInterval(window.interAnim)
      }
    },
    changValue(up) {
      const count = 3 + Math.floor(this.countFactor * 0.4)
      const angle = 360 / count
      const tempTab = []
      this.oldPath = this.currentPath
      for (let i = 0; i < this.stockPoint.length; i++) {
        if (up) {
          tempTab.push({ x: this.stockPoint[i].x + i + this.rgen(), y: this.stockPoint[i].y + i + this.rgen() })
        } else {
          tempTab.push({ x: this.stockPoint[i].x - i  - this.rgen(), y: this.stockPoint[i].y - i - this.rgen() })
        }
      }
      const smoth = smooth(tempTab, {
        closed: true,
        strength: ((4 / 3) * Math.tan(rad(angle / 4))) / Math.sin(rad(angle / 2)) + Math.random(0,1), // le math random rend ça plus carré si on le + il est plus rond
      })
      let temp = renderEditable(smoth, this.blobOptions)
      const enf = temp.children[0].children[0]
      this.currentPath = enf.attributes.d
      let svg = document.getElementById('svblob')
      if (svg.children[0]) {
        const g = svg.children[0]
        const path = g.children[0]
        this.$nextTick(() => {
          path.setAttribute('fill', this.blobOptions.fill) // ON METS LA NOUVELLE COULEUR
          path.setAttribute('d', this.currentPath) // ON METS LE NOUVEAU PATH ICI
        })
      }
      // let temp = this.currentPath.split(',') // on split la chaine de charact;re sur la virgule
      // for (let i = 1; i < temp.length; i++) { // On commence à 1 parce qu'on veut toujours dessiné le svg au même endroit
      //   let val = Object.assign( {} ,temp[i])
      //   let newVal = val
      //   if (up) {
      //     newVal = parseInt(newVal[4]) + 1
      //     if (newVal < 10) {
      //       val[4] = newVal.toString()
      //       temp[i] = Object.values(val).join().replace(/,/g, '')
      //     } else {
      //       // on doit changer la valeur [1] et [2]
      //       val[2] = '1'
      //       val[4] = '0'
      //       temp[i] = Object.values(val).join().replace(/,/g, '')
      //     }
      //   } else {
      //     newVal = parseInt(newVal[4]) - 1
      //     if (newVal > 0) {
      //       val[4] = newVal.toString()
      //       temp[i] = Object.values(val).join().replace(/,/g, '')
      //     }
      //   }
      //   // console.log(temp)
      //   // temp = temp.join()
      //   let diff = Object.assign( {} ,temp)
      //   console.log(diff)
      //   diff = Object.values(diff)
      //   this.oldPath = this.currentPath
      //   this.currentPath = diff.join()
      //   let svg = document.getElementById('svblob')
      //   if (svg.children[0]) {
      //     const g = svg.children[0]
      //     const path = g.children[0]
      //     this.$nextTick(() => {
      //       path.setAttribute('fill', this.blobOptions.fill) // ON METS LA NOUVELLE COULEUR
      //       path.setAttribute('d', diff) // ON METS LE NOUVEAU PATH ICI
      //     })
      //   }       
      // }
    },
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
      this.stockPoint = points
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
        this.currentPath = path.getAttribute('d')
        // path.setAttribute('stroke', enf.attributes.fill)
        // path.setAttribute('stroke-width', 2)
        // console.log(this.blobOptions.fill)
        path.setAttribute('fill', this.blobOptions.fill)
        g.appendChild(path)
        elem.appendChild(g)
      }
    },
    renderNewValBlob () {
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
      this.stockPoint = points
      const smoth = smooth(points, {
        closed: true,
        strength: ((4 / 3) * Math.tan(rad(angle / 4))) / Math.sin(rad(angle / 2)),
      })
      this.blobOptions['transform'] = `rotate(${this.rgen() * this.angle / Math.PI},${600 / 2},${600 / 2})`
      let temp = renderEditable(smoth, this.blobOptions)
      const enf = temp.children[0].children[0]
      this.currentPath = enf.attributes.d
      let svg = document.getElementById('svblob')
      if (svg.children[0]) {
        const g = svg.children[0]
        const path = g.children[0]
        this.$nextTick(() => {
          path.setAttribute('fill', this.blobOptions.fill) // ON METS LA NOUVELLE COULEUR
          path.setAttribute('d', this.currentPath) // ON METS LE NOUVEAU PATH ICI
        })
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
