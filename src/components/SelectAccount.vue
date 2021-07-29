<template>
  <v-col cols="8" >
    <v-select  @change="onAccountChange" :items="accounts" item-text="viewName" item-value="googleId" label="Select an Account"></v-select>
  </v-col>
</template>


<script>
import AccountsDataService from '@/services/AccountsDataService';

export default {

  data: () => ({
    accounts: []
  }),

  created () {
    this.initialize()
  },


  methods: {
    onAccountChange(gid) {
      let vm = this.$parent

      while(vm) {
        vm.$emit('idChange', gid);
        vm = vm.$parent
      }
    },

    initialize() {
      AccountsDataService.getAll()
          .then((resp) => {
            this.accounts = resp.data.data.map(this.displayAccount);
          })
          .catch((e) => {
            console.error(e);
          });
    },

    displayAccount(acct) {
      return {
          googleId : acct.googleId,
          viewName : acct.viewName
      }
    }
  }
}
</script>
