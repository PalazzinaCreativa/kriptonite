<template>
    <div></div>
</template>
<script>
export default {
  beforeRouteEnter (to, from, next) {
    if(to.name === 'share') { next({ path: '/' }) }
  }
}
</script>