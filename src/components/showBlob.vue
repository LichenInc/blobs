<template lang="pug">
  .show-blob
    div.presets-wrapper(style='z-index:100; display:flex; width: 200px; flex-direction:column;')
      h1 Page pour test Graphql
      ApolloQuery(:query='query')
        template(slot-scope="{ result: { loading, error, data } }")
          template(v-if='data')
            div(v-for='(emotion, index) in data.communEmotions', :key='index')
              button(@click='selectEmotion = emotion') {{emotion.titre}}
      div(v-if='selectEmotion')
        h1 Émotion choisi {{selectEmotion.titre}}
        pre {{selectEmotion}}
        div Valeurs info
          div nb_points: {{selectEmotion.nbPoint}}
          div Complexite: {{selectEmotion.complexite}}
          div Couleur Début: {{selectEmotion.couleurDebut}}
          div Couleur Fin: {{selectEmotion.couleurFin}}
          div Transition: {{selectEmotion.transition}}
    construct-blob(v-if='selectEmotion', :nb_points='parseInt(selectEmotion.nbPoint)', :complexite='selectEmotion.complexite', :couleur_debut='selectEmotion.couleurDebut', :couleur_fin='selectEmotion.couleurFin', :transition='selectEmotion.transition')
</template>

<script>
import { communEmotions } from '@/queries/emotions.js'
import ConstructBlob from '@/components/default'
export default {
  name: 'AvecData',
  data () {
    return {
      query: communEmotions,
      selectEmotion: null
    }
  },
  components: {
    ConstructBlob
  },
  methods: {
  }
}
</script>

<style>

</style>
