// components/WaveForm.tsx
import { useRef, useEffect } from "react";
import useSize from "./useSize";

interface AnalyzerData {
  dataArray: Uint8Array;
  analyzer: AnalyserNode;
  bufferLength: number;
}

function animateBars(
  analyser: AnalyserNode,
  canvas: HTMLCanvasElement,
  canvasCtx: CanvasRenderingContext2D,
  dataArray: Uint8Array,
  bufferLength: number
) {
  analyser.getByteFrequencyData(dataArray);

  canvasCtx.fillStyle = "#000";
  const HEIGHT = canvas.height / 2;

  const barWidth = Math.ceil(canvas.width / bufferLength) * 2.5;
  let barHeight;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    barHeight = (dataArray[i] / 255) * HEIGHT;
    const blueShade = Math.floor((dataArray[i] / 255) * 5); // generate a shade of blue based on the audio input
    const blueHex = [
      "#61dafb",
      "#5ac8fa",
      "#50b6f5",
      "#419de6",
      "#20232a",
    ][blueShade]; // use react logo blue shades
    canvasCtx.fillStyle = blueHex;
    canvasCtx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);

    x += barWidth + 1;
  }
}

const WaveForm = ({ analyzerData }: { analyzerData: AnalyzerData }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { dataArray, analyzer, bufferLength } = analyzerData;
  const [width, height] = useSize();

  const draw = (dataArray: Uint8Array, analyzer: AnalyserNode, bufferLength: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !analyzer) return;
    const canvasCtx = canvas.getContext("2d");

    const animate = () => {
      requestAnimationFrame(animate);
      canvas.width = canvas.width;
      canvasCtx!.translate(0, canvas.offsetHeight / 2 - 115);
      animateBars(analyzer, canvas, canvasCtx!, dataArray, bufferLength);
    };

    animate();
  };

  useEffect(() => {
    draw(dataArray, analyzer, bufferLength);
  }, [dataArray, analyzer, bufferLength]);

  return (
    <canvas
      style={{
        position: "absolute",
        top: "0",
        left: "0",
        zIndex: "-10",
      }}
      ref={canvasRef}
      width={width}
      height={height}
    />
  );
};

export default WaveForm;
