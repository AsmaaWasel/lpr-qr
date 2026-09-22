import { IdentityVisitorPayload } from "@/modules/types/ocr";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
const API = `${API_BASE}/identity-visitors`;

// OCR API endpoints - made configurable via environment variables
const OCR_ID_API =
  process.env.NEXT_PUBLIC_OCR_ID_API || "http://127.0.0.1:8003/process-id";
const OCR_LICENSE_API =
  process.env.NEXT_PUBLIC_OCR_LICENSE_API ||
  "http://127.0.0.1:8005/process-license";
const OCR_PASSPORT_API =
  process.env.NEXT_PUBLIC_OCR_PASSPORT_API ||
  "http://127.0.0.1:8002/process-passport";

// ========================
// NATIONAL ID OCR
// ========================
export const processNationalId = async (
  front_image: string,
  back_image: string,
) => {
  const res = await axios.post(OCR_ID_API, {
    front_image,
    back_image,
  });

  return res.data;
};

// ========================
// DRIVING LICENSE OCR
// ========================
export const processLicense = async (base64Image: string) => {
  // إزالة البادئة إذا وجدت (data:image/jpeg;base64,)
  const base64WithoutPrefix = base64Image.split(",")[1] || base64Image;

  // تحويل base64 إلى binary
  const byteCharacters = atob(base64WithoutPrefix);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "image/jpeg" });

  // إنشاء File object لإرساله كـ multipart/form-data
  const file = new File([blob], "license.jpg", { type: "image/jpeg" });

  const formData = new FormData();
  formData.append("image", file);

  const res = await axios.post(OCR_LICENSE_API, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// ========================
// PASSPORT OCR (تم التعديل - نفس طريقة رخصة القيادة)
// ========================
export const processPassport = async (base64Image: string) => {
  // إزالة البادئة إذا وجدت (data:image/jpeg;base64,)
  const base64WithoutPrefix = base64Image.split(",")[1] || base64Image;

  // تحويل base64 إلى binary
  const byteCharacters = atob(base64WithoutPrefix);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "image/jpeg" });

  // إنشاء File object لإرساله كـ multipart/form-data
  const file = new File([blob], "passport.jpg", { type: "image/jpeg" });

  const formData = new FormData();
  formData.append("file", file); // المفتاح "file" كما هو مطلوب من الـ API

  const res = await axios.post(OCR_PASSPORT_API, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  // نرجع extracted_data مباشرة لتكون متوافقة مع باقي الدوال
  return res.data.extracted_data || res.data;
};

// ========================
// SAVE IDENTITY VISITOR
// ========================
export const saveIdentityVisitor = async (data: IdentityVisitorPayload) => {
  const res = await axios.post(API, data);

  return res.data;
};
