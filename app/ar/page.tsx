"use client";

import { useEffect, useState } from "react";

export default function ARPage() {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;

    const aframeScript = document.createElement("script");
    aframeScript.src =
      "https://aframe.io/releases/1.5.0/aframe.min.js";

    aframeScript.onload = () => {
      const mindarScript = document.createElement("script");
      mindarScript.src =
        "https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js";

      mindarScript.onload = () => {
        const scene = document.createElement("a-scene");

        scene.style.position = "fixed";
        scene.style.top = "0";
        scene.style.left = "0";
        scene.style.width = "100vw";
        scene.style.height = "100vh";
        scene.style.zIndex = "1";

        scene.setAttribute(
          "mindar-image",
          "imageTargetSrc: /ar/targets.mind;"
        );

        scene.setAttribute("color-space", "sRGB");

        scene.setAttribute(
          "renderer",
          "colorManagement: true;"
        );

        scene.setAttribute(
          "vr-mode-ui",
          "enabled: false"
        );

        scene.setAttribute(
          "device-orientation-permission-ui",
          "enabled: false"
        );

        scene.innerHTML = `
          <a-assets>
            <video
              id="flowerVideo"
              src="/ar/flower.mp4"
              autoplay
              loop
              muted
              playsinline
              webkit-playsinline
              crossorigin="anonymous"
            ></video>
          </a-assets>

          <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

          <a-entity id="target" mindar-image-target="targetIndex: 0">

            <a-plane
              id="flowerPlane"
              material="shader: flat; src: #flowerVideo"
              position="0 0 0"
              width="1"
              height="1"
              visible="false"
            ></a-plane>

          </a-entity>
        `;

        document.body.appendChild(scene);

        // Loading消す
        const loadingUI =
          document.getElementById("loadingUI");

        if (loadingUI) {
          loadingUI.style.display = "none";
        }

        // 動画再生
        setTimeout(() => {
          const video = document.getElementById(
            "flowerVideo"
          ) as HTMLVideoElement | null;

          if (video) {
            video.play().catch(console.error);
          }
        }, 1000);

        // marker検出
        setTimeout(() => {
          const target =
            document.getElementById("target");

          const plane =
            document.getElementById("flowerPlane");

          if (!target || !plane) return;

          target.addEventListener("targetFound", () => {
            plane.setAttribute("visible", "true");
          });

          target.addEventListener("targetLost", () => {
            plane.setAttribute("visible", "false");
          });
        }, 1500);
      };

      document.body.appendChild(mindarScript);
    };

    document.body.appendChild(aframeScript);
  }, [started]);

  // Start画面
  if (!started) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          background: "black",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <div>Mother's Day AR</div>

        <button
          style={{
            padding: "16px 32px",
            fontSize: "18px",
            background: "white",
            color: "black",
            border: "none",
            borderRadius: "999px",
          }}
          onClick={async () => {
            const audio = new Audio("/audio/bgm.mp3");

            audio.loop = true;

            try {
              await audio.play();
            } catch (e) {
              console.error(e);
            }

            setStarted(true);
          }}
        >
          Touch to Begin
        </button>
      </div>
    );
  }

  // Loading画面
  return (
    <div
      id="loadingUI"
      style={{
        width: "100vw",
        height: "100vh",
        background: "black",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      Loading AR...
    </div>
  );
}