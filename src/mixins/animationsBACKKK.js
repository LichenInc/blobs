import { gsap, TweenMax, TimelineMax } from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { CustomWiggle } from 'gsap/CustomWiggle'
import { CustomEase } from 'gsap/CustomEase'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'

gsap.registerPlugin(MotionPathPlugin, MorphSVGPlugin, CustomWiggle, CustomEase)
export default {
  components: {
  },
  data () {
    return {
      myTween: null,
      dummyTarget: null,
      filterTarget: null,
      filterTargetTimeline: null,
      currentEffect: null,
      turbulence: null,
      turbVal: null,
      displacementMap: null
    }
  },
  watch: {
    'currentPath' (newVal, oldVal) {
      if (newVal !== oldVal) {
        // console.log('on a une diference')
        // this.triggerMorph()
      }
    },
    'startIdle' (newVal, oldVal) {
      console.log(newVal, oldVal, 'startIdleWatcher')
      if (newVal === false) {
        // this.stopIdle()
      }
    },
    'currentEffect' (newVal, oldVal) {
      // console.log(newVal, oldVal, 'watcher effect')
      if (newVal === null || !newVal || newVal === '') {
        this.filterTarget.classList.remove('active-filter')
        // console.log('on skip')
      } else if (newVal !== oldVal) {
        this.filterTarget.classList.add('active-filter')
        // console.log('on a une difference deffet')
        this.setEffect()
        this.$nextTick(() => {
          let thus = this
          this.filterTarget.addEventListener('click', function() {
            // console.log('jeclick du watcher')
            if (thus.currentEffect && thus.currentEffect === 'glitch') {
              thus.launchEffect()
            }
          });
        })
      }
    }
  },
  mounted () {
    let thus = this
    this.$nextTick(() => {
      thus.dummyTarget = window.document.getElementById('component-8');
      thus.filterTarget = window.document.getElementById('svblob');
      console.log(this.filterTarget, 'filterTarget')
      // console.log('dummyTarget', thus.dummyTarget)
      const timeline = new TimelineMax()
      timeline.to('#svblob path', 2, {
        scale: 2,
        rotation: 10,
        yoyo: true
      })
      timeline.to('#svblob path', 2, {
        scale: 1,
        rotation: '-=16',
        ease: 'power1.inOut'
      })
      // var tween = new TweenMax('#svblob path', 2, {
      //   fill: thus.couleur_debut,
      //   morphSVG: {
      //     shape: thus.currentPath,
      //     shapeIndex: 1
      //   },
      //   yoyo: thus.$store.state.looping,
      //   repeat: thus.$store.state.repetition,
      //   ease: 'power1.inOut'
      // })
      // tween.to('#svblob path', 2, {
      //   fill: thus.couleur_debut,
      //   morphSVG: {
      //     shape: thus.currentPath,
      //     shapeIndex: 1
      //   },
      //   yoyo: thus.$store.state.looping,
      //   repeat: thus.$store.state.repetition,
      //   ease: 'power1.inOut'
      // }
      // )
      // this.$nextTick(() => {
      //   let thus = this
      //   thus.secondEffect()
      // })

      // let thas = thus
      // thus.filterTarget.addEventListener('click', function() {
      //   console.log('jeclick2')
      //   thas.launchEffect()
      //   // thas.filterTargetTimeline.restart();
      // });
    })

  },
  methods: {
    stopIdle () {
      console.log('ON STOP LE IDLE', this.morphTween)
      // this.morphTween.to('#svblob path', 0.5, {
      //     // morphSVG: '#blobPath2',
      //     fill: 'orange',
      //     morphSVG: {
      //       shape: this.oldPath,
      //       shapeIndex: 1
      //     },
      //     yoyo: false,
      //     repeat: 0,
      //     ease: 'power1.inOut'
      // })
      // this.morphTimeline.stop()
      // this.morphTimeline.to('#svblob path', 2, {
      //     // morphSVG: '#blobPath2',
      //     stringFilter:MorphSVGPlugin.pathFilter,
      //     fill: 'blue',
      //     morphSVG: {
      //       shape: this.oldPath,
      //       shapeIndex: 1
      //     },
      //     // duration: 2,
      //     yoyo: false,
      //     repeat: 0,
      //     ease: 'power1.inOut'
      //     // ease: 'myWiggle'
      // })
      // console.log()
      // this.morphTween.yoyo(false)
      // this.mor
      // this.morphTween.updateTo({
      //   fill: 'green',
      // }, false)
      // this.morphTween.to('#svblob path', {
      //     // morphSVG: '#blobPath2',
      //     fill: 'blue',
      //     morphSVG: {
      //       shape: this.currentPath,
      //       shapeIndex: 1
      //     },
      //     duration: 2,
      //     yoyo: false,
      //     repeat: 0,
      //     ease: 'power1.inOut'
      //     // ease: 'myWiggle'
      // })
    },
    triggerMorph () {
      console.log(this.myTween, 'MYTWEEN')
      this.myTween.to({
        fill: this.couleur_debut,
        morphSVG: {
          shape: this.currentPath,
          shapeIndex: 1
        },
        // duration: 2,
        yoyo: this.$store.state.looping,
        repeat: this.$store.state.repetition,
        ease: 'power1.inOut'
      })
      // this.morphTween = TweenMax.fromTo('#svblob path', 2, {
      //     // morphSVG: '#blobPath2',
      //     fill: this.couleur_debut,
      //     morphSVG: {
      //       shape: this.currentPath,
      //       shapeIndex: 1
      //     },
      //     // duration: 2,
      //     yoyo: this.$store.state.looping,
      //     repeat: this.$store.state.repetition,
      //     ease: 'power1.inOut'
      //     // ease: 'myWiggle'
      // },
      // {
      //     // morphSVG: '#blobPath2',
      //     fill: this.couleur_fin,
      //     morphSVG: {
      //       shape: this.currentPath,
      //       shapeIndex: 1
      //     },
      //     // duration: 2,
      //     yoyo: this.$store.state.looping,
      //     repeat: this.$store.state.repetition,
      //     ease: 'power1.inOut'
      //     // ease: 'myWiggle'
      // })
      // console.log(this.morphTween, 'mytweeen')


      // tween.updateTo('#svblob path', {
      //   morphSVG: {
      //     shape: this.currentPath,
      //     shapeIndex: 1
      //   },
      // })
      // TweenMax.to('#svblob path', {
      //   // morphSVG: '#blobPath2',
      //   fill: this.couleur_fin,
      //   morphSVG: {
      //     shape: this.currentPath,
      //     shapeIndex: 1
      //   },
      //   duration: 2,
      //   yoyo: this.$store.state.looping,
      //   repeat: this.$store.state.repetition,
      //   ease: 'power1.inOut'
      //   // ease: 'myWiggle'
      // })
      // if (this.$store.state.looping) {
      //   console.log('on rentre ici')
      //   TweenMax.updateTo({yoyo: false, repeat: 0})
      // }
    },
    setEffect () {
      // let turbulence = null
      // let turbVal = null
      // let displacementMap = null
      this.$nextTick(() => {
        let thus = this
        if (thus.currentEffect === 'glitch') {
            this.turbVal = { val: 0.000001 };
            this.turbulence = window.document.querySelectorAll('#filter feTurbulence')[0];
            this.filterTargetTimeline = new TimelineMax({ paused: true, onUpdate: function() {
              thus.turbulence.setAttribute('baseFrequency', '0 ' + thus.turbVal.val);
            } });
            console.log('jeclick', thus.turbVal, thus.turbulence, this.filterTargetTimeline)
            thus.filterTargetTimeline.to(thus.turbVal, 0.25, { val: 0.05 });
            thus.filterTargetTimeline.to(thus.turbVal, 1, { val: 0.000001 });
        }
      })
    },
    secondEffect () {
      console.log('on est dans le second effect')
      // let turbulence = null
      // // let turbVal = null
      // let displacementMap = null
      let thus = this
      this.$nextTick(() => {
        this.turbulence = document.querySelectorAll('#filter feImage')[0];
        this.displacementMap = document.querySelectorAll('#filter feDisplacementMap')[0];
        this.filterTarget.addEventListener('click', function(e) {
          // console.log(e, 'event', e.offsetX, e.offsetY)
          TweenMax.set(thus.turbulence, { attr: { x: e.offsetX, y: e.offsetY, width: 0, height: 0 } });
          TweenMax.to(thus.turbulence, 3, { attr: { x: '-=300', y: '-=300', width: 600, height: 600 } });
          TweenMax.fromTo(thus.displacementMap, 2, { attr: { scale: 30 } }, { attr: { scale: 0 } });
        })
      })
    },
    launchEffect () {
      if (this.filterTargetTimeline && this.filterTarget) {
        console.log('LAUCHNEFFECT')
        this.filterTargetTimeline.restart();
      } else {
        console.log('Désolé il manque dequoi pour lancer leffet', this.filterTarget, this.filterTargetTimeline)
      }
    },
    clearEffect () {
      this.currentEffect = null
      this.filterTargetTimeline = null
    }
  }
}
