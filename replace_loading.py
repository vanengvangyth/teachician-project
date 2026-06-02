import os
import re

workspace_dir = "/Users/vaneng/Desktop/graduation-frontend/src"

# The beautiful loading template to insert
new_loading_html = """      <!-- LOADING OVERLAY -->
      <div v-if="isLoading" class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center z-50">
        <div class="bg-white/80 p-6 rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center min-w-[140px]">
          <div class="w-10 h-10 border-4 border-slate-100 border-t-sky-500 rounded-full animate-spin mb-3"></div>
          <span class="text-xs font-bold text-slate-700 animate-pulse">ກຳລັງໂຫລດ...</span>
        </div>
      </div>"""

# Regex to match the old loading overlays
# This pattern matches <div v-if="isLoading" class="fixed inset-0 bg-black/... z-50"> ... Loading... ... </div>
old_loading_regex = re.compile(
    r'<\!\-\-\s*(?:LOADING|LOADING OVERLAY)\s*\-\->\s*<div\s+v-if="isLoading"\s+class="fixed\s+inset-0\s+bg-black/(?:30|40)\s+flex\s+items-center\s+justify-center\s+z-50">.*?</div>\s*</div>',
    re.DOTALL | re.IGNORECASE
)

# A fallback simpler regex just in case comments are different or structure varies slightly
fallback_regex = re.compile(
    r'<div\s+v-if="isLoading"\s+class="fixed\s+inset-0\s+bg-black/(?:30|40)\s+flex\s+items-center\s+justify-center\s+z-50">\s*<div\s+class="bg-white\s+px-6\s+py-4\s+rounded-lg\s+shadow[^"]*">\s*Loading\.\.\.\s*</div>\s*</div>',
    re.DOTALL | re.IGNORECASE
)

# Another variant where Loading... is not indented
variant_regex = re.compile(
    r'<div\s+v-if="isLoading"\s+class="fixed\s+inset-0\s+bg-black/(?:30|40)\s+flex\s+items-center\s+justify-center\s+z-50">\s*<div\s+class="bg-white\s+px-6\s+py-4\s+rounded-lg\s+shadow[^"]*">Loading\.\.\.</div>\s*</div>',
    re.DOTALL | re.IGNORECASE
)

modified_files = []

for root, dirs, files in os.walk(workspace_dir):
    for file in files:
        if file.endswith(".vue"):
            file_path = os.path.join(root, file)
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
            
            new_content = content
            
            # Try replacing with the regexes
            if old_loading_regex.search(new_content):
                new_content = old_loading_regex.sub(new_loading_html, new_content)
            
            if fallback_regex.search(new_content):
                new_content = fallback_regex.sub(new_loading_html, new_content)
                
            if variant_regex.search(new_content):
                new_content = variant_regex.sub(new_loading_html, new_content)
            
            if new_content != content:
                with open(file_path, "w", encoding="utf-8") as f:
                    f.write(new_content)
                modified_files.append(file_path)

print(f"Successfully updated {len(modified_files)} files:")
for f in modified_files:
    print(f" - {os.path.basename(f)}")
