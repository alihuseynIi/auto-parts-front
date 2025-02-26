<template>
  <v-select
      :loading="loading"
      :value="value"
      @input="$emit('update:value', $event)"
      :label="label"
      :items="items"
      item-title="name"
      item-value="id"
      variant="solo"
  ></v-select>
</template>

<script>
export default {
  name: 'CustomSelect',
  props: {
    loading: Boolean,
    value: {
      type: [String, Number],
      default: null
    },
    label: String,
    items: Array
  },
  emits: ['update:value']
}
</script>
