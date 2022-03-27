<template>
  <div class="navbar">
    <nav class="navbar navbar-expand navbar-light fixed-top">
        <a href="/" class="navbar-brand">Home</a>
        <ul class="navbar-nav" v-if="isloggedin">
          <li class="nav-item" :active="true">
            <a class="nav-link" href="/charts">Charts <span class="sr-only">(current)</span></a>
          </li>
        </ul>
        <div class="collapse navbar-collapse">
          <ul class="navbar-nav ml-auto">
            <li class="nav-item">
              <a href="/login" class="nav-link" v-if="!isloggedin">Login</a>
            </li>
            <li class="nav-item">
              <a href="/register" class="nav-link" v-if="!isloggedin">Sign up</a>
            </li>
           <div class="btn-group" v-if="isloggedin">
              <a class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" />
            <ul class="dropdown-menu dropdown-menu-right">
              <a class="dropdown-item" @click="handleLogout">Logout</a>
            </ul>
            </div>
          </ul>
      </div>
    </nav>
  </div>
    
</template>


<script>
import FireBase from "../services/firebase";
export default {
  name: 'NavBar',
  props: ['isloggedin'],
  methods: {
    handleLogout() {
        FireBase.auth.signOut().then(() => {
          this.$router.push('/login');
          this.$store.commit('resetState');
        })
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  div.navbar {
    height: 4%;
  }

  .navbar-light {
    background-color: #ffffff;
    box-shadow: 0px 14px 80px rgba(34, 35, 58, 0.2);
  }
</style>
