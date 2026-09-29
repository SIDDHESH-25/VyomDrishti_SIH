import cv2
import numpy as np
import urllib.request
import serial
import time
import sys

# ==================================================
# 1. CONFIGURATION
# ==================================================
ESP32_CAM_URL = 'http://10.227.46.100/cam-hi.jpg'   # ← YOUR ESP32-CAM IP
SERIAL_PORT   = 'COM6'                              # ← YOUR DevKit COM PORT
BAUD_RATE     = 115200

LOOP_DELAY    = 0.005
DISPLAY_SCALE = 4
WINDOW_NAME   = "HIM-KAVACH RED TRACKER"

MIN_AREA_ORIG = 200
SHOW_FPS = True

# ==================================================
# 2. INITIALIZE SERIAL
# ==================================================
try:
    esp32 = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=1)
    print(f"✅ Successfully connected to ESP32 DevKit on {SERIAL_PORT}")
    time.sleep(2)
except Exception as e:
    print(f"❌ CRITICAL ERROR: Could not open {SERIAL_PORT}.")
    print("   Make sure the Arduino IDE Serial Monitor is completely closed!")
    sys.exit(1)

print("🚀 Starting HIM-KAVACH Red Color Tracking...")
print(f"   Displaying at {DISPLAY_SCALE}x scale. Press 'Q' or ESC to quit.")

# HTTP opener
opener = urllib.request.build_opener()
opener.addheaders = [
    ('User-Agent', 'HIM-KAVACH-Tracker/1.0'),
    ('Connection', 'close'),
]

# ==================================================
# 3. WINDOW SETUP
# ==================================================
cv2.namedWindow(WINDOW_NAME, cv2.WINDOW_NORMAL | cv2.WINDOW_KEEPRATIO)
cv2.resizeWindow(WINDOW_NAME, 640, 480)

MORPH_KERNEL = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))

# FPS tracking
fps_frame_count = 0
fps_start_time = time.time()
fps_display = 0.0

# ==================================================
# 4. MAIN LOOP
# ==================================================
fail_count = 0
running = True

while running:
    try:
        img_resp = opener.open(ESP32_CAM_URL, timeout=5)
        data = img_resp.read()
        img_resp.close()
        fail_count = 0

        imgnp = np.frombuffer(data, dtype=np.uint8)
        frame = cv2.imdecode(imgnp, cv2.IMREAD_COLOR)

        if frame is None:
            time.sleep(0.01)
            continue

        # Upscale for viewing
        frame = cv2.resize(
            frame,
            (frame.shape[1] * DISPLAY_SCALE, frame.shape[0] * DISPLAY_SCALE),
            interpolation=cv2.INTER_NEAREST
        )

        height, width, _ = frame.shape
        centerX = width // 2
        centerY = height // 2

        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

        # ---- RED COLOR RANGE (two ranges because red wraps around H=180) ----
        lower_red1 = np.array([0, 120, 70])
        upper_red1 = np.array([10, 255, 255])
        lower_red2 = np.array([170, 120, 70])
        upper_red2 = np.array([180, 255, 255])

        mask1 = cv2.inRange(hsv, lower_red1, upper_red1)
        mask2 = cv2.inRange(hsv, lower_red2, upper_red2)
        mask = mask1 + mask2

        # Morphological cleanup
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, MORPH_KERNEL)
        mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, MORPH_KERNEL)

        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        target_found = False
        best_contour = None
        best_score = 0

        area_threshold = MIN_AREA_ORIG * (DISPLAY_SCALE ** 2)

        for cnt in contours:
            area = cv2.contourArea(cnt)
            if area < area_threshold:
                continue

            x, y, w, h = cv2.boundingRect(cnt)
            aspect_ratio = w / float(h) if h > 0 else 0
            if not (0.3 < aspect_ratio < 3.0):
                continue

            perimeter = cv2.arcLength(cnt, True)
            if perimeter == 0:
                continue
            circularity = 4 * np.pi * area / (perimeter * perimeter)

            hull = cv2.convexHull(cnt)
            hull_area = cv2.contourArea(hull)
            solidity = (area / hull_area) if hull_area > 0 else 0
            if solidity < 0.7:
                continue

            score = area * circularity * solidity
            if score > best_score:
                best_score = score
                best_contour = cnt

        # ---- Process best contour ----
        if best_contour is not None:
            target_found = True
            x, y, w, h = cv2.boundingRect(best_contour)
            cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

            objX = x + (w // 2)
            objY = y + (h // 2)

            errorX = int((objX - centerX) / DISPLAY_SCALE)
            errorY = int((objY - centerY) / DISPLAY_SCALE)

            try:
                command = f"<{errorX},{errorY}>\n"
                esp32.write(command.encode())
            except serial.SerialException:
                print("⚠️  Serial write failed — DevKit may be disconnected")

            cv2.circle(frame, (objX, objY), 8, (0, 0, 255), -1)
            cv2.line(frame, (centerX, centerY), (objX, objY), (255, 0, 0), 2)

            cv2.putText(frame, "LOCKED (RED)", (10, 25),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
            cv2.putText(frame, f"Err: ({errorX:+d},{errorY:+d})", (10, 50),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (200, 200, 200), 1)
        else:
            cv2.putText(frame, "SEARCHING...", (10, 25),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 165, 255), 2)

        # Center crosshair
        cv2.line(frame, (centerX - 15, centerY), (centerX + 15, centerY), (0, 255, 255), 2)
        cv2.line(frame, (centerX, centerY - 15), (centerX, centerY + 15), (0, 255, 255), 2)

        # FPS counter
        fps_frame_count += 1
        elapsed = time.time() - fps_start_time
        if elapsed >= 1.0:
            fps_display = fps_frame_count / elapsed
            fps_frame_count = 0
            fps_start_time = time.time()

        if SHOW_FPS:
            cv2.putText(frame, f"FPS: {fps_display:.1f}", (width - 130, 25),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 0), 2)
            cv2.putText(frame, f"Fails: {fail_count}", (width - 130, 50),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, (200, 200, 200), 1)

        # Mask preview in top-left corner
        mask_small = cv2.resize(mask, (160, 120))
        mask_bgr = cv2.cvtColor(mask_small, cv2.COLOR_GRAY2BGR)
        frame[0:120, 0:160] = mask_bgr

        cv2.imshow(WINDOW_NAME, frame)

        key = cv2.waitKey(1) & 0xFF
        if key == ord('q') or key == ord('Q') or key == 27:
            running = False
            break

        if cv2.getWindowProperty(WINDOW_NAME, cv2.WND_PROP_VISIBLE) < 1:
            running = False
            break

        time.sleep(LOOP_DELAY)

    except KeyboardInterrupt:
        print("\nUser interrupted (Ctrl+C)")
        running = False
        break

    except Exception as e:
        fail_count += 1
        print(f"Stream hiccup #{fail_count}, reconnecting... {e}")
        time.sleep(min(1.0 + fail_count * 0.5, 5.0))
        continue

# ==================================================
# 5. CLEAN SHUTDOWN
# ==================================================
cv2.destroyAllWindows()
cv2.waitKey(1)
if 'esp32' in locals() and esp32.is_open:
    esp32.close()
print("System Shutdown.")