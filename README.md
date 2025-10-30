# ลอยกระทงออนไลน์ – เวอร์ชัน Auto GitHub Pages
- พร้อมไฟล์ Workflow สำหรับดีพลอยขึ้น **GitHub Pages** อัตโนมัติ
- ต่อหลังบ้านได้ผ่าน **Google Apps Script** (บันทึกลง Google Sheet)

## ใช้งานด่วน
1) ใส่ URL ของ Web App ใน `config.js`
2) สร้าง Repository ใหม่บน GitHub แล้วอัปโหลดไฟล์ทั้งหมด
3) เปิด **Settings → Pages → Build and deployment = GitHub Actions**
4) Push/Upload ไปที่สาขา `main` → ระบบจะดีพลอยอัตโนมัติ

## Backend
เปิด https://script.google.com → New project → วางโค้ดจาก `backend/apps_script.gs` → Deploy as Web App
