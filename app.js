// app.js (PRO)
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('launchBtn')
  const input = document.getElementById('wish')
  const river = document.getElementById('river')
  const picker = document.getElementById('picker')
  const shareBox = document.getElementById('shareBox')
  const shareLinkEl = document.getElementById('shareLink')
  const copyBtn = document.getElementById('copyBtn')
  const nativeShareBtn = document.getElementById('nativeShareBtn')
  const toast = document.getElementById('toast')

  let styleId = 1

  function random(min, max){ return Math.random()*(max-min)+min }
  function setToast(msg){
    toast.textContent = msg
    toast.style.display = 'block'
    setTimeout(()=> toast.style.display = 'none', 1600)
  }
  function imgForStyle(id){ return `assets/krathong${id}.png` }
  function renderKrathong(text, id){
    const el = document.createElement('div')
    el.className = 'krathong'
    el.style.setProperty('--duration', `${random(16,24)}s`)
    el.style.bottom = `${random(0, 70)}px`
    el.style.left = `-140px`
    el.innerHTML = `<img class="emoji" src="${imgForStyle(id)}" alt="krathong"><div class="text"></div>`
    el.querySelector('.text').textContent = text
    river.appendChild(el)
    setTimeout(() => el.remove(), 26000)
  }
  function buildIdUrl(id){
    const url = new URL(window.location.href)
    url.searchParams.clear()
    url.searchParams.set('id', id)
    return url.toString()
  }

  async function launch(){
    const text = (input.value || 'สุขใจทุกคืนวันเพ็ญ 🌕').trim().slice(0,120)
    input.value = ''
    const res = await window.Storage.save({ text, style: styleId })
    const id = res?.id || ''
    renderKrathong(text, styleId)

    const link = id ? buildIdUrl(id) : location.href
    shareLinkEl.textContent = link
    shareBox.style.display = 'block'

    nativeShareBtn.onclick = async () => {
      if (navigator.share){
        try{ await navigator.share({ title: 'ลอยกระทงออนไลน์', text: text, url: link }) }catch(e){}
      }else{ setToast('อุปกรณ์นี้ไม่รองรับ Web Share API') }
    }
    copyBtn.onclick = async () => {
      try{ await navigator.clipboard.writeText(link); setToast('คัดลอกลิงก์แล้ว ✔') }
      catch(e){ setToast('คัดลอกไม่สำเร็จ') }
    }
  }

  picker?.querySelectorAll('button').forEach(b => {
    b.addEventListener('click', () => {
      picker.querySelectorAll('button').forEach(x=>x.classList.remove('active'))
      b.classList.add('active'); styleId = Number(b.dataset.style||'1')
    })
  })

  const params = new URLSearchParams(window.location.search)
  const id = params.get('id')
  if (id){
    window.Storage.getById(id).then(doc => {
      if (doc){
        styleId = Number(doc.style || 1)
        renderKrathong(String(doc.text||'').slice(0,120), styleId)
        const link = buildIdUrl(id)
        shareLinkEl.textContent = link
        shareBox.style.display = 'block'
      }
    })
  }

  btn.addEventListener('click', launch)
  input.addEventListener('keydown', e => { if (e.key === 'Enter'){ launch() } })
})
