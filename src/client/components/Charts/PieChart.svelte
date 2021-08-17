<script lang="ts">
  import type { PieChartConfig } from '../../../common/types';

  export let size = 0;
  export let pieConfig: PieChartConfig = null;

  const getPaths = (datasets) => {
    if (!datasets) {
      return [];
    }

    const paths = [];
    let cumulativePercentage = 0;
    function getCoordinatesForPercentage(percentage) {
      const x = Math.cos(2 * Math.PI * percentage) * (size / 3);
      const y = Math.sin(2 * Math.PI * percentage) * (size / 3);
      return [x, y];
    }

    datasets
      .filter((x) => x.percentage)
      .sort((a, b) => b.percentage - a.percentage)
      .forEach(({ percentage, label, color }) => {
        const [startX, startY] =
          getCoordinatesForPercentage(cumulativePercentage);
        cumulativePercentage += percentage;
        const [endX, endY] = getCoordinatesForPercentage(cumulativePercentage);
        const largeArcFlag = percentage > 0.5 ? 1 : 0;
        const points = [
          `M ${startX} ${startY}`, // Move
          `A ${size / 3} ${size / 3} 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
          'L 0 0', // Line
        ].join(' ');
        paths.push({
          points,
          startX,
          startY,
          label,
          color,
        });
      });
    return paths;
  };

  $: paths = getPaths(pieConfig?.datasets || null);
</script>

{#if pieConfig}
  <div class="pie-chart">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="pie"
      width={size}
      height={size}
      viewBox={`-${size / 3} -${size / 3} ${(size * 2) / 3} ${(size * 2) / 3}`}
    >
      {#each paths as path, index (index)}
        <path d={path.points} fill={path.color}>{path.label}</path>
      {/each}
    </svg>
    <div class="legend-container">
      {#each pieConfig?.datasets as set}
        {#if set.percentage}
          <div class="legend">
            <span style="color: {set.color}">●</span>
            {set.label} - {(set.percentage * 100).toFixed(2)}%
          </div>
        {/if}
      {/each}
    </div>
  </div>
{/if}

<style>
  .pie-chart {
    display: flex;
    flex-direction: column;
  }
  .pie {
    border-radius: 50%;
    transform: rotate(-90deg);
    margin: 0 auto;
    flex: 1;
  }
  .legend-container {
    margin: 15px auto;
    display: flex;
    flex-wrap: wrap;
  }
  .legend:not(:last-child) {
    margin-right: 15px;
  }
</style>
