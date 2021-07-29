<template>
  <v-app>
    <v-app-bar app dark>
      <div class="d-flex align-center mr-2">
        michael botelho
      </div>
    </v-app-bar>

    <v-main>
      <OptionsList></OptionsList>
    </v-main>
  </v-app>
</template>

<script>

import OptionsList from "@/components/OptionsList";
export default {
  name: "app",
  components: {OptionsList}
};
</script>
