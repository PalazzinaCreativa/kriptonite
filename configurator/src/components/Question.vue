<template>
  <div question class="font-light w-full h-full flex">
    <div class="w-1/2 h-full flex flex-col items-center justify-center">
      <div class="w-full max-w-[21.875rem]">
        <slot name="progress" />
        <div class="text-xl">
          <slot name="question" />
        </div>
        <div class="mt-10">
          <slot name="paragraph" />
        </div>
      </div>
    </div>
    <div class="w-1/2 h-full bg-yellow flex flex-col items-center justify-center">
      <div class="w-full max-w-[21.875rem]">
        <slot name="options" />
      </div>
      <div class="w-full py-12 px-24">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>
<style>
[question] b {
  @apply font-semi-bold;
}

[question] a {
  @apply underline;
}
</style>