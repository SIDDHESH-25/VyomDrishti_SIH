#include "esp_camera.h"
#include <WiFi.h>
#include <WebServer.h>


// ==================================================
// WIFI CREDENTIALS
// ==================================================
const char* ssid = "Prince's S24 Ultra";
const char* password = "123454321";

WebServer server(80);

// ==================================================
// AI-THINKER ESP32-CAM PIN DEFINITION
// ==================================================
#define PWDN_GPIO_NUM     32
#define RESET_GPIO_NUM    -1
#define XCLK_GPIO_NUM      0
#define SIOD_GPIO_NUM     26
#define SIOC_GPIO_NUM     27
#define Y9_GPIO_NUM       35
#define Y8_GPIO_NUM       34
#define Y7_GPIO_NUM       39
#define Y6_GPIO_NUM       36
#define Y5_GPIO_NUM       21
#define Y4_GPIO_NUM       19
#define Y3_GPIO_NUM       18
#define Y2_GPIO_NUM        5
#define VSYNC_GPIO_NUM    25
#define HREF_GPIO_NUM     23
#define PCLK_GPIO_NUM     22

#define MIN_SAFE_HEAP 20000

// ==================================================
// IMAGE HANDLER
// ==================================================
void handleJpg() {
  uint32_t freeHeap = ESP.getFreeHeap();
  Serial.printf("Free heap: %u\n", freeHeap);

  if (freeHeap < MIN_SAFE_HEAP) {
    Serial.println("Free heap critically low, rebooting...");
    server.send(503, "text/plain", "Rebooting");
    delay(100);
    ESP.restart();
  }

  camera_fb_t * fb = esp_camera_fb_get();
  if (!fb) {
    server.send(500, "text/plain", "Camera capture failed");
    return;
  }

  // JPEG quality 15
  uint8_t * out_buf = NULL;
  size_t out_len = 0;
  bool jpeg_converted = frame2jpg(fb, 15, &out_buf, &out_len);

  esp_camera_fb_return(fb);

  if (!jpeg_converted) {
    server.send(500, "text/plain", "JPEG compression failed");
    return;
  }

  server.sendHeader("Connection", "close");
  server.sendHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  server.send_P(200, "image/jpeg", (const char *)out_buf, out_len);
  free(out_buf);
}

// ==================================================
// SETUP
// ==================================================
void setup() {
  Serial.begin(115200);
  delay(500);

  Serial.println("\n\n=== ESP32-CAM BOOTING ===");

  bool hasPsram = psramFound();
  Serial.print("PSRAM detected: ");
  Serial.println(hasPsram ? "YES" : "NO");

  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sscb_sda = SIOD_GPIO_NUM;
  config.pin_sscb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;

  config.pixel_format = PIXFORMAT_RGB565;

  // ==================================================
  // QQVGA (160x120) — best FPS for color tracking
  // ==================================================
  config.frame_size = FRAMESIZE_QQVGA;      // 160x120
  config.fb_count = 1;
  if (hasPsram) {
    config.fb_location = CAMERA_FB_IN_PSRAM;
  } else {
    config.fb_location = CAMERA_FB_IN_DRAM;
  }

  config.jpeg_quality = 15;

  if (esp_camera_init(&config) != ESP_OK) {
    Serial.println("❌ Camera init failed");
    return;
  }

  Serial.println("✅ Camera initialized at QQVGA (160x120)");

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  server.on("/cam-hi.jpg", handleJpg);
  server.begin();

  Serial.println("");
  Serial.print("✅ Camera Ready! Use 'http://");
  Serial.print(WiFi.localIP());
  Serial.println("/cam-hi.jpg' in Python");
  Serial.println("=========================================\n");
}

// ==================================================
// LOOP
// ==================================================
void loop() {
  server.handleClient();
  delay(1);
}