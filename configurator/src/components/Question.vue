<template>
  <div class="w-full h-full flex">
    <div class="w-1/2 h-full flex flex-col items-center justify-center">
      <div class="w-full max-w-[21.875rem]">
        <div class="text-xl">
          <slot name="question" />
        </div>
        <div class="mt-10">
          <p clas="text-xs">
            <slot name="paragraph" />
          </p>
        </div>
      </div>
    </div>
    <div class="w-1/2 h-full bg-yellow flex flex-col items-center justify-center">
      <div class="w-full max-w-[21.875rem]">
        <slot name="options" />
      </div>
    </div>
  </div>
</template>