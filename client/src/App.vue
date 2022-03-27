<template>
  <div id="app">
        <NavBar :isloggedin='isLoggedIn' v-if='isLoggedIn'/>
        <router-view />
  </div>
</template>

<script>
import SocketService from "./services/socketservice";
import NavBar from "./components/NavBar.vue";
import FireBase from "./services/firebase";

export default {
  name: 'App',
  data() {
    return {
      isLoggedIn: false
    }
  },
  components: {
    NavBar,
  },
  beforeMount() {
      FireBase.auth.onAuthStateChanged((user) => {
        if (user) {
          this.isLoggedIn = true;
          SocketService.connect();
        } else {
          this.isLoggedIn = false;
          SocketService.disconnect();
        } 
      });
  },
}
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Fira+Sans:400,500,600,700,800');


  .container:after {
      clear: both;
  }

  * {
    box-sizing:border-box;
  }

  html, #app, .auth-wrapper {
    width: 100%;
    height: 100%;
  }

  body {
    height: 97%;
    display: block;
    margin: 40px;
  }


  #app {
    display: inline-block;
    text-align: center;
  }

  div.container {
  max-width: 100%;
  /* min-height: 200px; */
  margin-top: 20px;
  overflow: hidden;
  position: relative;
  width: 100%;
  }


  body {
    min-height: 100vh;
    display: flex;
    font-weight: 400;
    font-family: 'Fira Sans', sans-serif;
  }

</style>
