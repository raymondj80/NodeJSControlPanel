<template>
<div class="auth-wrapper">
    <div class="auth-inner">
        <form @submit.prevent="handleSubmit">
        <div v-if="errors && errors.length">
            <div v-for="error of errors" v-bind:key="error">
                <div class="alert alert-warning alert-dismissible fade show" role="alert">
                    {{error}}
                    <button type="button" class="close" data-bs-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            </div>
        </div>
        <h3>Login</h3>
        <div class="form-group">
            <label>Email</label>
            <input type="email" class="form-control" v-model.trim="login.email" placeholder="Email"/>
        </div>

        <div class="form-group">
            <label>Password</label>
            <input type="password" class="form-control" v-model.trim="login.password" placeholder="Password"/>
        </div>
        <p>Not Registered? <router-link to="/register">Sign Up Here</router-link> </p>

        <button class="btn btn-primary btn-block">Login</button>
        <button class="btn btn-primary btn-block" @click.prevent="signInWithGoogle">Sign in With Google</button>
    </form>
    </div>
</div>
    
</template>

<script>
import Store from "../store/index"
import FireBase from "../services/firebase";
export default {
    name: "LoginView",
    data () {
        return {
            developerKey: "",
            clientId: "",
            scope: "https://www.googleapis.com/auth/drive.readonly",
            login: {},
            errors: []
        }
    },
    mounted() {
        Store.commit('resetState');
        let gDrive = document.createElement("script");
        gDrive.setAttribute("type", "text/javascript");
        gDrive.setAttribute("src", "https://apis.google.com/js/api.js");
        document.head.appendChild(gDrive);
    },
    methods: {
    handleSubmit() {
        FireBase.auth.signInWithEmailAndPassword(this.login.email, this.login.password)
            .then(() => {
                console.log(FireBase.auth.currentUser);
                this.$router.push({
                    name: 'Home'
                })
            }).catch((err) => {
                switch (err.code) {
                    case "auth/invalid-email":
                        this.errors.push("Invalid email");
                        break;
                    case "auth/user-not-found":
                        this.errors.push("No account with that email was found");
                        break;
                    case "auth/wrong-password":
                        this.errors.push("Incorrect password");
                        break;
                    default:
                        this.errors.push("Email or password was incorrect");
                        break;
                }
            })
    },
    async signInWithGoogle() {
        gapi.load("auth2", async () => {
            console.log("Auth2 Loaded");
            const googleUser = await gapi.auth2.init(
                {
                apiKey: process.env.VUE_APP_API_KEY,
                clientId: process.env.VUE_APP_CLIENT_ID,
                scope: 'https://www.googleapis.com/auth/drive',
                },
            ).signIn();
            const token = googleUser.getAuthResponse();
            this.$store.commit('modifyToken', token.access_token);
            var credential = FireBase.firebase.auth.GoogleAuthProvider.credential(token.id_token);
            FireBase.firebase.auth().signInWithCredential(credential)
                .then(() => {
                    this.$router.push({name: 'Home'});
                })

        });
    },
    // signInWithGoogle() {
    //     self = this;
    //     this.$gapi._libraryLoad('auth2').then(async function(auth2) {
    //         const googleUser = await auth2.init(self.$gapi.config).signIn();
    //         const token = googleUser.getAuthResponse().id_token;
    //         console.log(token);
    //         var credential = FireBase.firebase.auth.GoogleAuthProvider.credential(token);
    //         FireBase.firebase.auth().signInWithCredential(credential);
    //         FetchProvider.initialize()
    //     })
    // },
    // signInWithGoogle() {
    //     FireBase.auth.signInWithPopup(FireBase.provider)
    //         .then((res) => {
    //             this.$router.push("/");
    //         }).catch((err) => {
    //             console.log(err);
    //         })
    // },
    register () {
      this.$router.push({
        name: 'Register'
      })
    }
  }
}
</script>

<style scoped>
    .btn {
        margin-top: 10px;
    }

    .auth-wrapper {
    display: flex;
    justify-content: center;
    flex-direction: column;
    text-align: left;
  }

  .auth-inner {
    width: 450px;
    margin: auto;
    background: #ffffff;
    box-shadow: 0px 14px 80px rbga(34, 35, 58, 0.2);
    padding: 40px 55px 45px 55px;
    border-radius: 15px;
    transition: all .3s;
  }
</style>