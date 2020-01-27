<script>
import { rand } from '@/mixins/rand.js'
import { rad } from '@/mixins/unit.js'
import { renderEditable } from '@/mixins/render.js'
import { smooth } from '@/mixins/smooth.js'
import Animations from '@/mixins/animations.js'
import GlitchFilter from '@/components/filters/glitchFilter.vue'
import TextureFilter from '@/components/filters/textureFilter.vue'

export default {
  name: 'app',
  components: {
    GlitchFilter,
    TextureFilter
  },
  mixins: [Animations],
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
      firstTry: false,
      // blobOptions.complexity: 0.4,
      countFactor: 14,
      randomFactor: 20,
      currentPath: null,
      oldPath: null,
      oldColor: null,
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
        // let svg = document.getElementById('svblob')
        // if (svg.children[0]) {
        //   // console.log(svg.children[0])
        //   const g = svg.children[0]
        //   const path = g.children[0]
        //   // console.log('g', g)
        //   this.oldPath = path.getAttribute('d')
        // }
        this.renderNewValBlob()
      }
    },
    'blobOptions.complexity' (newVal, oldVal) {
      if (newVal !== oldVal) {
        // let svg = document.getElementById('svblob')
        // if (svg.children[0]) {
        //   const g = svg.children[0]
        //   const path = g.children[0]
        //   this.oldPath = path.getAttribute('d')
        // }
        this.renderNewValBlob()
      }
    },
    'blobOptions.seed' (newVal, oldVal) {
      if (newVal !== oldVal) {
        // const temp = document.getElementById('sblob')
        // while(temp.firstChild)
        //   temp.removeChild(temp.firstChild)
        // let svg = document.getElementById('svblob')
        // if (svg.children[0]) {
        //   const g = svg.children[0]
        //   const path = g.children[0]
        //   this.oldPath = path.getAttribute('d')
        // }
        this.renderBlob()
      }
    },
    'blobOptions.contrast' (newVal, oldVal) {
      if (newVal !== oldVal) {
        // let svg = document.getElementById('svblob')
        // if (svg.children[0]) {
        //   const g = svg.children[0]
        //   const path = g.children[0]
        //   this.oldPath = path.getAttribute('d')
        // }
        this.renderNewValBlob()
      }
    },
    'nb_points' (newVal) {
        if (newVal) {
          // let svg = document.getElementById('svblob')
          // if (svg.children[0]) {
          //   const g = svg.children[0]
          //   const path = g.children[0]
          //   this.oldPath = path.getAttribute('d')
          // }
          this.renderNewValBlob()
        }
    },
    complexite (newVal) {
      if (newVal) {
        // let svg = document.getElementById('svblob')
        // if (svg.children[0]) {
        //   const g = svg.children[0]
        //   const path = g.children[0]
        //   this.oldPath = path.getAttribute('d')
        // }
        this.renderNewValBlob()
      }
    },
    'couleur_debut' (newVal) {
      if (newVal) {
        this.blobOptions.fill = newVal
        // let svg = document.getElementById('svblob')
        // if (svg.children[0]) {
        //   const g = svg.children[0]
        //   const path = g.children[0]
        //   this.oldPath = path.getAttribute('d')
        // }
        this.renderNewValBlob()
      }
    },
    'randomFactor' (newVal) {
      if (newVal) {
        // let svg = document.getElementById('svblob')
        // if (svg.children[0]) {
        //   const g = svg.children[0]
        //   const path = g.children[0]
        //   this.oldPath = path.getAttribute('d')
        // }
        this.renderNewValBlob()
      }
    },
    'angleFactor' (newVal) {
      if (newVal) {
        // let svg = document.getElementById('svblob')
        // if (svg.children[0]) {
        //   const g = svg.children[0]
        //   const path = g.children[0]
        //   this.oldPath = path.getAttribute('d')
        // }
        this.renderNewValBlob()
      }
    }
  },
  computed: {
    looping: {
      get () { return this.$store.state.looping },
      set (val) { this.$store.commit('set_looping', val) }
    },
    repetition: {
      get () { return this.$store.state.repetition },
      set (val) { this.$store.commit('set_repetition', val) }
    },
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
      console.log('IDLE?', this.startIdle)
      if (this.startIdle) {
        this.$store.state.looping = true
        this.$store.state.repetition = -1
        // let up = true
        // window.interAnim = setInterval(() => {
        //   if (up) {
        //     up = false
        //   } else {
        //     up = true
        //   }
        //   console.log(up)
        //   this.changValue(up)
        // }, 2000)
        this.changValue()
      } else {
        // clearInterval(window.interAnim)
        this.currentPath = this.oldPath
        this.$store.state.looping = false
        this.$store.state.repetition = 0
      }
    },
    changValue(up) {
      const rgen = rand(this.blobOptions.seed || String(Date.now()))
      const count = 3 + Math.floor(this.countFactor * 0.4)
      const angle = 360 / count
      const tempTab = []
      this.oldPath = this.currentPath
      for (let i = 0; i < this.stockPoint.length; i++) {
        if (up) {
          tempTab.push({ x: this.stockPoint[i].x + i + rgen(), y: this.stockPoint[i].y + i + rgen() })
        } else {
          tempTab.push({ x: this.stockPoint[i].x - i  - rgen(), y: this.stockPoint[i].y - i - rgen() })
        }
      }
      const smoth = smooth(tempTab, {
        closed: true,
        strength: ((4 / 3) * Math.tan(rad(angle / 4))) / Math.sin(rad(angle / 2)) + Math.random(0,1), // le math random rend ça plus carré si on le + il est plus rond
      })
      let temp = renderEditable(smoth, this.blobOptions)
      const enf = temp.children[0].children[0]
      this.currentPath = enf.attributes.d
      // let svg = document.getElementById('svblob')
      // if (svg.children[0]) {
      //   const g = svg.children[0]
      //   const path = g.children[0]
      //   this.$nextTick(() => {
      //     path.setAttribute('fill', this.blobOptions.fill) // ON METS LA NOUVELLE COULEUR
      //     path.setAttribute('d', this.currentPath) // ON METS LE NOUVEAU PATH ICI
      //   })
      // }

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
    // rgen () {
    //   //++++++++++++ DÉCOMMENTÉ POUR LE IDLE
    //   // on a rajouté un random entre 0 et 1 pour être sur que les chiffres générés ne sont pas les mêmes
    //   // mais qu'ils restent proches
    //   return rand(String(Date.now()) + Math.random(0, this.randomFactor))()
    // },
    renderBlob () {
      const rgen = rand(this.blobOptions.seed || String(Date.now()))
      // console.log(rgen())
      const count = 3 + Math.floor(this.countFactor * 0.4)
      const angle = 360 / count
      // const angle = 90
      const radius = 600 / Math.E
      const points = []
      for (let i = 0; i < count; i++) {
        const random = 1 - 0.8 * this.blobOptions.contrast * rgen()
        // console.log(rgen())
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

      this.blobOptions['transform'] = `rotate(${rgen() * this.angle / Math.PI},${600 / 2},${600 / 2})`
      let temp = renderEditable(smoth, this.blobOptions)
      if (!this.firstTry) {
        const elem = document.createElementNS('http://www.w3.org/2000/svg', temp.tag)
        elem.id = 'svblob'
        elem.setAttribute('refs', 'blobRef')
        elem.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
        elem.setAttribute('version', '1.1')
        elem.setAttribute('preserveAspectRatio', 'xMidYMin slice')
        // elem.setAttribute('width', 600)
        // elem.setAttribute('height', 600)
        elem.setAttribute('viewBox', '0 0 600 600')
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
        this.firstTry = true
      } else {
        const enf = temp.children[0].children[0]
        this.currentPath = enf.attributes.d
      }

    },
    renderNewValBlob () {
      const rgen = rand(String(Date.now()))
      const count = 3 + Math.floor(this.countFactor * 0.4)
      const angle = 360 / count
      // const angle = 90
      const radius = 600 / Math.E
      const points = []
      for (let i = 0; i < count; i++) {
        const random = 1 - 0.8 * this.blobOptions.contrast * rgen()
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
      this.blobOptions['transform'] = `rotate(${rgen() * this.angle},${600 / 2},${600 / 2})`
      let temp = renderEditable(smoth, this.blobOptions)
      const enf = temp.children[0].children[0]
      this.currentPath = enf.attributes.d
      // let svg = document.getElementById('svblob')
      // if (svg.children[0]) {
      //   const g = svg.children[0]
      //   const path = g.children[0]
      //   this.$nextTick(() => {
      //     // path.setAttribute('fill', this.blobOptions.fill) // ON METS LA NOUVELLE COULEUR
      //     path.setAttribute('d', this.currentPath) // ON METS LE NOUVEAU PATH ICI
      //   })
      // }
    }
  }
}
</script>

<template lang="pug">
  div(id='app')
    div.options-wrapper
      pre {{looping}}
      //- button#component-8.button.button--8(style="filter: url('#filter'); cursor: pointer;") Click me
      div.effects-choice
        input(type='radio', v-model='currentEffect', name='currentEffect', value='glitch')
        | Glitch
        input(type='radio', v-model='currentEffect', name='currentEffect', value='texture')
        | Texture
        input(type='radio', v-model='currentEffect', name='currentEffect', value='other')
        | Other
      //- pre {{value}}
      div
        button(@click='goIdle') Idle animation
        button(@click='kill') kill
        button(@click='launchEffect', :disabled='!currentEffect') Launch effect
        button(@click='clearEffect', :disabled='!currentEffect') clear effect
      div.param
        span nombre de point: {{ count }}
        //- input(type='number', v-model='blobOptions.complexity')
        input(type='range', min=0, max=1, step=0.1, v-model='blobOptions.complexity')
      div.param
        span Seed:
        input(type='text', v-model='blobOptions.seed')
      div.param
        span contrast
        input(type='range', min=0, max=1, step=0.1, v-model='blobOptions.contrast')
      div.param
        span count countFactor
        input(type='range', min=1, max=100, step=1, v-model='countFactor')
      div.param
        span RANDOM FACTOR
        input(type='range', min=1, max=100, step=1, v-model='randomFactor')
      div.param
        span Angle influencer (1 / 360)
        div.flex-grow-1
        input(type='range', min=1, max=100, step=1, v-model='angleFactor')
      div
        div.b oldPath
        pre {{oldPath}}
      div
        div.b CurrentPAth
        pre {{currentPath}}
        pre looping: {{$store.state.looping}}
        pre repetition: {{$store.state.repetition}}
    div.blob-wrapperino
      div(refs='blob', id='blob', :class='{"active-filter" : currentEffect}')
    //- div current path: {{currentPath}}
    //- div old path: {{oldPath}}
    glitch-filter(v-if='currentEffect === "glitch"')
    texture-filter(v-if='currentEffect === "texture"')
</template>
<style lang="sass">
#app
  font-family: 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  // text-align: center
  color: #2c3e50
  margin-top: 60px
  .options-wrapper
    position: absolute
    background-color: rgba(255,255,255,0.5)
    padding: 20px
    margin: 20px
    border-radius: 10px
    top: 0
    right: 0
    z-index: 10
    width: 400px
    .param
      display: flex
      justify-content: space-between
      margin-bottom: 5px
  .blob-wrapperino
    position: fixed
    top: 0
    left: 0
    height: 100%
    width: 100%
    background: lightgrey
    #blob
      // box-shadow: 0 0 0 10px #b6bdc3
      width: 100%
      background: #fff
      margin: 0 auto
      height: 0
      padding-top: 98%
      position: relative
      svg#svblob
        background-color: pink
        position: absolute
        top: 0
        left: 0
        // width: 100%
        // height: 100%
</style>
<style>
#svblob.active-filter path{
  -webkit-filter: url("#filter");
  filter: url("#filter");
}
</style>
<style lang='scss'>
$dark-blue: #222;
$green: #2CD892;
$action-color: $green;

.button--8 {
  -webkit-font-smoothing: antialiased;
  background-color: $dark-blue;
  border: none;
  display: inline-block;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.85em;
  font-weight: 700;
  text-decoration: none;
  user-select: none;
  letter-spacing: 0.1em;
  color: white;
  padding: 20px 40px;
  text-transform: uppercase;
  position: relative;
  z-index: 1;
  outline: 10px solid #F6F6F6!important; // background-color of parent
  background: #F6F6F6;
  border: 2px solid #000;
  color: #000;
  &:focus {
    color: $dark-blue;
  }
  &:hover {
    background: #F6F6F6;
    border-color: $action-color;
    color: $action-color;
  }
}
.svg-filters {
  position: absolute;
  visibility: hidden;
  width: 1px;
  height: 1px;
}
.button,
.button__bg {
  .safari & {
    -webkit-filter: none!important;
    filter: none!important;
  }
}
</style>
