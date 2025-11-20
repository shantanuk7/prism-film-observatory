// Converts total seconds to "HH:MM:SS"
export const secondsToTime = (totalSeconds) => {
  if (isNaN(totalSeconds)) return "00:00:00";
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  
  // Pad with leading zeros
  const pad = (num) => num.toString().padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
};

// Converts "HH:MM:SS" or "MM:SS" to total seconds
export const timeToSeconds = (timeString) => {
  if (!timeString) return 0;
  const parts = timeString.split(':').map(Number);
  // Handle MM:SS and HH:MM:SS
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 0;
};

export const checkOverlap = (startStr, endStr, currentSceneId, allScenes) => {
  const start = timeToSeconds(startStr);
  const end = timeToSeconds(endStr);

  if (start >= end) return { isOverlap: true, message: "End time must be after start time." };

  const conflict = allScenes.find(scene => {
    // Skip the scene we are currently editing (if any)
    if (scene._id === currentSceneId) return false;

    const sStart = timeToSeconds(scene.startTime);
    const sEnd = timeToSeconds(scene.endTime);

    // Overlap logic: (StartA < EndB) and (EndA > StartB)
    return (start < sEnd && end > sStart);
  });

  if (conflict) {
    return { 
      isOverlap: true, 
      message: `Overlaps with Scene ${conflict.sceneNumber} (${conflict.startTime} - ${conflict.endTime})` 
    };
  }

  return { isOverlap: false, message: '' };
};