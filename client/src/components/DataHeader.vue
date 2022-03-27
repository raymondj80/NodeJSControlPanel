<template>
    <div class="container">
        <h2 style="float: left; margin-left: 0; margin-bottom: 10px;">
            Data
        </h2>
        <div class="headers-container" style="clear:both;">
          <div class="header"
          v-for="(value, field) in headers"
          v-bind:item="field"
          v-bind:index="value"
          v-bind:key="field"
          >
            <h2 class="text">{{ field }} </h2>
            <p class="text">{{typeof value === 'number' ? value.toFixed(6) : value }} </p>
          </div>
        </div>
    </div>
</template>


<script>
export default {
  name: 'DataHeader',
  props: ['headers'],
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container {
    display: table;
    float: left;
    min-height: 200px;
    }

  .navbar-light {
    background-color: #ffffff;
    box-shadow: 0px 14px 80px rgba(34, 35, 58, 0.2);
  }

  div.headers-container {
  display: grid;
  /* height: 100px; */
  margin-bottom: 10px;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  column-gap: 10px;
  row-gap: 1em;
}

div.header {
  position: relative;
  border: 1px solid #5bd658;
  background-color:  #bcffb8;
  padding: 10px 10px 30px 10px;
  margin-bottom: 15px;
}

p.text {
  font-size: 22px;
  font-weight: 500;
  margin-bottom: 0;
}
</style>
