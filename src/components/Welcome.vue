<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <h1>Welcome!</h1>
  </div>
</template>

<script>
export default {
  name: `Welcome`,
  props: {
    welcome: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    transfer() {
      let $v = this;
      setTimeout(function () {
        document
          .querySelector(".home")
          ?.addEventListener("transitionend", () => {
            $v.$emit("update:welcome", false);
          });
        document.querySelector(".home")?.classList.add("fadeout");
      }, 500);
    },
  },
  created() {
    this.transfer();
  },
};
</script>
<style scoped>
.home {
  opacity: 1;
}

.home.fadeout {
  -webkit-transition: all 2s;
  -moz-transition: all 2s;
  -ms-transition: all 2s;
  -o-transition: all 2s;
  transition: all 2s;
  opacity: 0;
}
</style>