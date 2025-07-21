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

// Get User Location
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

// Compass Rotation
window.addEventListener("deviceorientationabsolute", (e) => {
  if (e.alpha !== null) {
    const azimuth = e.alpha; // compass heading
    const rounded = Math.round(azimuth);
    const direction = getDirectionFromAzimuth(azimuth);
    const avoid = getOppositeDirection(direction);

    // Rotate needle
    const needle = document.getElementById("needle");
    if (needle) {
      needle.style.transform = `rotate(${azimuth}deg)`;
    }

    // Update text
    document.getElementById("heading").textContent =
      `🧭 Magnetic Direction: ${direction} (${rounded}°)`;

    document.getElementById("advice").textContent =
      `✅ Sleep with your head facing **${direction}**.\n🚫 Avoid sleeping with head towards **${avoid}**.`;
  } else {
    document.getElementById("heading").textContent =
      "❌ Magnetic data not available.";
  }
});
