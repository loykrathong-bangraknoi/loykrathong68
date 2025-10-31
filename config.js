// config.js
// เลือกโหมดการเก็บข้อมูล: 'local' (ค่าเริ่มต้น) หรือ 'firebase'
window.AppConfig = {
  storageType: 'local',
  firebase: {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_AUTH_DOMAIN',
    projectId: 'YOUR_PROJECT_ID',
    appId: 'YOUR_APP_ID'
  }
}
