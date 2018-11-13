<template>
    <div id="app">
        <div class="card-deck mb-3 text-center">
            <div class="card mb-4 shadow-sm" v-for="star in stars">
                <div class="card-header">
                    <h4 class="my-0 font-weight-normal">{{star.name}}</h4>
                </div>
                <div class="card-body">
                    <h1 class="card-title pricing-card-title">$0 <small class="text-muted">/ mo</small></h1>
                    <ul class="list-unstyled mt-3 mb-4">
                        <li>10 users included</li>
                        <li>2 GB of storage</li>
                        <li>Email support</li>
                        <li>Help center access</li>
                    </ul>
                    <button type="button" class="btn btn-lg btn-block btn-outline-primary">Sign up for free</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {getStars} from "./model/GithubClient";

    export default {
        data: () => ({
           stars: [],
        }),
        async mounted() {
            this.stars = await getStars('f3l1x');
        }
    }
</script>

<style>
    #app {
        color: red;
    }
</style>
