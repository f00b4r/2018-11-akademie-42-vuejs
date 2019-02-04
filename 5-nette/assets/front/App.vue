<template>
  <div id="app">
    <div class="text-center mb-4">
      <div class="input-group mb-3">
        <input type="text" class="form-control" v-model="username">
        <div class="input-group-append">
          <button class="btn btn-warning" @click="loadRepos">Load Stared Repositories</button>
        </div>
      </div>
    </div>
    <div v-if="error" class="alert alert-danger">{{error}}</div>
    <div v-else class="card-deck mb-3 text-center">
      <div class="card mb-4 shadow-sm" v-for="star in stars" :key="star.name">
        <div class="card-header">
          <h4 class="my-0 font-weight-normal">{{star.full_name}}</h4>
        </div>
        <div class="card-body">
          <p v-text="star.description"/>
          <a
            :href="star.html_url"
            target="_blank"
            class="btn btn-lg btn-block btn-outline-primary"
          >Open Github</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getStars } from "./model/GithubClient";

export default {
  data: () => ({
    stars: [],
    username: "f3l1x",
    error: null
  }),
  methods: {
    async loadRepos() {
      this.error = null;

      try {
        this.stars = await getStars(this.username);
      } catch (e) {
        this.error = e.response.statusText;
      }
    }
  }
};
</script>

<style <style lang="scss" scoped>
.card-body {
    color: red;
}
</style>
