function startCompass() {
  if (typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission().then(state => {
      if (state === 'granted') {
        window.addEventListener('deviceorientation', handleOrientation);
      } else {
        alert('Compass access denied.');
      }
    }).catch(console.error);
  } else {
    // fallback for other browsers/devices
    window.addEventListener('deviceorientationabsolute', handleOrientation);
    window.addEventListener('deviceorientation', handleOrientation);
  }
}

function handleOrientation(e) {
  const alpha = e.alpha ?? (e.webkitCompassHeading !== undefined ? e.webkitCompassHeading : null);
  if (alpha !== null) {
    const azimuth = (e.webkitCompassHeading !== undefined) ? e.webkitCompassHeading : alpha;
    rotateNeedle(azimuth);
  } else {
    document.getElementById('heading').textContent = '❌ Magnetic data not available.';
  }
}

function rotateNeedle(azimuth) {
  const rounded = Math.round(azimuth);
  const direction = getDirectionFromAzimuth(azimuth);
  const avoid = getOppositeDirection(direction);

  document.getElementById('needle').style.transform = `rotate(${azimuth}deg)`;
  document.getElementById('heading').textContent = `🧭 Magnetic Direction: ${direction} (${rounded}°)`;
  document.getElementById('advice').textContent = `✅ Sleep facing **${direction}**.\n🚫 Avoid **${avoid}**.`;
}
