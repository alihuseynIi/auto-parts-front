<template>
  <div class="all-footer">
    <v-container class="brand-slider">
      <v-row>
        <v-col cols="12">
          <SliderComponent :images="imageList"/>
        </v-col>
      </v-row>
    </v-container>

    <footer class="footer">
      <v-container>
        <v-row>
          <v-col cols="12">
            <div class="copyright">
              Copyright © {{ new Date().getFullYear() }}, {{ $t('message.all_rights_reserved') }}
            </div>
          </v-col>
        </v-row>
      </v-container>
    </footer>
  </div>
</template>

<script>
import SliderComponent from "@/components/SliderComponent.vue";

export default {
  name: "FooterComponent",
  components: {SliderComponent},
  data() {
    return {
      imageList: [
        "https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/1.png",
        "https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/2.png",
        "https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/3.png",
        "https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/4.png",
        "https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/5.png",
        "https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/6.png",
        "https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/7.png",
      ],
    }
  }
}
</script>

<style scoped>
.footer {
  background: #252525;
  color: white;
  padding: 10px 0;
}

.brand-slider {
  margin-top: 50px;
  margin-bottom: 40px;
}

@media screen and (max-width: 1279px) {
  .brand-slider {
    margin-top: 35px;
    margin-bottom: 25px;
  }
}
</style>
