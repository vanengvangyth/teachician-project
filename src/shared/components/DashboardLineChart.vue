<template>
  <div class="bg-white border border-slate-200 p-6 rounded-xl shadow-sm transition-all duration-300 hover:shadow-md">
    <!-- Chart Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h3 class="text-base font-semibold text-slate-800 font-sans">ແນວໂນ້ມ ແລະ ສະຖິຕິ</h3>
        <p class="text-xs text-slate-400 mt-1">ສະແດງການເຕີບໂຕ ແລະ ການເຄື່ອນໄຫວແຕ່ລະເດືອນ</p>
      </div>

      <!-- Metric Toggles -->
      <div class="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg self-start">
        <button
          v-for="metric in metrics"
          :key="metric.id"
          @click="activeMetricId = metric.id"
          class="px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 cursor-pointer animate-none text-slate-500 hover:text-slate-800"
          :class="
            activeMetricId === metric.id
              ? 'bg-white text-slate-800 shadow-sm font-semibold'
              : ''
          "
        >
          <span class="flex items-center gap-1">
            <span
              class="w-2 h-2 rounded-full"
              :style="{ backgroundColor: metric.color }"
            ></span>
            {{ metric.label }}
          </span>
        </button>
      </div>
    </div>

    <!-- Chart Container -->
    <div class="relative w-full h-[220px]" ref="chartContainer" @mousemove="handleMouseMove" @mouseleave="handleMouseLeave">
      <!-- Grid, Axis and Curves -->
      <svg
        class="w-full h-full overflow-visible"
        :viewBox="`0 0 ${width} ${height}`"
        preserveAspectRatio="none"
      >
        <!-- Gradients Definitions -->
        <defs>
          <linearGradient :id="`areaGradient-${activeMetric.id}`" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" :stop-color="activeMetric.color" stop-opacity="0.25" />
            <stop offset="100%" :stop-color="activeMetric.color" stop-opacity="0.00" />
          </linearGradient>
        </defs>

        <!-- Y Axis Gridlines -->
        <line
          v-for="lineVal in gridLines"
          :key="lineVal"
          x1="30"
          :y1="getY(lineVal)"
          :x2="width - 10"
          :y2="getY(lineVal)"
          stroke="#E2E8F0"
          stroke-width="1"
          stroke-dasharray="4 4"
        />

        <!-- Hover Guideline -->
        <line
          v-if="hoveredPoint"
          :x1="hoveredPoint.x"
          y1="10"
          :x2="hoveredPoint.x"
          :y2="height - 25"
          :stroke="activeMetric.color"
          stroke-width="1.5"
          stroke-dasharray="3 3"
          class="transition-all duration-150"
        />

        <!-- Area Path with Fill Gradient -->
        <path
          :d="areaPath"
          :fill="`url(#areaGradient-${activeMetric.id})`"
          class="transition-all duration-500 ease-out"
        />

        <!-- Main Trend Line -->
        <path
          :d="bezierPath"
          fill="none"
          :stroke="activeMetric.color"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="transition-all duration-500 ease-out"
        />

        <!-- Data Points (Always visible small dots) -->
        <circle
          v-for="(point, idx) in points"
          :key="idx"
          :cx="point.x"
          :cy="point.y"
          r="4"
          fill="#FFFFFF"
          :stroke="activeMetric.color"
          stroke-width="2"
          class="transition-all duration-300"
        />

        <!-- Interactive Hover Glow Dot -->
        <g v-if="hoveredPoint" class="transition-all duration-150">
          <circle
            :cx="hoveredPoint.x"
            :cy="hoveredPoint.y"
            r="8"
            :fill="activeMetric.color"
            fill-opacity="0.3"
          />
          <circle
            :cx="hoveredPoint.x"
            :cy="hoveredPoint.y"
            r="4.5"
            fill="#FFFFFF"
            :stroke="activeMetric.color"
            stroke-width="3.5"
          />
        </g>

        <!-- X Axis Labels -->
        <text
          v-for="(point, idx) in points"
          :key="`lbl-${idx}`"
          :x="point.x"
          :y="height - 5"
          text-anchor="middle"
          fill="#94A3B8"
          font-size="10"
          class="font-sans font-medium pointer-events-none select-none"
        >
          {{ point.label }}
        </text>

        <!-- Y Axis Labels -->
        <text
          v-for="lineVal in gridLines"
          :key="`ylbl-${lineVal}`"
          x="5"
          :y="getY(lineVal) + 3"
          fill="#94A3B8"
          font-size="9"
          class="font-sans font-medium pointer-events-none select-none"
        >
          {{ formatYVal(lineVal) }}
        </text>
      </svg>

      <!-- Float Tooltip Card -->
      <div
        v-if="hoveredPoint"
        class="absolute z-10 bg-slate-900 text-white rounded-lg px-3 py-2 shadow-lg border border-slate-800 text-xs transition-all duration-150 ease-out pointer-events-none font-sans"
        :style="{
          left: `${tooltipX}px`,
          top: `${tooltipY}px`,
          transform: 'translate(-50%, -100%)',
          marginTop: '-12px'
        }"
      >
        <div class="text-slate-400 font-medium mb-0.5">{{ hoveredPoint.label }}</div>
        <div class="flex items-center gap-2">
          <span class="font-bold text-sm text-white">
            {{ activeMetric.format ? activeMetric.format(hoveredPoint.value) : hoveredPoint.value }}
          </span>
          <span
            v-if="hoveredPoint.growth !== undefined"
            class="text-[10px] px-1 rounded font-semibold"
            :class="hoveredPoint.growth >= 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'"
          >
            {{ hoveredPoint.growth >= 0 ? '+' : '' }}{{ hoveredPoint.growth }}%
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface MetricProps {
  usersCount?: number;
  jobsCount?: number;
  techsCount?: number;
}

const props = withDefaults(defineProps<MetricProps>(), {
  usersCount: 0,
  jobsCount: 0,
  techsCount: 0,
});

// Dimensions of SVG view box
const width = 600;
const height = 220;

const chartContainer = ref<HTMLElement | null>(null);
const hoveredIndex = ref<number | null>(null);
const tooltipX = ref(0);
const tooltipY = ref(0);
const activeMetricId = ref('jobs');

// Color palettes for different metrics
const metrics = computed(() => [
  {
    id: 'jobs',
    label: 'ວຽກງານ',
    color: '#10B981', // Emerald
    trend: [
      { month: 'ທັນວາ', base: 0.35, growth: 5 },
      { month: 'ມັງກອນ', base: 0.50, growth: 12 },
      { month: 'ກຸມພາ', base: 0.42, growth: -8 },
      { month: 'ມີນາ', base: 0.65, growth: 22 },
      { month: 'ເມສາ', base: 0.78, growth: 15 },
      { month: 'ພຶດສະພາ', base: 1.00, growth: 18 }
    ],
    total: props.jobsCount || 42,
    format: (v: number) => `${v} ວຽກ`
  },
  {
    id: 'users',
    label: 'ຜູ້ໃຊ້',
    color: '#6366F1', // Indigo
    trend: [
      { month: 'ທັນວາ', base: 0.40, growth: 8 },
      { month: 'ມັງກອນ', base: 0.52, growth: 10 },
      { month: 'ກຸມພາ', base: 0.62, growth: 14 },
      { month: 'ມີນາ', base: 0.70, growth: 8 },
      { month: 'ເມສາ', base: 0.85, growth: 15 },
      { month: 'ພຶດສະພາ', base: 1.00, growth: 12 }
    ],
    total: props.usersCount || 128,
    format: (v: number) => `${v} ຄົນ`
  },
  {
    id: 'techs',
    label: 'ຊ່າງ',
    color: '#F59E0B', // Amber
    trend: [
      { month: 'ທັນວາ', base: 0.30, growth: 4 },
      { month: 'ມັງກອນ', base: 0.45, growth: 15 },
      { month: 'ກຸມພາ', base: 0.55, growth: 12 },
      { month: 'ມີນາ', base: 0.60, growth: 5 },
      { month: 'ເມສາ', base: 0.80, growth: 25 },
      { month: 'ພຶດສະພາ', base: 1.00, growth: 10 }
    ],
    total: props.techsCount || 24,
    format: (v: number) => `${v} ທ່ານ`
  }
]);

const activeMetric = computed(() => {
  const found = metrics.value.find(m => m.id === activeMetricId.value);
  return found || metrics.value[0]!;
});

// Dynamic values based on active metric's real totals
const trendValues = computed(() => {
  const m = activeMetric.value;
  return m.trend.map(t => {
    const totalVal = m.total || 50;
    const value = Math.max(1, Math.round(t.base * totalVal));
    return {
      label: t.month,
      value,
      growth: t.growth
    };
  });
});

// Min and Max for scaling
const maxValue = computed(() => {
  const max = Math.max(...trendValues.value.map(d => d.value));
  return Math.ceil((max || 10) * 1.15); // Add 15% padding at top
});

// Gridlines (4 lines)
const gridLines = computed(() => {
  const max = maxValue.value;
  return [
    Math.round(max * 0.25),
    Math.round(max * 0.50),
    Math.round(max * 0.75),
    max
  ];
});

// Coordinates calculations
const getX = (index: number) => {
  const paddingLeft = 40;
  const paddingRight = 20;
  const usableWidth = width - paddingLeft - paddingRight;
  return paddingLeft + (index / (trendValues.value.length - 1)) * usableWidth;
};

const getY = (val: number) => {
  const paddingTop = 20;
  const paddingBottom = 30;
  const usableHeight = height - paddingTop - paddingBottom;
  const ratio = val / (maxValue.value || 1);
  return height - paddingBottom - ratio * usableHeight;
};

const points = computed(() => {
  return trendValues.value.map((d, idx) => ({
    x: getX(idx),
    y: getY(d.value),
    label: d.label,
    value: d.value,
    growth: d.growth
  }));
});

// Computed hovered point to ensure absolute type safety in template
const hoveredPoint = computed(() => {
  if (hoveredIndex.value === null) return null;
  return points.value[hoveredIndex.value] || null;
});

// Cubic Bezier curve algorithm for premium visual curve smoothing
const bezierPath = computed(() => {
  const pts = points.value;
  if (pts.length === 0) return '';
  const firstPt = pts[0];
  if (!firstPt) return '';
  if (pts.length === 1) return `M ${firstPt.x} ${firstPt.y}`;

  let d = `M ${firstPt.x} ${firstPt.y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i];
    const p1 = pts[i + 1];
    if (!p0 || !p1) continue;

    // Control points: placing horizontally at 1/3 and 2/3 between start and end
    const cp1x = p0.x + (p1.x - p0.x) / 3;
    const cp1y = p0.y;
    const cp2x = p0.x + 2 * (p1.x - p0.x) / 3;
    const cp2y = p1.y;

    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
  }
  return d;
});

// Path for filled area below the curve
const areaPath = computed(() => {
  const lPath = bezierPath.value;
  const pts = points.value;
  if (!lPath || pts.length === 0) return '';
  const firstPt = pts[0];
  const lastPt = pts[pts.length - 1];
  if (!firstPt || !lastPt) return '';
  
  // Bottom line offset for layout text padding
  const bottomY = height - 30;
  return `${lPath} L ${lastPt.x} ${bottomY} L ${firstPt.x} ${bottomY} Z`;
});

// Helper for compact Y label values
function formatYVal(v: number) {
  if (v >= 1000) return (v / 1000).toFixed(1) + 'k';
  return v.toString();
}

// Mouse event handlers
function handleMouseMove(e: MouseEvent) {
  if (!chartContainer.value) return;
  const rect = chartContainer.value.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;

  // Convert mouse client X to SVG viewport scale (600 width)
  const svgX = (mouseX / rect.width) * width;

  // Find the closest point index
  let closestIdx = 0;
  let minDiff = Infinity;

  points.value.forEach((p, idx) => {
    const diff = Math.abs(p.x - svgX);
    if (diff < minDiff) {
      minDiff = diff;
      closestIdx = idx;
    }
  });

  hoveredIndex.value = closestIdx;

  // Calculate tooltip placement (percentage-based relative to container)
  const targetPoint = points.value[closestIdx];
  if (targetPoint) {
    tooltipX.value = (targetPoint.x / width) * rect.width;
    tooltipY.value = (targetPoint.y / height) * rect.height;
  }
}

function handleMouseLeave() {
  hoveredIndex.value = null;
}
</script>
