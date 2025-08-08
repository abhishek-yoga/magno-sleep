function getDirectionFromAzimuth(deg) {
  if (deg >= 315 || deg <= 45) return 'North';
  if (deg > 45 && deg <= 135) return 'East';
  if (deg > 135 && deg <= 225) return 'South';
  if (deg > 225 && deg < 315) return 'West';
  return 'Unknown';
}

function getOppositeDirection(direction) {
  switch (direction) {
    case 'North': return 'South';
    case 'South': return 'North';
    case 'East': return 'West';
    case 'West': return 'East';
    default: return 'Unknown';
  }
}

function startCompass() {
  if (typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function') {
    DeviceOrientationEvent.requestPermission().then(state => {
      if (state === 'granted') {
        window.addEventListener('deviceorientation', handleOrientation, true);
      } else {
        alert('Compass access denied.');
      }
    }).catch(console.error);
  } else {
    window.addEventListener('deviceorientationabsolute', handleOrientation, true);
    window.addEventListener('deviceorientation', handleOrientation, true);
  }
}

function handleOrientation(e) {
  let azimuth = null;

  if (e.webkitCompassHeading !== undefined) {
    azimuth = e.webkitCompassHeading; // iOS
  } else if (e.alpha !== null) {
    azimuth = 360 - e.alpha; // Android
  }

  if (azimuth !== null) {
    const rounded = Math.round(azimuth);
    const direction = getDirectionFromAzimuth(azimuth);
    const avoid = getOppositeDirection(direction);

    const needle = document.getElementById("needle");
    if (needle) {
      needle.style.transform = `rotate(${azimuth}deg)`;
    }

    document.getElementById("heading").textContent =
      `🧭 Magnetic Direction: ${direction} (${rounded}°)`;
    document.getElementById("advice").textContent =
      `✅ Sleep with your head facing **${direction}**.\n🚫 Avoid sleeping with head towards **${avoid}**.`;
  } else {
    document.getElementById("heading").textContent = "❌ Magnetic data not available.";
  }
}

document.getElementById("enable-sensors").addEventListener("click", startCompass);

navigator.geolocation.getCurrentPosition(
  (pos) => {
    const { latitude, longitude } = pos.coords;
    document.getElementById("location").textContent =
      `📍 Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`;
  },
  (err) => {
    document.getElementById("location").textContent = "❌ Location access denied.";
  }
);
