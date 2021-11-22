<template>
  <div class="flex justify-center items-center flex-col w-full h-screen px-5">
    <font-awesome-icon
      icon="sad-tear"
      size="4x"
      class="text-pink-400 cursor-pointer"
    />
    <p class="text-pink-200 font-extrabold text-5xl mt-5">404</p>
    <h1
      class="
        font-bold
        text-pink-400 text-4xl
        sm:text-5xl
        md:text-6xl
        text-center
      "
    >
      Page Not Found
    </h1>
    <p
      class="
        text-center
        cursor-pointer
        text-gray-400
        uppercase
        font-semibold
        mt-5
      "
      @click="() => $router.push({ name: 'Home' })"
    >
      back to home
    </p>
  </div>
</template>

<script>
</script>

<style>
</style>