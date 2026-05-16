"use client";

import { useEffect } from "react";

export default function ARPage() {
  useEffect(() => {
    const aframeScript = document.createElement("script");
    aframeScript.src =
      "https://aframe.io/releases/1.5.0/aframe.min.js";

    aframeScript.onload = () => {
      const mindarScript = document.createElement("script");
      mindarScript.src =
        "https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js";

      mindarScript.onload = () => {
        const scene = document.createElement("a-scene");

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

          <a-entity mindar-image-target="targetIndex: 0">

            <a-plane
              material="shader: flat; src: #flowerVideo"
              position="0 0 0"
              width="1"
              height="1"
            ></a-plane>

          </a-entity>
        `;

        document.body.appendChild(scene);

        // 動画再生強制
        setTimeout(() => {
          const video = document.getElementById(
            "flowerVideo"
          ) as HTMLVideoElement | null;

          if (video) {
            video.play().catch(console.error);
          }
        }, 1000);
      };

      document.body.appendChild(mindarScript);
    };

    document.body.appendChild(aframeScript);
  }, []);

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
      }}
    >
      Loading AR...
    </div>
  );
}