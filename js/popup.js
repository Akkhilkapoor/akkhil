document.addEventListener('DOMContentLoaded', function () {
  // Popup HTML insert karo
  var popupHTML = `
    <div id="consultPopupOverlay" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.6); z-index:9998;"></div>
    <div id="consultPopup" style="display:none; position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); background:#fff; border-radius:12px; padding:30px; width:90%; max-width:400px; z-index:9999; box-shadow:0 10px 40px rgba(0,0,0,0.3); text-align:center; font-family:Arial, sans-serif;">
      <span id="consultPopupClose" style="position:absolute; top:10px; right:16px; cursor:pointer; font-size:22px; color:#999;">&times;</span>
      <h2 style="margin:10px 0; color:#1a1a1a; font-size:22px;">🎉 1st Consultation is FREE!</h2>
      <p style="color:#555; margin:10px 0 20px;">Get expert advice at no cost. Limited time offer — book your free consultation now.</p>
      <a href="/contact.html" style="display:inline-block; background:#2563eb; color:#fff; padding:12px 28px; border-radius:6px; text-decoration:none; font-weight:bold;">Book Now</a>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', popupHTML);

  var popup = document.getElementById('consultPopup');
  var overlay = document.getElementById('consultPopupOverlay');
  var closeBtn = document.getElementById('consultPopupClose');

  var showDelay = 3000; // 3 second baad popup dikhega
  var alreadyShown = sessionStorage.getItem('consultPopupShown');

  if (!alreadyShown) {
    setTimeout(function () {
      popup.style.display = 'block';
      overlay.style.display = 'block';
      sessionStorage.setItem('consultPopupShown', 'true');
    }, showDelay);
  }

  function closePopup() {
    popup.style.display = 'none';
    overlay.style.display = 'none';
  }

  closeBtn.addEventListener('click', closePopup);
  overlay.addEventListener('click', closePopup);
});
