<template>
  <div style="background: #f5f5f5">
    <header-component/>

    <footer-component/>
  </div>
</template>

<script>
import HeaderComponent from "@/components/HeaderComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";

export default {
  name: "CartView",
  components: {FooterComponent, HeaderComponent},
  data() {
    return {
      selectedOption: null
    };
  }
}
</script>

<style>
</style>