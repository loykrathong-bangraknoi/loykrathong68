// storage.js (PRO)
(function(){
  const t = window.AppConfig?.storageType || 'local'

  async function localSave(item){
    const key = 'loy-wishes'
    const arr = JSON.parse(localStorage.getItem(key) || '[]')
    const payload = { text: (item.text||'').slice(0,200), ts: Date.now(), style: item.style || 1 }
    arr.push(payload)
    localStorage.setItem(key, JSON.stringify(arr))
    const lid = Math.random().toString(36).slice(2,8)
    const mapKey = 'loy-map'
    const map = JSON.parse(localStorage.getItem(mapKey) || '{}')
    map[lid] = payload
    localStorage.setItem(mapKey, JSON.stringify(map))
    return { id: lid }
  }
  async function localGetAll(){ return JSON.parse(localStorage.getItem('loy-wishes') || '[]').sort((a,b)=>b.ts-a.ts) }
  async function localGetAllDetailed(){ return localGetAll() }
  async function localGetById(id){ const map = JSON.parse(localStorage.getItem('loy-map') || '{}'); return map[id] || null }

  async function ensureFirebase(){
    if (window._fbReady) return
    await Promise.all([
      import('https://www.gstatic.com/firebasejs/10.12.3/firebase-app-compat.js'),
      import('https://www.gstatic.com/firebasejs/10.12.3/firebase-auth-compat.js'),
      import('https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore-compat.js'),
    ])
    const cfg = window.AppConfig.firebase
    firebase.initializeApp(cfg)
    await firebase.auth().signInAnonymously()
    window._db = firebase.firestore()
    window._fbReady = true
  }

  async function firebaseSave(item){ await ensureFirebase(); const ref = await window._db.collection('loyWishes').add({ text:(item.text||'').slice(0,200), style:item.style||1, ts:Date.now() }); return { id: ref.id } }
  async function firebaseGetAll(){ await ensureFirebase(); const snap = await window._db.collection('loyWishes').orderBy('ts','desc').limit(2000).get(); return snap.docs.map(d=>d.data()) }
  async function firebaseGetAllDetailed(){ await ensureFirebase(); const snap = await window._db.collection('loyWishes').orderBy('ts','desc').limit(2000).get(); return snap.docs.map(d=>({ id:d.id, ...d.data() })) }
  async function firebaseGetById(id){ await ensureFirebase(); const doc = await window._db.collection('loyWishes').doc(id).get(); return doc.exists ? doc.data() : null }

  window.Storage = {
    async save(item){ return t==='firebase' ? firebaseSave(item) : localSave(item) },
    async getAll(){ return t==='firebase' ? firebaseGetAll() : localGetAll() },
    async getAllDetailed(){ return t==='firebase' ? firebaseGetAllDetailed() : localGetAllDetailed() },
    async getById(id){ return t==='firebase' ? firebaseGetById(id) : localGetById(id) }
  }
})()
