<template>
  <div class="slider">
    <div class="slide-track">
      <div v-for="(image, index) in images" :key="index" class="slide">
        <img :src="image" height="100" width="250" alt="Slider Image" />
      </div>
      <div v-for="(image, index) in images" :key="'repeat-' + index" class="slide">
        <img :src="image" height="100" width="250" alt="Slider Image" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    images: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(calc(-250px * 7));
  }
}

.slider {
  background: white;
  height: 100px;
  overflow: hidden;
  position: relative;
  width: 100%;
  box-shadow: none !important;
  border-radius: 4px;
}

.slider::before,
.slider::after {
  content: "";
  height: 100px;
  position: absolute;
  width: 200px;
  z-index: 2;
  background: none;
}

.slider::after {
  right: 0;
  top: 0;
  transform: rotateZ(180deg);
}

.slider::before {
  left: 0;
  top: 0;
}

.slider .slide-track {
  animation: scroll 40s linear infinite;
  display: flex;
  width: calc(250px * 14);
}

.slider .slide {
  height: 100px;
  width: 250px;
}
</style>
