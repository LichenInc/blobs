import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import VueApollo from 'vue-apollo'
import ApolloClient from 'apollo-boost'

const apolloClient = new ApolloClient({
  // You should use an absolute URL here
  uri: 'https://api.dokoma.com/api/v1/graphql/editeur'
})
const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})
Vue.use(VueApollo)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  apolloProvider,
  render: h => h(App)
}).$mount('#app')
