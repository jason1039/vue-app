<template>
  <div class="row border">test</div>
</template>
<script>
export default {
  name: "CustomerContact",
  props: {
    CustomerContactId: {
      type: Number,
      required: false,
      default: 0,
    },
    ContactPersonName: {
      type: String,
      required: true,
      default: ``,
    },
    Sex: {
      type: String,
      default: "M",
    },
    AgeGroup: {
      type: Number,
      default: 2,
    },
    LikeLiqueur: {
      type: String,
      default: "Y",
    },
    Dwell: {
      type: String,
      required: true,
      default: ``,
    },
  },
};
</script>