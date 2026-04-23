const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export const getImageUrl = (path: string | undefined): string => {
  if (!path) return "/placeholder.png";
  if (path.startsWith("http")) return path;
  
  // ໃຫ້ໝັ້ນໃຈວ່າ prefix ຕົງກັບທີ່ຕັ້ງໃນ Backend ('/uploads/')
  const cleanPath = path.startsWith("/") ? path.substring(1) : path;
  
  // ຖ້າໃນ DB ບໍ່ມີຄຳວ່າ uploads ຕິດມາ, ໃຫ້ຕື່ມໃສ່ບ່ອນນີ້
  if (!cleanPath.startsWith("uploads/")) {
     return `http://localhost:3000/uploads/${cleanPath}`;
  }
  
  return `http://localhost:3000/${cleanPath}`;
};