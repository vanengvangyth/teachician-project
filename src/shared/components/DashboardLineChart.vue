<template>
  <div class="bg-gradient-to-br from-white to-slate-50/50 border border-slate-100 p-6 rounded-2xl shadow-xs hover:shadow-md transition-all duration-300">
    <!-- Chart Header -->
    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <div class="p-1.5 bg-slate-100 rounded-lg text-slate-600">
            <TrendingUp class="w-4 h-4" />
          </div>
          <h3 class="text-base font-semibold text-slate-800 font-sans">ແນວໂນ້ມ ແລະ ສະຖິຕິ</h3>
        </div>
        <p class="text-xs text-slate-400">{{ periodDescriptions }}</p>
      </div>

      <!-- Quick Metrics Overview & Toggle -->
      <div class="flex flex-wrap items-center gap-3">
        <!-- Period Selector (Week / Month / Year) -->
        <div class="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl">
          <button
            v-for="period in periods"
            :key="period.id"
            @click="activePeriod = period.id"
            class="px-2.5 py-1 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer"
            :class="
              activePeriod === period.id
                ? 'bg-white text-slate-800 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            "
          >
            {{ period.label }}
          </button>
        </div>

        <!-- Growth Badge for the latest period -->
        <div 
          v-if="latestGrowth !== undefined" 
          class="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-xl font-semibold border transition-all duration-300"
          :class="latestGrowth >= 0 ? 'bg-emerald-50/50 border-emerald-100/80 text-emerald-600' : 'bg-rose-50/50 border-rose-100/80 text-rose-600'"
        >
          <ArrowUpRight v-if="latestGrowth >= 0" class="w-3.5 h-3.5" />
          <ArrowDownRight v-else class="w-3.5 h-3.5" />
          <span>{{ latestGrowth >= 0 ? '+' : '-' }}{{ Math.abs(latestGrowth) }}% {{ periodGrowthLabels }}</span>
        </div>

        <!-- Metric Toggles -->
        <div class="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl">
          <button
            v-for="metric in metrics"
            :key="metric.id"
            @click="activeMetricId = metric.id"
            class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 cursor-pointer text-slate-500 hover:text-slate-800"
            :class="
              activeMetricId === metric.id
                ? 'bg-white text-slate-800 shadow-xs font-semibold'
                : ''
            "
          >
            <component 
              :is="metric.icon" 
              class="w-3.5 h-3.5" 
              :style="{ color: activeMetricId === metric.id ? metric.color : 'inherit' }"
            />
            <span>{{ metric.label }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Chart Container -->
    <div class="relative w-full h-[260px]" ref="chartContainer" @mousemove="handleMouseMove" @mouseleave="handleMouseLeave">
      <!-- Grid, Axis and Curves -->
      <svg
        class="w-full h-full overflow-visible"
        :viewBox="`0 0 ${width} ${height}`"
        preserveAspectRatio="none"
      >
        <!-- Gradients and Filters Definitions -->
        <defs>
          <linearGradient :id="`areaGradient-${activeMetric.id}`" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" :stop-color="activeMetric.color" stop-opacity="0.22" />
            <stop offset="100%" :stop-color="activeMetric.color" stop-opacity="0.00" />
          </linearGradient>
          
          <!-- Drop Shadow filter for premium glowing stroke -->
          <filter :id="`glow-${activeMetric.id}`" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="5" :flood-color="activeMetric.color" flood-opacity="0.22" />
          </filter>
        </defs>

        <!-- Y Axis Gridlines (dashed and subtle) -->
        <line
          v-for="lineVal in gridLines"
          :key="lineVal"
          x1="40"
          :y1="getY(lineVal)"
          :x2="width - 15"
          :y2="getY(lineVal)"
          stroke="#E2E8F0"
          stroke-opacity="0.7"
          stroke-width="1"
          stroke-dasharray="6 6"
        />

        <!-- Hover Guideline with gradient vertical line -->
        <line
          v-if="hoveredPoint"
          :x1="hoveredPoint.x"
          y1="15"
          :x2="hoveredPoint.x"
          :y2="height - 30"
          :stroke="activeMetric.color"
          stroke-width="1.5"
          stroke-dasharray="3 3"
          stroke-opacity="0.8"
          class="transition-all duration-150"
        />

        <!-- Area Path with Fill Gradient -->
        <path
          :d="areaPath"
          :fill="`url(#areaGradient-${activeMetric.id})`"
          class="transition-all duration-500 ease-out"
        />

        <!-- Main Trend Line with drop shadow glow -->
        <path
          :d="bezierPath"
          fill="none"
          :stroke="activeMetric.color"
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
          :filter="`url(#glow-${activeMetric.id})`"
          class="transition-all duration-500 ease-out"
        />

        <!-- Subtle static data points -->
        <circle
          v-for="(point, idx) in points"
          :key="idx"
          :cx="point.x"
          :cy="point.y"
          r="3"
          fill="#FFFFFF"
          :stroke="activeMetric.color"
          stroke-width="2.2"
          class="transition-all duration-300"
        />

        <!-- Interactive Hover Glow Dot -->
        <g v-if="hoveredPoint" class="transition-all duration-150">
          <circle
            :cx="hoveredPoint.x"
            :cy="hoveredPoint.y"
            r="9"
            :fill="activeMetric.color"
            fill-opacity="0.25"
          />
          <circle
            :cx="hoveredPoint.x"
            :cy="hoveredPoint.y"
            r="4.5"
            fill="#FFFFFF"
            :stroke="activeMetric.color"
            stroke-width="3"
          />
        </g>

        <!-- X Axis Labels -->
        <text
          v-for="(point, idx) in points"
          :key="`lbl-${idx}`"
          :x="point.x"
          :y="height - 8"
          text-anchor="middle"
          fill="#64748B"
          font-size="10.5"
          class="font-sans font-medium pointer-events-none select-none"
        >
          {{ point.label }}
        </text>

        <!-- Y Axis Labels -->
        <text
          v-for="lineVal in gridLines"
          :key="`ylbl-${lineVal}`"
          x="8"
          :y="getY(lineVal) + 3.5"
          fill="#94A3B8"
          font-size="9"
          class="font-sans font-semibold pointer-events-none select-none"
        >
          {{ formatYVal(lineVal) }}
        </text>
      </svg>

      <!-- Float Tooltip Card (Glassmorphism design) -->
      <div
        v-if="hoveredPoint"
        class="absolute z-10 bg-slate-900/90 backdrop-blur-md text-white rounded-xl px-3.5 py-2.5 shadow-xl border border-slate-700/50 text-xs transition-all duration-150 ease-out pointer-events-none font-sans min-w-[110px]"
        :style="{
          left: `${tooltipX}px`,
          top: `${tooltipY}px`,
          transform: 'translate(-50%, -100%)',
          marginTop: '-14px'
        }"
      >
        <div class="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1">{{ hoveredPoint.label }}</div>
        <div class="flex items-center justify-between gap-3">
          <span class="font-bold text-sm text-white">
            {{ activeMetric.format ? activeMetric.format(hoveredPoint.value) : hoveredPoint.value }}
          </span>
          <span
            v-if="hoveredPoint.growth !== undefined"
            class="text-[9px] px-1.5 py-0.5 rounded font-bold"
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
import { ref, computed, watch } from 'vue';
import { Briefcase, Users, Wrench, ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-vue-next';

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
const height = 260;

const chartContainer = ref<HTMLElement | null>(null);
const hoveredIndex = ref<number | null>(null);
const tooltipX = ref(0);
const tooltipY = ref(0);
const activeMetricId = ref('jobs');
const activePeriod = ref('month'); // 'week' | 'month' | 'year'

const periods = [
  { id: 'week', label: 'ອາທິດ' },
  { id: 'month', label: 'ເດືອນ' },
  { id: 'year', label: 'ປີ' }
];

const periodDescriptions = computed(() => {
  if (activePeriod.value === 'week') return 'ສະແດງການເຕີບໂຕ ແລະ ການເຄື່ອນໄຫວແຕ່ລະວັນໃນອາທິດ';
  if (activePeriod.value === 'year') return 'ສະແດງການເຕີບໂຕ ແລະ ການເຄື່ອນໄຫວແຕ່ລະປີ';
  return 'ສະແດງການເຕີບໂຕ ແລະ ການເຄື່ອນໄຫວແຕ່ລະເດືອນ';
});

const periodGrowthLabels = computed(() => {
  if (activePeriod.value === 'week') return 'ອາທິດນີ້';
  if (activePeriod.value === 'year') return 'ປີນີ້';
  return 'ເດືອນນີ້';
});

// Reset hoveredIndex when activeMetricId or activePeriod changes to prevent UI misalignment
watch([activeMetricId, activePeriod], () => {
  hoveredIndex.value = null;
});

// Color palettes and base trends for different metrics and periods
const metrics = computed(() => {
  const data = {
    jobs: {
      week: [
        { label: 'ຈັນ', base: 0.40, growth: 10 },
        { label: 'ອັງຄານ', base: 0.55, growth: 15 },
        { label: 'ພຸດ', base: 0.38, growth: -12 },
        { label: 'ພະຫັດ', base: 0.70, growth: 25 },
        { label: 'ສຸກ', base: 0.85, growth: 18 },
        { label: 'ເສົາ', base: 0.90, growth: 8 },
        { label: 'ອາທິດ', base: 1.00, growth: 5 }
      ],
      month: [
        { label: 'ທັນວາ', base: 0.35, growth: 5 },
        { label: 'ມັງກອນ', base: 0.50, growth: 12 },
        { label: 'ກຸມພາ', base: 0.42, growth: -8 },
        { label: 'ມີນາ', base: 0.65, growth: 22 },
        { label: 'ເມສາ', base: 0.78, growth: 15 },
        { label: 'ພຶດສະພາ', base: 1.00, growth: 18 }
      ],
      year: [
        { label: '2021', base: 0.30, growth: 8 },
        { label: '2022', base: 0.48, growth: 20 },
        { label: '2023', base: 0.60, growth: 12 },
        { label: '2024', base: 0.75, growth: 15 },
        { label: '2025', base: 0.90, growth: 10 },
        { label: '2026', base: 1.00, growth: 12 }
      ]
    },
    users: {
      week: [
        { label: 'ຈັນ', base: 0.50, growth: 5 },
        { label: 'ອັງຄານ', base: 0.60, growth: 8 },
        { label: 'ພຸດ', base: 0.65, growth: 4 },
        { label: 'ພະຫັດ', base: 0.72, growth: 10 },
        { label: 'ສຸກ', base: 0.80, growth: 8 },
        { label: 'ເສົາ', base: 0.92, growth: 12 },
        { label: 'ອາທິດ', base: 1.00, growth: 6 }
      ],
      month: [
        { label: 'ທັນວາ', base: 0.40, growth: 8 },
        { label: 'ມັງກອນ', base: 0.52, growth: 10 },
        { label: 'ກຸມພາ', base: 0.62, growth: 14 },
        { label: 'ມີນາ', base: 0.70, growth: 8 },
        { label: 'ເມສາ', base: 0.85, growth: 15 },
        { label: 'ພຶດສະພາ', base: 1.00, growth: 12 }
      ],
      year: [
        { label: '2021', base: 0.35, growth: 15 },
        { label: '2022', base: 0.50, growth: 18 },
        { label: '2023', base: 0.68, growth: 22 },
        { label: '2024', base: 0.80, growth: 12 },
        { label: '2025', base: 0.92, growth: 10 },
        { label: '2026', base: 1.00, growth: 8 }
      ]
    },
    techs: {
      week: [
        { label: 'ຈັນ', base: 0.30, growth: 2 },
        { label: 'ອັງຄານ', base: 0.42, growth: 8 },
        { label: 'ພຸດ', base: 0.55, growth: 10 },
        { label: 'ພະຫັດ', base: 0.50, growth: -5 },
        { label: 'ສຸກ', base: 0.75, growth: 20 },
        { label: 'ເສົາ', base: 0.88, growth: 12 },
        { label: 'ອາທິດ', base: 1.00, growth: 8 }
      ],
      month: [
        { label: 'ທັນວາ', base: 0.30, growth: 4 },
        { label: 'ມັງກອນ', base: 0.45, growth: 15 },
        { label: 'ກຸມພາ', base: 0.55, growth: 12 },
        { label: 'ມີນາ', base: 0.60, growth: 5 },
        { label: 'ເມສາ', base: 0.80, growth: 25 },
        { label: 'ພຶດສະພາ', base: 1.00, growth: 10 }
      ],
      year: [
        { label: '2021', base: 0.25, growth: 10 },
        { label: '2022', base: 0.40, growth: 15 },
        { label: '2023', base: 0.58, growth: 20 },
        { label: '2024', base: 0.70, growth: 12 },
        { label: '2025', base: 0.88, growth: 18 },
        { label: '2026', base: 1.00, growth: 10 }
      ]
    }
  };

  const periodKey = activePeriod.value as 'week' | 'month' | 'year';

  return [
    {
      id: 'jobs',
      label: 'ວຽກງານ',
      color: '#10B981', // Emerald
      icon: Briefcase,
      trend: data.jobs[periodKey],
      total: props.jobsCount || 42,
      format: (v: number) => `${v} ວຽກ`
    },
    {
      id: 'users',
      label: 'ຜູ້ໃຊ້',
      color: '#6366F1', // Indigo
      icon: Users,
      trend: data.users[periodKey],
      total: props.usersCount || 128,
      format: (v: number) => `${v} ຄົນ`
    },
    {
      id: 'techs',
      label: 'ຊ່າງ',
      color: '#F59E0B', // Amber
      icon: Wrench,
      trend: data.techs[periodKey],
      total: props.techsCount || 24,
      format: (v: number) => `${v} ທ່ານ`
    }
  ];
});

const activeMetric = computed(() => {
  const found = metrics.value.find(m => m.id === activeMetricId.value);
  return found || metrics.value[0]!;
});

const latestGrowth = computed(() => {
  const trend = activeMetric.value.trend;
  if (trend.length === 0) return 0;
  return trend[trend.length - 1]?.growth ?? 0;
});

// Dynamic values based on active metric's real totals
const trendValues = computed(() => {
  const m = activeMetric.value;
  return m.trend.map(t => {
    const totalVal = m.total || 50;
    const value = Math.max(1, Math.round(t.base * totalVal));
    return {
      label: t.label,
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
