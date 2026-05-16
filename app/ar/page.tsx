"use client";

import { useEffect, useState, useRef } from "react";

export default function ARPage() {
  const [started, setStarted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

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

        // fullscreen
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
              loop
              muted
              playsinline
              webkit-playsinline
              crossorigin="anonymous"
            ></video>
          </a-assets>

          <a-camera
            position="0 0 0"
            look-controls="enabled: false"
          ></a-camera>

          <a-entity
            id="target"
            mindar-image-target="targetIndex: 0"
          >
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

        // target取得
        setTimeout(() => {
          const target =
            document.getElementById("target");

          const plane =
            document.getElementById("flowerPlane");

          const video = document.getElementById(
            "flowerVideo"
          ) as HTMLVideoElement | null;

          if (
            !target ||
            !plane ||
            !video
          )
            return;

          // marker認識
          target.addEventListener(
            "targetFound",
            async () => {
              plane.setAttribute(
                "visible",
                "true"
              );

              video.currentTime = 0;

              await video
                .play()
                .catch(console.error);

              if (audioRef.current) {
                audioRef.current.currentTime = 0;

                await audioRef.current
                  .play()
                  .catch(console.error);
              }
            }
          );

          // marker見失い
          target.addEventListener(
            "targetLost",
            () => {
              plane.setAttribute(
                "visible",
                "false"
              );

              video.pause();

              if (audioRef.current) {
                audioRef.current.pause();
              }
            }
          );
        }, 1500);
      };

      document.body.appendChild(
        mindarScript
      );
    };

    document.body.appendChild(
      aframeScript
    );
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
        <div
          style={{
            fontSize: "24px",
            letterSpacing: "2px",
          }}
        >
          Mother's Day AR
        </div>

        <button
          style={{
            padding: "16px 32px",
            fontSize: "18px",
            background: "white",
            color: "black",
            border: "none",
            borderRadius: "999px",
            cursor: "pointer",
          }}
          onClick={() => {
            const audio = new Audio(
              "/audio/bgm.mp3"
            );

            audio.loop = true;

            audioRef.current = audio;

            setStarted(true);
          }}
        >
          Touch to Begin
        </button>
      </div>
    );
  }

  // Loading
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