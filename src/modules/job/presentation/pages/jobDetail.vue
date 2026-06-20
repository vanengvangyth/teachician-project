<template>
  <div class="min-h-screen p-6 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg max-h-[60vh] overflow-y-auto">
    <!-- Header -->
    <div class="flex items-center justify-between p-6 border-b bg-white rounded-t-xl shadow-sm">
      <div class="flex items-center gap-4">
        <button @click="goBack"
          class="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition flex items-center gap-1 cursor-pointer font-sans text-sm font-semibold">
          ກັບຄືນ
        </button>
        <h1 class="text-2xl font-bold text-slate-800 font-sans">ລາຍລະອຽດວຽກ</h1>
      </div>
    </div>

    <!-- Content Card -->
    <div class="bg-white rounded-b-xl border-t border-slate-100 p-6 shadow-sm">
      <div v-if="isLoading" class="text-center py-10 text-slate-500 font-sans text-sm">ກຳລັງໂຫລດຂໍ້ມູນ...</div>
      <div v-else-if="!job" class="text-center py-10 text-slate-500 font-sans text-sm">ບໍ່ພົບຂໍ້ມູນວຽກນີ້</div>
      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8">

        <!-- Left Side: Basic Info (7 columns on large screens) -->
        <div class="lg:col-span-7 space-y-6 font-sans">

          <!-- Title & Status -->
          <div class="space-y-3">
            <div class="flex flex-wrap items-center gap-3">
              <span class="text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm"
                :class="statusClass(job.status)">
                {{ job.status || 'open' }}
              </span>
              <span v-if="job.postedAgo"
                class="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                ⏱️ {{ job.postedAgo }}
              </span>
            </div>
            <h2 class="text-3xl font-extrabold text-slate-800 leading-tight">{{ job.title }}</h2>
            <div class="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
              <p>ລະຫັດວຽກ: <span class="font-semibold text-slate-600">#{{ job.jobId }}</span></p>
            </div>
          </div>

          <!-- Description Section -->
          <div class="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <h3 class="text-base font-semibold text-slate-800 mb-2">ລາຍລະອຽດ:</h3>
            <p class="text-slate-700 leading-relaxed whitespace-pre-wrap">{{ job.description || '-' }}</p>
          </div>

          <!-- Basic Metadata Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
            <div class="flex flex-col p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span class="text-xs text-slate-600 font-medium">ເວລາປະເມີນ</span>
              <span class="text-slate-800 text-lg font-bold mt-1">{{ job.estimatedDuration }} ຊົ່ວໂມງ</span>
            </div>

            <div class="flex flex-col p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span class="text-xs text-slate-600 font-medium">ວັນທີ່ສ້າງ</span>
              <span class="text-slate-600 text-base font-semibold mt-1">
                {{ job.createdAt ? new Date(job.createdAt).toLocaleString('lo-LA') : '-' }}
              </span>
            </div>

            <div class="flex flex-col p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span class="text-xs text-slate-600 font-medium">ວັນທີ່ແກ້ໄຂ</span>
              <span class="text-slate-600 text-base font-semibold mt-1">
                {{ job.updatedAt ? new Date(job.updatedAt).toLocaleString('lo-LA') : '-' }}
              </span>
            </div>

            <div v-if="job.deletedAt" class="flex flex-col p-3 bg-red-50 rounded-lg border border-red-100">
              <span class="text-xs text-red-500 font-medium">ວັນທີ່ລຶບ</span>
              <span class="text-red-700 text-base font-semibold mt-1">
                {{ new Date(job.deletedAt).toLocaleString('lo-LA') }}
              </span>
            </div>
          </div>

          <!-- Cancellation Section (Show if cancelled or has data) -->
          <div v-if="job.status === 'cancelled' || job.cancellationReason || job.canelledByuserId"
            class="bg-red-50/50 rounded-xl p-4 border border-red-100/60 space-y-2">
            <h3 class="text-base font-semibold text-red-800 flex items-center gap-1.5">
              🚫 ຂໍ້ມູນການຍົກເລີກ
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              <div>
                <span class="text-slate-500">ເຫດຜົນ:</span>
                <p class="text-red-700 font-semibold mt-0.5">{{ job.cancellationReason || '-' }}</p>
              </div>
              <div v-if="job.canelledByuserId">
                <span class="text-slate-500">ຍົກເລີກໂດຍລະຫັດຜູ້ໃຊ້:</span>
                <p class="text-slate-800 font-mono font-bold mt-0.5">#{{ job.canelledByuserId }}</p>
              </div>
            </div>
          </div>

          <!-- Category Card -->
          <div v-if="job.category" class="bg-emerald-50/30 rounded-xl p-5 border border-emerald-100/60 space-y-4">
            <h3 class="text-lg font-bold text-emerald-800 flex items-center gap-2">
              🗂️ ຂໍ້ມູນປະເພດວຽກ
            </h3>
            <div class="flex flex-col sm:flex-row gap-4 items-start">
              <div v-if="job.category.iconUrl"
                class="w-16 h-16 rounded-xl bg-white border border-emerald-100 flex items-center justify-center p-2 flex-shrink-0 shadow-sm">
                <img :src="getImageUrl(job.category.iconUrl)" alt="Category Icon" class="w-full h-full object-contain"
                  @error="(e: any) => { (e.target as HTMLImageElement).style.display = 'none'; }" />
              </div>
              <div class="space-y-3 flex-1 min-w-0">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span class="text-xs text-slate-600 block font-medium">ຊື່ປະເພດ (ລາວ)</span>
                    <span class="text-slate-800 font-bold text-base">{{ job.category.nameLao || '-' }}</span>
                  </div>
                  <div>
                    <span class="text-xs text-slate-600 block font-medium">ຊື່ປະເພດ (ອັງກິດ)</span>
                    <span class="text-slate-800 font-bold text-base">{{ job.category.nameEng || '-' }}</span>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-emerald-100/30">
                  <div>
                    <span class="text-xs text-slate-600 block font-medium">ລາຍລະອຽດ (ລາວ)</span>
                    <p class="text-slate-600 text-sm leading-relaxed">{{ job.category.descriptionLao || '-' }}</p>
                  </div>
                  <div>
                    <span class="text-xs text-slate-600 block font-medium">ລາຍລະອຽດ (ອັງກິດ)</span>
                    <p class="text-slate-600 text-sm leading-relaxed">{{ job.category.descriptionEng || '-' }}</p>
                  </div>
                </div>

                <div class="text-xs text-slate-600 pt-1">
                  ລະຫັດປະເພດ: <span class="font-mono font-bold text-slate-600">#{{ job.category.id }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- User Card (Creator) -->
          <div v-if="job.user" class="bg-blue-50/30 rounded-xl p-5 border border-blue-100/60 space-y-4">
            <h3 class="text-lg font-bold text-blue-800 flex items-center gap-2">
              👤 ຂໍ້ມູນຜູ້ໂພສວຽກ
            </h3>
            <div class="flex flex-col sm:flex-row gap-4 items-start">
              <!-- Profile Avatar -->
              <div class="flex-shrink-0">
                <img v-if="job.user.profileImageUrl" :src="getImageUrl(job.user.profileImageUrl)" alt="Profile"
                  class="w-16 h-16 rounded-full border border-blue-100 shadow-sm object-cover"
                  @error="(e: any) => { (e.target as HTMLImageElement).style.display = 'none'; }" />
                <div v-else
                  class="w-16 h-16 rounded-full bg-blue-100 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-xl uppercase shadow-sm">
                  {{ job.user.fullName ? job.user.fullName[0] : 'U' }}
                </div>
              </div>

              <!-- User Details Grid -->
              <div class="flex-1 min-w-0 space-y-3">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                  <div>
                    <span class="text-xs text-slate-600 block font-medium">ຊື່ລູກຄ້າ</span>
                    <span class="text-slate-800 font-bold">{{ job.user.fullName || '-' }}</span>
                  </div>
                  <div>
                    <span class="text-xs text-slate-600 block font-medium">ອີເມວ</span>
                    <span class="text-slate-600 break-all">{{ job.user.email || '-' }}</span>
                  </div>
                  <div>
                    <span class="text-xs text-slate-600 block font-medium">ເບີໂທລະສັບ</span>
                    <span class="text-slate-700 font-semibold">{{ job.user.phone || '-' }}</span>
                  </div>
                  <div>
                    <span class="text-xs text-slate-600 block font-medium">ບົດບາດ (Role) / ລະດັບສິດ (Permission)</span>
                    <div class="flex items-center gap-1.5 mt-0.5">
                      <span class="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        {{ job.user.role || '-' }}
                      </span>
                      <span
                        class="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        {{ job.user.permission || '-' }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="text-xs text-slate-600 pt-2 border-t border-blue-100/30">
                  ລະຫັດຜູ້ໃຊ້: <span class="font-mono font-bold text-slate-600">#{{ job.user.id }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Worker Information Section (If assigned) -->
          <div v-if="job.workerId || parsedWorker"
            class="bg-indigo-50/40 rounded-xl p-5 border border-indigo-100/60 space-y-4 font-sans">
            <h3
              class="text-base font-bold text-indigo-800 flex items-center gap-1.5 border-l-4 border-indigo-500 pl-2.5">
              🔧 ຂໍ້ມູນຄົນງານທີ່ຮັບວຽກ
            </h3>

            <div v-if="parsedWorker" class="flex flex-col sm:flex-row gap-4 items-start">
              <!-- Avatar -->
              <div class="flex-shrink-0">
                <img v-if="parsedWorker.profileImageUrl" :src="getImageUrl(parsedWorker.profileImageUrl)"
                  alt="Worker Profile"
                  class="w-16 h-16 rounded-full border border-indigo-100 shadow-sm object-cover cursor-pointer hover:scale-105 transition"
                  @click="openAttachmentPreview(getImageUrl(parsedWorker.profileImageUrl), 'image/png', parsedWorker.fullName)"
                  @error="(e: any) => { (e.target as HTMLImageElement).style.display = 'none'; }" />
                <div v-else
                  class="w-16 h-16 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-xl uppercase shadow-sm">
                  {{ parsedWorker.fullName ? parsedWorker.fullName[0] : 'W' }}
                </div>
              </div>

              <!-- Details Grid -->
              <div class="flex-1 min-w-0 space-y-3">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                  <div>
                    <span class="text-xs text-slate-500 block font-medium">ຊື່ຄົນງານ</span>
                    <span class="text-slate-800 font-bold text-base">{{ parsedWorker.fullName || '-' }}</span>
                  </div>
                  <div v-if="parsedWorker.email">
                    <span class="text-xs text-slate-500 block font-medium">ອີເມວ</span>
                    <span class="text-slate-600 break-all text-sm font-medium">{{ parsedWorker.email }}</span>
                  </div>
                  <div v-if="parsedWorker.phone">
                    <span class="text-xs text-slate-500 block font-medium">ເບີໂທລະສັບ</span>
                    <span class="text-slate-700 font-semibold text-sm">{{ parsedWorker.phone }}</span>
                  </div>
                  <div v-if="parsedWorker.role">
                    <span class="text-xs text-slate-500 block font-medium">ບົດບາດ (Role)</span>
                    <span
                      class="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase inline-block mt-0.5">
                      {{ parsedWorker.role }}
                    </span>
                  </div>
                </div>

                <div
                  class="text-xs text-slate-400 pt-2 border-t border-indigo-100/45 flex justify-between items-center">
                  <span>ລະຫັດຄົນງານ: <span class="font-mono font-bold text-slate-600">#{{ job.workerId ||
                    parsedWorker.id || '-' }}</span></span>
                </div>
              </div>
            </div>

            <!-- Fallback if only workerId is present but parsedWorker is null -->
            <div v-else class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                W
              </div>
              <div>
                <span class="text-slate-500 block text-xs">ລະຫັດຄົນງານ</span>
                <span class="text-indigo-950 font-mono font-bold text-base">#{{ job.workerId }}</span>
              </div>
            </div>
          </div>

        </div>

        <!-- Right Side: Location, Map & Attachments (5 columns on large screens) -->
        <div class="lg:col-span-5 space-y-6 font-sans">

          <!-- Location Info -->
          <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
            <h3 class="text-base font-bold text-slate-800 flex items-center gap-1">📍 ສະຖານທີ່</h3>
            <p class="text-slate-700 text-base leading-relaxed">{{ job.location || '-' }}</p>

            <!-- Map Container -->
            <div class="relative w-full overflow-hidden rounded-xl border border-slate-200 shadow-md">
              <div ref="mapContainer" class="w-full h-64 z-0"></div>
            </div>

            <!-- Lat & Long display -->
            <div class="grid grid-cols-2 gap-4 text-xs bg-white p-3 rounded-lg border border-slate-100 shadow-inner">
              <div>
                <span class="text-slate-600 font-medium">Latitude</span>
                <div class="font-mono text-slate-800 mt-0.5 font-bold">{{ job.latitude || '-' }}</div>
              </div>
              <div>
                <span class="text-slate-600 font-medium">Longitude</span>
                <div class="font-mono text-slate-800 mt-0.5 font-bold">{{ job.longitude || '-' }}</div>
              </div>
            </div>
          </div>

          <!-- Media Attachments Card -->
          <div v-if="job.attachments" class="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
            <h3 class="text-base font-bold text-slate-800 flex items-center gap-1.5">
              📎 ໄຟລ໌ຄັດຕິດ (Attachments)
            </h3>

            <!-- Handle Array -->
            <div v-if="Array.isArray(job.attachments)" class="space-y-3">
              <div v-for="att in job.attachments" :key="att.attachmentId"
                class="border border-slate-200/60 rounded-xl p-3 bg-white flex items-center gap-3 shadow-sm hover:shadow transition duration-200">

                <!-- Image Preview -->
                <div v-if="isImage(att.fileUrl, att.fileType)"
                  @click="openAttachmentPreview(att.fileUrl, att.fileType, getFileName(att.fileUrl))"
                  class="w-14 h-14 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 flex-shrink-0 flex items-center justify-center cursor-pointer relative group/img">
                  <img :src="att.fileUrl" class="w-full h-full object-cover hover:scale-110 transition duration-300" />
                  <div
                    class="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-xs">
                    🔍
                  </div>
                </div>

                <!-- File Icon -->
                <div v-else @click="openAttachmentPreview(att.fileUrl, att.fileType, getFileName(att.fileUrl))"
                  class="w-14 h-14 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-500 text-2xl flex-shrink-0 cursor-pointer hover:bg-sky-100 transition relative group/file">
                  📄
                  <div
                    class="absolute inset-0 bg-black/10 opacity-0 group-hover/file:opacity-100 transition-opacity flex items-center justify-center text-white text-xs rounded-lg">
                    👁️
                  </div>
                </div>

                <div class="min-w-0 flex-1">
                  <p class="text-[10px] font-mono text-slate-600 font-bold">ID: #{{ att.attachmentId }}</p>
                  <p class="text-xs font-bold text-slate-700 truncate" :title="getFileName(att.fileUrl)">
                    {{ getFileName(att.fileUrl) }}
                  </p>
                  <div class="flex items-center gap-2 mt-1">
                    <span v-if="att.fileType"
                      class="text-[10px] text-slate-600 font-medium border border-slate-200 px-1.5 py-0.25 rounded">
                      {{ att.fileType }}
                    </span>
                    <button @click="openAttachmentPreview(att.fileUrl, att.fileType, getFileName(att.fileUrl))"
                      class="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline inline-flex items-center gap-0.5 cursor-pointer">
                      ເບິ່ງຕົວຢ່າງ 👁️
                    </button>
                    <a :href="att.fileUrl" target="_blank"
                      class="text-[10px] font-semibold text-slate-400 hover:text-slate-600 flex items-center gap-0.5 ml-1">
                      ເປີດແທັບໃໝ່ ↗
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <!-- Handle Single Object -->
            <div v-else
              class="border border-slate-200/60 rounded-xl p-3 bg-white flex items-center gap-3 shadow-sm hover:shadow transition duration-200">
              <!-- Image Preview -->
              <div v-if="isImage(job.attachments.fileUrl, job.attachments.fileType)"
                @click="openAttachmentPreview(job.attachments.fileUrl, job.attachments.fileType, getFileName(job.attachments.fileUrl))"
                class="w-14 h-14 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 flex-shrink-0 flex items-center justify-center cursor-pointer relative group/img">
                <img :src="job.attachments.fileUrl"
                  class="w-full h-full object-cover hover:scale-110 transition duration-300" />
                <div
                  class="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white text-xs">
                  🔍
                </div>
              </div>

              <!-- File Icon -->
              <div v-else
                @click="openAttachmentPreview(job.attachments.fileUrl, job.attachments.fileType, getFileName(job.attachments.fileUrl))"
                class="w-14 h-14 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-500 text-2xl flex-shrink-0 cursor-pointer hover:bg-sky-100 transition relative group/file">
                📄
                <div
                  class="absolute inset-0 bg-black/10 opacity-0 group-hover/file:opacity-100 transition-opacity flex items-center justify-center text-white text-xs rounded-lg">
                  👁️
                </div>
              </div>

              <div class="min-w-0 flex-1">
                <p class="text-[10px] font-mono text-slate-600 font-bold">ID: #{{ job.attachments.attachmentId }}</p>
                <p class="text-xs font-bold text-slate-700 truncate" :title="getFileName(job.attachments.fileUrl)">
                  {{ getFileName(job.attachments.fileUrl) }}
                </p>
                <div class="flex items-center gap-2 mt-1">
                  <span v-if="job.attachments.fileType"
                    class="text-[10px] text-slate-600 font-medium border border-slate-200 px-1.5 py-0.25 rounded">
                    {{ job.attachments.fileType }}
                  </span>
                  <button
                    @click="openAttachmentPreview(job.attachments.fileUrl, job.attachments.fileType, getFileName(job.attachments.fileUrl))"
                    class="text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline inline-flex items-center gap-0.5 cursor-pointer">
                    ເບິ່ງຕົວຢ່າງ 👁️
                  </button>
                  <a :href="job.attachments.fileUrl" target="_blank"
                    class="text-[10px] font-semibold text-slate-400 hover:text-slate-600 flex items-center gap-0.5 ml-1">
                    ເປີດແທັບໃໝ່ ↗
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>

    <!-- ATTACHMENT PREVIEW MODAL -->
    <div v-if="isPreviewOpen" @click="closeAttachmentPreview"
      class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div
        class="relative w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl bg-white shadow-2xl border border-slate-100 flex flex-col animate-in fade-in zoom-in-95 duration-200"
        @click.stop>
        <!-- Header -->
        <div class="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 font-sans">
          <span class="font-bold text-slate-800 text-base truncate max-w-[80%]">{{ previewName || "ເບິ່ງຕົວຢ່າງໄຟລ໌"
            }}</span>
          <button @click="closeAttachmentPreview"
            class="p-1.5 hover:bg-slate-200 text-slate-500 rounded-lg transition cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
              stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content Area -->
        <div
          class="flex-1 overflow-y-auto p-6 bg-slate-100 flex items-center justify-center min-h-[40vh] max-h-[60vh] font-sans">
          <!-- Image -->
          <img v-if="isImage(previewUrl, previewType)" :src="previewUrl" alt="Attachment Preview"
            class="max-w-full max-h-[55vh] object-contain rounded-lg shadow-sm" />

          <!-- PDF -->
          <iframe v-else-if="previewType.toLowerCase().includes('pdf') || previewUrl.toLowerCase().endsWith('.pdf')"
            :src="previewUrl" class="w-full h-[55vh] rounded-lg shadow-sm bg-white" border="0">
          </iframe>

          <!-- Other files -->
          <div v-else
            class="text-center py-10 bg-white rounded-xl p-8 border border-slate-200 shadow-sm max-w-md w-full">
            <div class="text-5xl mb-4">📄</div>
            <h4 class="font-bold text-slate-800 text-lg mb-2">ບໍ່ສາມາດສະແດງຕົວຢ່າງໄຟລ໌ນີ້ໄດ້</h4>
            <p class="text-sm text-slate-500 mb-6 font-medium">ໄຟລ໌ປະເພດນີ້ບໍ່ຮອງຮັບການເປີດເບິ່ງຕົວຢ່າງໂດຍກົງ</p>
            <div class="flex gap-3 justify-center">
              <a :href="previewUrl" download
                class="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-xl transition shadow-md shadow-sky-200 font-bold">
                ດາວໂຫຼດໄຟລ໌
              </a>
              <a :href="previewUrl" target="_blank"
                class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition font-bold">
                ເປີດໃນແທັບໃໝ່ ↗
              </a>
            </div>
          </div>
        </div>

        <!-- Footer / Action bar -->
        <div class="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 font-sans">
          <a :href="previewUrl" target="_blank"
            class="px-4 py-2 border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl text-sm font-bold transition flex items-center gap-1.5">
            ເປີດໃນແທັບໃໝ່ ↗
          </a>
          <a :href="previewUrl" download
            class="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-bold shadow-md shadow-sky-200 transition flex items-center gap-1.5">
            ດາວໂຫຼດ
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { JobRepositoryImpl } from "../../infrastructure/repositories/job.repository.impl";
import { GetOneJobUseCase } from "../../application/use-cases/get-one-jobs.usecase";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getImageUrl } from "../../../../shared/utils/image.util";

// Fix Vite asset loader issues for default Leaflet markers
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerIconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIconUrl,
  iconRetinaUrl: markerIconRetinaUrl,
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const route = useRoute();
const router = useRouter();
const repo = new JobRepositoryImpl();
const getOneUseCase = new GetOneJobUseCase(repo);

const isLoading = ref(true);
const job = ref<any>(null);
const mapContainer = ref<HTMLElement | null>(null);
let map: L.Map | null = null;

const isPreviewOpen = ref(false);
const previewUrl = ref("");
const previewType = ref("");
const previewName = ref("");

const parsedWorker = computed(() => {
  if (!job.value) return null;
  const workerData = job.value.worker;
  if (!workerData) return null;

  if (typeof workerData === "string") {
    try {
      return JSON.parse(workerData);
    } catch (e) {
      return { fullName: workerData };
    }
  }
  return workerData;
});

const openAttachmentPreview = (url: string, type: string | undefined, name: string) => {
  previewUrl.value = url;
  previewType.value = type || "";
  previewName.value = name;
  isPreviewOpen.value = true;
};

const closeAttachmentPreview = () => {
  isPreviewOpen.value = false;
  previewUrl.value = "";
  previewType.value = "";
  previewName.value = "";
};

const goBack = () => {
  router.push("/job");
};

function statusClass(status: string) {
  const mapClasses: any = {
    open: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-amber-100 text-amber-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return mapClasses[status] ?? 'bg-slate-100 text-slate-600';
}

const isImage = (url: string, type?: string) => {
  if (type && type.startsWith("image/")) return true;
  if (url) {
    const ext = url.split(".").pop()?.toLowerCase();
    return ["jpg", "jpeg", "png", "webp", "gif", "svg"].includes(ext || "");
  }
  return false;
};

const getFileName = (url: string) => {
  if (!url) return "Unknown File";
  return url.substring(url.lastIndexOf("/") + 1);
};

const loadJob = async () => {
  try {
    isLoading.value = true;
    const id = Number(route.params.id);
    const res: any = await getOneUseCase.execute(id);
    const data = res.data?.data || res.data;
    if (data && data.user) {
      console.log('[jobDetail] raw user fields:', JSON.stringify(data.user));
      data.user.profileImageUrl =
        data.user.profileImageUrl ??
        data.user.profile_image_url ??
        data.user.avatarUrl ??
        data.user.avatar ??
        data.user.image_url ??
        null;
      console.log('[jobDetail] resolved profileImageUrl:', data.user.profileImageUrl);
    }
    if (data && data.category) {
      console.log('[jobDetail] raw category fields:', JSON.stringify(data.category));
      data.category.iconUrl =
        data.category.iconUrl ??
        data.category.icon_url ??
        data.category.icon ??
        null;
      console.log('[jobDetail] resolved iconUrl:', data.category.iconUrl);
    }
    job.value = data;

    // Load map after data is fetched
    setTimeout(() => {
      initMap();
    }, 100);
  } catch (error) {
    console.error("Fetch job detail failed:", error);
  } finally {
    isLoading.value = false;
  }
};

const initMap = () => {
  if (!mapContainer.value || !job.value) return;

  const lat = Number(job.value.latitude) || 17.9757;
  const lng = Number(job.value.longitude) || 102.6331;

  map = L.map(mapContainer.value).setView([lat, lng], 15);

  L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics',
      maxZoom: 19,
    }
  ).addTo(map);

  // Place a static marker
  L.marker([lat, lng]).addTo(map)
    .bindPopup(`<b>${job.value.title}</b><br>${job.value.location || ''}`)
    .openPopup();
};

onMounted(loadJob);
</script>
