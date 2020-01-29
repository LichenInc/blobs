import { gsap, TimelineMax } from 'gsap'
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
      effectTimeline: null,
      gradientWrapTweenTarget: '#grad',
      gradientStartTweenTarget: '#gradientStart',
      gradientEndTweenTarget: '#gradientEnd',
      emotionTween: null,
      tween: null,
      tweenStroke: null,
      // tweenTarget: '#svblob path',
      tweenTarget: '#svblob #fillPath',
      tweenTargetStroke: '#svblob #strokePath',
      dummyTarget: null,
      filterTarget: null,
      filterTargetTimeline: null,
      currentEffect: null,
      turbulence: null,
      turbVal: null,
      displacementMap: null
    }
  },
  created() {
    this.tweenOptions = {}
    this.gradientTweenWrap = null
    this.gradientTweenStart = null
    this.gradientTweenEnd = null
    this.gradientOptionsWrap = {}
    this.gradientOptionsStart = {}
    this.gradientOptionsEnd = {}
  },
  watch: {
    'fillPercentage' (newVal, oldVal) {
      if (newVal !== oldVal) {
        gsap.to('#maskShape', {
          attr:{'y': this.fillPercentage},
          // repeat:-1,
          // yoyo:true,
          duration: 0.5
        })
      }
    },
    'currentPath' (newVal, oldVal) {
      if (newVal !== oldVal) {
        if(this.tween) {
          this.tweenStroke.kill()
          this.tween.kill()
        }
        if (this.$store.state.looping) {
          this.tweenOptions = {
            morphSVG: {
              shape: this.currentPath,
              shapeIndex: 1
            },
            duration: 2,
            yoyo: true,
            repeat: -1,
            ease: 'power1.inOut',
            opacity: 1,
            // stagger: 0.5
          }
          this.tween = gsap.to(this.tweenTarget, this.tweenOptions)
          this.tweenStroke = gsap.to(this.tweenTargetStroke, this.tweenOptions)
          this.gradientAnimation(true)
        } else {
          this.tweenOptions = {
            morphSVG: {
              shape: this.currentPath,
              shapeIndex: 2
            },
            duration: 1,
            yoyo: false,
            repeat: 0,
            opacity: 1,
            ease: 'power1.inOut',
            // stagger: 0.5
          }
          this.tween = gsap.to(this.tweenTarget, this.tweenOptions)
          this.tweenStroke = gsap.to(this.tweenTargetStroke, this.tweenOptions)
          this.gradientAnimation(true)
        }
      }
    },
    'showGradient': {
        immediate: true,
        handler (newVal) {
        if (newVal) {
          this.gradientAnimation(true)
        } else {
          this.gradientAnimation(false)
        }
      }
    },
    'currentEffect' (newVal, oldVal) {
      if (newVal === null || !newVal || newVal === '') {
        this.filterTarget.classList.remove('active-filter')
      } else if (newVal !== oldVal) {
        if (this.effectTimeline) {
          this.effectTimeline.kill()
        }
        this.filterTarget.classList.add('active-filter')
        if (newVal === 'glitch') {
          console.log('ON rentre par glitch')
          this.setCurrentEffect('glitch')
        } else if (newVal === 'texture') {
          console.log('ON rentre par texture')
          this.setCurrentEffect('texture')
        }
        // this.setEffect()
        // this.$nextTick(() => {
        //   let thus = this
        //   thus.filterTarget.addEventListener('click', function() {
        //     console.log('on ajoute un evnt sur le clic du blob')
        //       thus.launchEffect()
        //     // if (newVal && newVal === 'glitch') {
        //     //   thus.launchEffect()
        //     // } else {
        //     //   thus.secondEffect()
        //     // }
        //   });
        // })
      }
    }
  },
  mounted () {
    let thus = this
    this.$nextTick(() => {
      thus.filterTarget = window.document.getElementById('svblob');
    })
  },
  methods: {
    kill() {
      this.$nextTick (() => {
        // gsap.isTweening(this.tweenTarget)
        this.tweenStroke.kill()
        this.tween.kill()
      })
    },
    feedElement () {
      // console.log(this.fillPercentage += 10)
      if(this.fillPercentage < 1) {
        this.fillPercentage += 0.25
      }
      this.globalEmotion('feed')
    },
    globalEmotion (type) {
      if (type === 'negatif') {
        CustomWiggle.create("funWiggle", {wiggles:10, type:"anticipate"});
        gsap.fromTo([this.tweenTarget, this.tweenTargetStroke],
          {
            scale: 1.0,
            transformOrigin: 'center',
            duration: 0.15,
            ease: 'linear'
          },
          {
            scale: 1.15,
            duration: 2,
            ease: 'funWiggle'
          },
        )
      } else if ( type === 'positif') {
        CustomWiggle.create("anticipe", {wiggles:10, type:"uniform"});
        gsap.fromTo([this.tweenTarget, this.tweenTargetStroke],
          {
            scaleY: 1.0,
            transformOrigin: 'center',
            duration: 0.15,
            ease: 'linear'
          },
          {
            // rotate: 200,
            scaleY: 1.05,
            translateY: 10,
            duration: 3,
            ease: 'anticipe'
          },
        )
      }
      else if ( type === 'feed') {
        CustomWiggle.create("anticipe", {wiggles:5, type:"uniform"});
        gsap.fromTo([this.tweenTarget, this.tweenTargetStroke],
          {
            scale: 1.0,
            transformOrigin: 'center',
            duration: 0.15,
            ease: 'linear'
          },
          {
            // rotate: 200,
            scale: 1.05,
            duration: 0.5,
            ease: 'anticipe'
          },
        )
      }
    },
    gradientAnimation (value) {
      // console.log(value, 'on est entré dans la fonction gradient')
      if (this.gradientTweenStart && this.gradientTweenEnd && this.gradientTweenWrap) {
        this.gradientTweenWrap.kill()
        this.gradientTweenStart.kill()
        this.gradientTweenEnd.kill()
      }
      if (value === true) {
        this.gradientOptionsWrap = {
          attr: {
            'x2': '100%',
            'y2': '0%'
          },
          repeat: -1,
          duration: 5,
          yoyo: true,
          ease: 'power1.inOut'
        }
        this.gradientOptionsStart = {
          stopColor: this.couleur_debut,
          attr: {
            'offset': '0%'
          }
        }
        this.gradientOptionsEnd = {
          stopColor: this.couleur_fin,
          attr: {
            'offset': '100%'
          }
        }
      } else {
        this.gradientOptionsStart = {
          stopColor: this.couleur_debut,
          attr: {
            'offset': '100%'
          }
        }
        this.gradientOptionsEnd = {
          stopColor: this.couleur_debut,
          attr: {
            'offset': '100%'
          }
        }
      }
      this.gradientTweenWrap = gsap.to(this.gradientWrapTweenTarget, this.gradientOptionsWrap)
      this.gradientTweenStart = gsap.to(this.gradientStartTweenTarget, this.gradientOptionsStart)
      this.gradientTweenEnd = gsap.to(this.gradientEndTweenTarget, this.gradientOptionsEnd)

    },
    setCurrentEffect (type) {
      this.turbulence = null
      this.turbVal = null
      this.displacementMap = null
      if (this.effectTimeline) {
        this.effectTimeline.kill()
      }
      let thus = this
      this.$nextTick(() => {
        if (type === 'glitch') {
          console.log('Je suis dans glithc')
          thus.turbVal = { val: 0.000001 };
          thus.turbulence = window.document.querySelectorAll('#filter feTurbulence')[0];
          thus.effectTimeline = new TimelineMax({ paused: false, onUpdate: function() {
            thus.turbulence.setAttribute('baseFrequency', '0' + thus.turbVal.val);
          } });
          // console.log('jeclick', thus.turbVal, thus.turbulence, this.filterTargetTimeline)
          thus.filterTarget.addEventListener('click', function() {
            thus.effectTimeline.to(thus.turbVal, 0.25, { val: 0.05 });
            thus.effectTimeline.to(thus.turbVal, 0.25, { val: 0.01 });
          })

        } else if (type === 'texture') {
          console.log('Je suis dans texture')
          thus.turbulence = document.querySelectorAll('#filter feImage')[0];
          thus.displacementMap = document.querySelectorAll('#filter feDisplacementMap')[0];
          thus.filterTarget.addEventListener('click', function(e) {
            gsap.set(thus.turbulence, { attr: { x: e.offsetX, y: e.offsetY, width: 0, height: 0 } });
            gsap.to(thus.turbulence, { attr: { x: '-=50', y: '-=50', width: 20, height: 20, duration: 1 } });
            gsap.fromTo(thus.displacementMap, { attr: { scale: 7 } }, { attr: { scale: 0 }, duration: 2 });
          })
        }
      })
    },
    // secondEffect () {
    //   console.log('on est dans le second effect')
    //   let thus = this
    //   this.$nextTick(() => {
    //     thus.turbulence = document.querySelectorAll('#filter feImage')[0];
    //     thus.displacementMap = document.querySelectorAll('#filter feDisplacementMap')[0];
    //     thus.filterTarget.addEventListener('click', function(e) {
    //       TweenMax.set(thus.turbulence, { attr: { x: e.offsetX, y: e.offsetY, width: 0, height: 0 } });
    //       TweenMax.to(thus.turbulence, 3, { attr: { x: '-=600', y: '-=600', width: 1200, height: 1200 } });
    //       TweenMax.fromTo(thus.displacementMap, 2, { attr: { scale: 30 } }, { attr: { scale: 0 } });
    //     })
    //   })
    // },
    launchEffect () {
      if (this.effectTimeline && this.filterTarget) {
        console.log('LAUNCHEFFECT')
        this.effectTimeline.restart();
      } else {
        console.log('Désolé il manque dequoi pour lancer leffet', this.filterTarget, this.effectTimeline)
      }
    },
    clearEffect () {
      this.currentEffect = null
      this.filterTargetTimeline = null
    }
  }
}
