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
      tween: null,
      tweenTarget: '#svblob path',
      tweenOptions: {},
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
        // this.triggerMorph()
        if(this.tween) {
          this.tween.kill()
        }
        if (this.$store.state.looping) {
          this.tweenOptions = {
            fill: this.couleur_debut,
            morphSVG: {
              shape: this.currentPath,
              shapeIndex: 1
            },
            duration: 5,
            yoyo: true,
            repeat: -1,
            ease: 'power1.inOut',
            opacity: 0.5
          }
          this.tween = gsap.to(this.tweenTarget, this.tweenOptions)
        } else {
          this.tweenOptions = {
            fill: this.couleur_fin,
            morphSVG: {
              shape: this.currentPath,
              shapeIndex: 1
            },
            duration: 2,
            yoyo: false,
            repeat: 0,
            opacity: 1,
            ease: 'power1.inOut'
          }
          this.tween = gsap.to(this.tweenTarget, this.tweenOptions)
        }
      }
    },
    // 'startIdle' (newVal, oldVal) {
    //   console.log(newVal, oldVal, 'startIdleWatcher')
    //   if (newVal === false) {
    //     // this.stopIdle()
    //     this.tweenOptions = {
    //       fill: 'yellow',
    //       morphSVG: {
    //         shape: this.currentPath,
    //         shapeIndex: 1
    //       },
    //       yoyo: true,
    //       repeat: -1,
    //       ease: 'power1.inOut'
    //     }
    //     this.tween.kill()
    //     this.tween = gsap.to(this.tweenTarget, 2, this.tweenOptions)
    //   }
    // },
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
      // console.log('dummyTarget', thus.dummyTarget)
      // thus.tween = gsap.to(thus.tweenTarget, 2, thus.tweenOptions)
      // console.log(thus.tween, 'newTween')
      // thus.tween = gsap.quickSetter(thus.tweenTarget)
    })
  },
  methods: {
    kill() {
      this.$nextTick (() => {
        console.log(this.tween, gsap.isTweening(this.tweenTarget), )
        gsap.isTweening(this.tweenTarget)
        this.tween.kill()
        // this.tween.pause()
      })
    },
    stopIdle () {
      console.log('ON STOP LE IDLE')
    },
    triggerMorph () {
      console.log('Triggering Morph')
      // this.myTween.to({
      //   fill: this.couleur_debut,
      //   morphSVG: {
      //     shape: this.currentPath,
      //     shapeIndex: 1
      //   },
      //   // duration: 2,
      //   yoyo: this.$store.state.looping,
      //   repeat: this.$store.state.repetition,
      //   ease: 'power1.inOut'
      // })
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
