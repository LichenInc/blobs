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
    couleur_debut: { required: false, type: String, default: '#3171d8' },
    couleur_fin: { required: false, type: String, default: '#ec576b' },
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
        fillStart: '#ec576b',
        fillEnd: 'grey',
        width: 100,
        height: 100,
        size: null, // Bounding box dimensions.
        complexity: 0.5, // chiffre entre 0 et 1 nombre de point entre 4 et 16
        contrast: 0.4, // chiffre entre 0 et 1
        color: null, // string hexa
        stroke: {
          color: null, // string hex
          width: 100 //number
        },
        seed: 'blob', //string
        guides: false, //rendu des points et barres
      },
      showGradient: true,
      fillPercentage: 0
    }
  },
  watch: {
    'countFactor' (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.renderNewValBlob()
      }
    },
    'blobOptions.complexity' (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.renderNewValBlob()
      }
    },
    'blobOptions.seed' (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.renderBlob()
      }
    },
    'blobOptions.contrast' (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.renderNewValBlob()
      }
    },
    'nb_points' (newVal) {
        if (newVal) {
          this.renderNewValBlob()
        }
    },
    complexite (newVal) {
      if (newVal) {
        this.renderNewValBlob()
      }
    },
    'couleur_debut' (newVal) {
      if (newVal) {
        this.blobOptions.fill = newVal
        this.blobOptions.fillStart = newVal
        // this.renderNewValBlob()
      }
    },
    'couleur_fin' (newVal) {
      if (newVal) {
        this.blobOptions.fillEnd = newVal
        // this.renderNewValBlob()
      }
    },
    'randomFactor' (newVal) {
      if (newVal) {
        this.renderNewValBlob()
      }
    },
    'angleFactor' (newVal) {
      if (newVal) {
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
      return 100 / Math.E
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
            x: Math.sin(rad(i * this.angle)) * this.radius * rand + 100 / 2,
            y: Math.cos(rad(i * this.angle)) * this.radius * rand + 100 / 2
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
    if (this.couleur_debut) this.blobOptions.fillStart = this.couleur_debut
    if (this.couleur_fin) this.blobOptions.fillEnd = this.couleur_find
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
        this.changValue()
      } else {
        this.currentPath = this.oldPath
        this.$store.state.looping = false
        this.$store.state.repetition = 0
      }
    },
    changValue(up) {
      const rgen = rand(this.blobOptions.seed || String(Date.now()))
      // const count = 3 + Math.floor(this.countFactor * 0.4)
      // const angle = 360 / count
      const tempTab = []
      this.oldPath = this.currentPath
      for (let i = 0; i < this.stockPoint.length; i++) {
        if (up) {
          tempTab.push({ x: this.stockPoint[i].x + i + rgen(), y: this.stockPoint[i].y + i + rgen() })
        } else {
          tempTab.push({ x: this.stockPoint[i].x, y: this.stockPoint[i].y + 5 })
        }
      }
      const smoth = smooth(tempTab, {
        closed: false,
        strength: 1, // le math random rend ça plus carré si on le + il est plus rond
      })
      let temp = renderEditable(smoth, this.blobOptions)
      const enf = temp.children[0].children[0]
      this.currentPath = enf.attributes.d
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
      const radius = 100 / Math.E
      const points = []
      for (let i = 0; i < count; i++) {
        const random = 1 - 0.8 * this.blobOptions.contrast * rgen()
        points.push({
            x: Math.sin(rad(i * angle)) * radius * random + 100 / 2,
            y: Math.cos(rad(i * angle)) * radius * random + 100 / 2
        })
      }
      this.stockPoint = points
      const smoth = smooth(points, {
        closed: true,
        strength: ((4 / 3) * Math.tan(rad(angle / 4))) / Math.sin(rad(angle / 2)),
      })
      // Autre parametres de rotate enlevés
      // this.blobOptions['transform'] = `rotate(${rgen() * this.angle / Math.PI},${600 / 2},${600 / 2})`

      this.blobOptions['transform'] = `rotate(${rgen() * this.angle / Math.PI})`
      let temp = renderEditable(smoth, this.blobOptions)
      if (!this.firstTry) {
        const elem = document.getElementById('svblob')
        const gradientStart = document.getElementById('gradientStart')
        const gradientEnd = document.getElementById('gradientEnd')
        // console.log(gradientStart, gradientEnd)
        gradientStart.setAttribute('stop-color', this.couleur_debut)
        gradientEnd.setAttribute('stop-color', this.couleur_fin)
        for (let i = 0; i < temp.children.length; i++) {
          const g = document.createElementNS('http://www.w3.org/2000/svg', temp.children[i].tag)
          g.setAttribute('transform', temp.children[i].attributes.transform)
          const enf = temp.children[i].children[0]
          const path = document.createElementNS('http://www.w3.org/2000/svg', enf.tag)
          const pathStroke = document.createElementNS('http://www.w3.org/2000/svg', enf.tag)
          path.setAttribute('d', enf.attributes.d)
          path.setAttribute('id', 'fillPath')
          path.setAttribute('fill', 'url(#grad)')
          path.setAttribute('mask', 'url(#mask)')
          pathStroke.setAttribute('d', enf.attributes.d)
          pathStroke.setAttribute('id', 'strokePath')
          pathStroke.setAttribute('stroke', 'url(#grad)')
          pathStroke.setAttribute('fill', 'url(#grad)')
          pathStroke.setAttribute('fill-opacity', '0.25')
          pathStroke.setAttribute('stroke-width', '0.25')
          this.currentPath = path.getAttribute('d')

          // path.setAttribute('clip-path', 'url(#svgPath)')
          // path.setAttribute('mask', 'url(#mask4)')
          g.appendChild(path)
          g.appendChild(pathStroke)
          elem.appendChild(g)
        }
        this.firstTry = true
      } else {
        const enf = temp.children[0].children[0]
        this.currentPath = enf.attributes.d
      }

    },
    renderNewValBlob () {
      console.log('on render un nouveau blob')
      const rgen = rand(String(Date.now()))
      const count = 3 + Math.floor(this.countFactor * 0.4)
      const angle = 360 / count
      const radius = 100 / Math.E
      const points = []
      // const gradientStart = document.getElementById('gradientStart')
      // const gradientEnd = document.getElementById('gradientEnd')
      // console.log(gradientStart, gradientEnd)
      // gradientStart.setAttribute('stop-color', this.couleur_debut)
      // gradientEnd.setAttribute('stop-color', this.couleur_fin)
      for (let i = 0; i < count; i++) {
        const random = 1 - 0.8 * this.blobOptions.contrast * rgen()
        points.push({
            x: Math.sin(rad(i * angle)) * radius * random + 100 / 2,
            y: Math.cos(rad(i * angle)) * radius * random + 100 / 2
        })
      }
      this.stockPoint = points
      const smoth = smooth(points, {
        closed: true,
        strength: ((4 / 3) * Math.tan(rad(angle / 4))) / Math.sin(rad(angle / 2)),
      })
      this.blobOptions['transform'] = `rotate(${rgen() * this.angle})`
      let temp = renderEditable(smoth, this.blobOptions)
      const enf = temp.children[0].children[0]
      this.currentPath = enf.attributes.d
    }
  }
}
</script>

<template lang="pug">
  .blob-index
    div
      kinesis-container()
        div alloalaoal
        kinesis-element(:strength='10', type='depth')
          span allo

    div.options-wrapper
      pre {{looping}} Looping?
      pre {{currentEffect}} currentEffect
      div.effects-choice
        input(type='radio', v-model='currentEffect', name='currentEffect', value='glitch')
        | Glitch
        input(type='radio', v-model='currentEffect', name='currentEffect', value='texture')
        | Texture
        input(type='radio', v-model='currentEffect', name='currentEffect', value='shadow')
        | Shadow
        input(type='radio', v-model='currentEffect', name='currentEffect', value='other')
        | Other
      div
        button(@click='globalEmotion("negatif")') Émotion négative
        button(@click='globalEmotion("positif")') Émotion positive

        button(@click='goIdle') {{ startIdle ? 'Stop idle' : 'Start Idle' }}
        button(@click='feedElement()') Ajouter element

        button(@click='kill') kill
        button(@click='showGradient = !showGradient') Toggle gradient {{showGradient}}
        button(@click='launchEffect', :disabled='!currentEffect') Launch effect
        button(@click='clearEffect', :disabled='!currentEffect') clear effect
      div.param
        span Pourcentage completion {{fillPercentage}}
        input(type='range', min=0, max=1, step=0.01, v-model='fillPercentage')
      div.param
        span nombre de point: {{ count }}
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
    kinesis-container.blob-wrapper
      kinesis-element(:strength='10', type='depth')
        div(refs='blob', id='blob', :class='{"active-filter" : currentEffect}')

          svg(id='svblob', refs='blobRef', xmlns='http://www.w3.org/2000/svg', version='1.1', preserveAspectRatio='xMidYMin slice', viewBox='0 0 100 100')
            defs
              //- <mask id="text-mask">
              //-   <use x="0" y="0" xlink:href="#text" opacity="1" fill="#ffffff"/>
              //- </mask>
              mask#mask(maskUnits="objectBoundingBox", maskContentUnits="objectBoundingBox")
                rect#maskShape(x='0', y='0', height='100', width='100', fill='#fff', class='rectangle-mask')

              //- radialGradient#grade3(cx="0.5" cy="0.5" r="0.5" fx="0.25" fy="0.25", gradientTransform='translate(0,0)')
                stop#gradientStart(offset='0%', stop-opacity='1', stop-color='black')
                stop#gradientEnd(offset='100%', stop-opacity='1', stop-color='white')
              linearGradient#grad(x1='0%', y1='0%', x2='0%', y2='100%', gradientTransform='translate(0,0)')
                stop#gradientStart(offset='0%', stop-opacity='1')
                stop#gradientEnd(offset='100%', stop-opacity='1')
              //- filter#filter(x='-20%', y='-20%', width='140%', height='140%', filterUnits='objectBoundingBox', color-interpolation-filters='linearRGB')
                feTurbulence(type='turbulence', baseFrequency='0.01 0.05', numOctaves='2', seed='2', stitchTiles='noStitch', result='turbulence')
                feDisplacementMap(in='SourceGraphic', in2='turbulence', scale='20', xChannelSelector='G', yChannelSelector='A', result='displacementMap')
              template(v-if='currentEffect === "shadow"')
                <filter id="filter">
                  <feDropShadow stdDeviation="10 20" in="SourceGraphic" dx="4" dy="9" flood-color="#1F3646" flood-opacity="0.6" x="0%" y="0%" width="100%" height="100%" result="dropShadow"/>
                </filter>
                <filter id="filter" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="linearRGB">
                  <feDisplacementMap in="SourceGraphic" in2="SourceGraphic" scale="3" xChannelSelector="R" yChannelSelector="B" x="0%" y="0%" width="100%" height="100%" result="displacementMap"/>
                  <feComponentTransfer x="0%" y="0%" width="100%" height="100%" in="convolveMatrix" result="componentTransfer">
                    <feFuncR type="discrete" tableValues="1 0 1"/>
                    <feFuncG type="discrete" tableValues="0 1 0"/>
                    <feFuncB type="discrete" tableValues="1 0 1"/>
                    <feFuncA type="discrete" tableValues="0 1"/>
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode in="componentTransfer"/>
                    <feMergeNode in="displacementMap"/>
                  </feMerge>
                </filter>
              template(v-if='currentEffect === "glitch"')
                <filter id="filter">
                    <feTurbulence type="fractalNoise" baseFrequency="0.00001 0.00001" numOctaves="1" result="warp"></feTurbulence>
                    <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="10" in="SourceGraphic" in2="warpOffset" />
                </filter>
              template(v-else-if='currentEffect === "texture"')
                //- <filter id="filter" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse" color-interpolation-filters="linearRGB">
                //- 	<feDropShadow stdDeviation="20 20" in="SourceGraphic" dx="4" dy="9" flood-color="#1F3646" flood-opacity="0.6" x="0%" y="0%" width="100%" height="100%" result="dropShadow"/>
                //- </filter>
                //- <filter id="filter">
                //-   <feImage xlink:href="/ripple.png" x="30" y="20" width="0" height="0" result="ripple"></feImage>
                //-   <feDisplacementMap xChannelSelector="R" yChannelSelector="G" color-interpolation-filters="sRGB" in="SourceGraphic" in2="ripple" scale="20" result="displacementMap" />
                //-   <feComposite operator="in" in2="ripple"></feComposite>
                //-   <feComposite in2="SourceGraphic"></feComposite>
                //- </filter>
            //- svg id="svblob" refs="blobRef" xmlns="http://www.w3.org/2000/svg" version="1.1" preserveAspectRatio="xMidYMin slice" viewBox="0 0 600 600"
    //- glitch-filter(v-if='currentEffect === "glitch"')
    //- texture-filter(v-if='currentEffect === "texture"')
</template>
<style lang="sass">
.rectangle-mask
  // transform: scaleY(0.99)
  transform-origin: center bottom
  // transform: rotate(180deg)
#app
  font-family: 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  // text-align: center
  color: #2c3e50
  // margin-top: 60px
.svg-filters
  position: absolute
  visibility: hidden
  width: 1px
  height: 1px
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
.blob-wrapper
  position: fixed
  top: 0
  left: 0
  height: 100%
  width: 100%
  background: lightgrey
  #blob
    // box-shadow: 0 0 0 10px #b6bdc3
    max-width: 1000px
    width: 100%
    // background: #fff
    margin: 0 auto
    height: 0
    padding-top: 98%
    position: relative
    svg#svblob
      // background-color: grey
      border: solid 10px red
      position: absolute
      top: 0
      left: 0
      &.active-filter
        path
          -webkit-filter: url("#filter")
          filter: url("#filter")
      // #fillPath
        // clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0% 100%)

      // -webkit-filter: drop-shadow( 20px 3px 2px rgba(0, 0, 0, .7))
      // filter: drop-shadow( 10px 10px 50px rgba(0, 0, 0, .27))
      // &::before
      //   content: 'alllalalala'
        // fill: 'url(#grad)' !important
      // width: 100%
      // height: 100%
</style>
<style>
/* #svblob.active-filter path{
  -webkit-filter: url("#filter");
  filter: url("#filter");
} */
</style>
