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
        <h3>Register</h3>
        <div class="form-group">
            <label>Name</label>
            <input type="text" class="form-control" v-model.trim="register.name" placeholder="Name"/>
        </div>

        <div class="form-group">
            <label>Email</label>
            <input type="email" class="form-control" v-model.trim="register.email" placeholder="Email"/>
        </div>

        <div class="form-group">
            <label>Password</label>
            <input type="password" class="form-control" v-model.trim="register.password" placeholder="Password"/>
        </div>

        <div class="form-group">
            <label>Confirm Password</label>
            <input type="password" class="form-control" v-model.trim="register.confirm_password" placeholder="Confirm Password"/>
        </div>
        <p>Have an Account? <router-link to="/login">Login Here</router-link> </p>
        <button class="btn btn-primary btn-block">Sign Up</button>
    </form>
    </div>
</div>
    
</template>

<script>
    import FireBase from "../services/firebase";
    export default {
        name: "RegisterView",
        data() {
            return {
            register: {
                name: '',
                email: '',
                password: '',
                confirm_password: ''
            },
            errors: []
            }

        },
        methods: {
            handleSubmit() {
                if (this.register.password !== this.register.confirm_password) {
                    this.errors.push("Passwords do not match");
                } else {
                FireBase.auth.createUserWithEmailAndPassword(this.register.email, this.register.password)
                    .then(cred => {
                        FireBase.db.collection('users').doc(cred.user.uid).set({
                            name: this.register.name
                        })
                        this.$router.push({
                            path: '/login'
                        })
                    }).catch((err) => {
                        console.log(err)
                        switch (err.code) {
                            case "auth/email-already-in-use":
                                this.errors.push("Email already in use");
                                break;
                            case "auth/invalid-email":
                                this.errors.push("Please enter an email");
                                break;
                            case "auth/weak-password":
                                this.errors.push("Password must be 6 characters or longer")
                                break;
                            case "auth/internal-error":
                                this.errors.push("Please enter a password")
                                break;
                            default:
                                this.errors.push("Error registering for new user");
                                break;
                        }
                    })
                }
            }
        }
    }
</script>

<style scoped>
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
