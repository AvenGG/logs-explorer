<template>
  <div class="loader">
    <svg
      class="loader__svg"
      width="100px"
      height="100px"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      aria-hidden="true"
    >
      <g transform="translate(25 50)">
        <circle cx="0" cy="0" r="9" fill="#302f2d">
          <animateTransform
            attributeName="transform"
            type="scale"
            begin="-0.29498525073746307s"
            calcMode="spline"
            keySplines="0.3 0 0.7 1;0.3 0 0.7 1"
            values="0;1;0"
            keyTimes="0;0.5;1"
            dur="0.8849557522123893s"
            repeatCount="indefinite"
          />
        </circle>
      </g>
      <g transform="translate(50 50)">
        <circle cx="0" cy="0" r="9" fill="#302f2d">
          <animateTransform
            attributeName="transform"
            type="scale"
            begin="-0.14749262536873153s"
            calcMode="spline"
            keySplines="0.3 0 0.7 1;0.3 0 0.7 1"
            values="0;1;0"
            keyTimes="0;0.5;1"
            dur="0.8849557522123893s"
            repeatCount="indefinite"
          />
        </circle>
      </g>
      <g transform="translate(75 50)">
        <circle cx="0" cy="0" r="9" fill="#302f2d">
          <animateTransform
            attributeName="transform"
            type="scale"
            begin="0s"
            calcMode="spline"
            keySplines="0.3 0 0.7 1;0.3 0 0.7 1"
            values="0;1;0"
            keyTimes="0;0.5;1"
            dur="0.8849557522123893s"
            repeatCount="indefinite"
          />
        </circle>
      </g>
    </svg>
  </div>
</template>

<style lang="scss">
.loader {
  display: flex;
  justify-content: center;
  align-items: center;
  --size: 100px;
  --color: var(--black);
  &__svg {
    margin: 0 auto;
    display: block;
    width: var(--size);
    height: var(--size);
    g {
      circle {
        fill: var(--color);
      }
    }
  }
}
</style>
