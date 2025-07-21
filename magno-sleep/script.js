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
    // iOS
    DeviceOrientationEvent.requestPermission().then(permissionState => {
      if (permissionState === 'granted') {
        window.addEventListener("deviceorientation", handleOrientation);
      } else {
        alert("Compass access denied.");
      }
    });
  } else {
    // Android
    window.addEventListener("deviceorientationabsolute", handleOrientation);
  }
}

function handleOrientation(e) {
  if (e.alpha !== null) {
    const azimuth = e.alpha;
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

// Hook up button
document.getElementById("enable-sensors").addEventListener("click", startCompass);

// Geolocation
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
