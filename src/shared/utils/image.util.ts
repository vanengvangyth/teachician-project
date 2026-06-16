import { apiURL } from "../../global-variables";

const BASE_URL = (import.meta.env.VITE_API_URL ?? apiURL ?? "http://localhost:3000").replace(/\/$/, "");

export const getImageUrl = (path: string | undefined | null): string => {
  if (!path || path === "null" || path === "undefined" || String(path).trim() === "") {
    return "/placeholder.png";
  }
  if (path.startsWith("http")) return path;
  
  // ໃຫ້ໝັ້ນໃຈວ່າ prefix ຕົງກັບທີ່ຕັ້ງໃນ Backend ('/uploads/')
  const cleanPath = path.startsWith("/") ? path.substring(1) : path;
  
  // ຖ້າໃນ DB ບໍ່ມີຄຳວ່າ uploads ຕິດມາ, ໃຫ້ຕື່ມໃສ່ບ່ອນນີ້
  if (!cleanPath.startsWith("uploads/")) {
     return `${BASE_URL}/uploads/${cleanPath}`;
  }
  
  return `${BASE_URL}/${cleanPath}`;
};