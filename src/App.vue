<script setup>
  import GamePrimary from './components/GamePrimary.vue';
  import GameSecondary from './components/GameSecondary.vue';
</script>


<template>
<div class="container py-5">
  <ul class="nav nav-pills justify-content-center mb-3" id="pills-tab" role="tablist">
    <li class="nav-item" role="presentation">
      <button class="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#gamePrimary" type="button" role="tab" aria-controls="pills-home" aria-selected="true">GAME PRIMARY</button>
    </li>
    <li class="nav-item" role="presentation">
      <button class="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#gameSecondary" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">GAME SECONDARY</button>
    </li>
  </ul>
  <div class="tab-content pt-5" id="pills-tabContent">
    <game-primary tabId="gamePrimary"></game-primary>
    <game-secondary tabId="gameSecondary"></game-secondary>
  </div>
  <div class="row mt-5">
    <div class="col-12 col-md-6">
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Fernando Giroto</h5>
          <h6 class="card-subtitle mb-2 text-muted">Full-Stack Developer</h6>
          <a href="http://www.fernandogiroto.com" target="_blank" class="card-link">Website</a>
          <a href="https://www.linkedin.com/in/fernandogiroto/" target="_blank" class="card-link">Linkedin</a>
          <a href="https://github.com/fernandogiroto" target="_blank" class="card-link">Github</a>
          <p class="mt-4">Full-Stack Programmer with over 8 years of experience in PHP, Javascript, UX/UI design and digital marketing. And even after all these years, I can't get enough. Quite the opposite, I continue to have fun, be enchanted and love my profession.</p>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

