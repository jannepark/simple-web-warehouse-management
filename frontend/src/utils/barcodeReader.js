import "barcode-detector/polyfill"; 

export async function startBarcodeScanning(videoContainer) {

  if (!videoContainer) {
    throw new Error("Video container element not provided.");
  }
  if (!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
    throw new Error("Camera access is not available on this device.");
  }
  const video = document.createElement("video");
  video.style.width = "100%";
  video.style.height = "100%";
  videoContainer.innerHTML = "";
  videoContainer.appendChild(video);

  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" },
  });
  video.srcObject = stream;

  const barcodeDetector = new BarcodeDetector();
  const isNative = barcodeDetector.constructor.toString().includes("[native code]");
  console.log(`Using ${isNative ? 'native' : 'polyfill'} BarcodeDetector API`);
  let animationId = null;
  let resolveFn, rejectFn;
  const resultPromise = new Promise((resolve, reject) => {
    resolveFn = resolve;
    rejectFn = reject;
  });


  function cleanUp() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    stream.getTracks().forEach((track) => track.stop());
    video.removeEventListener("loadeddata", onLoadedData);
    video.removeEventListener("error", onError);
    video.pause();
    video.srcObject = null;
    videoContainer.innerHTML = "";
  }

  async function scan() {
    try {
      const barcodes = await barcodeDetector.detect(video);
      if (barcodes.length > 0) {
        cleanUp();
        resolveFn(barcodes[0].rawValue);
      } else {
        animationId = requestAnimationFrame(scan);
      }
    } catch (err) {
      cleanUp();
      rejectFn(err);
    }
  }

  function onLoadedData() {
    video.play();
    scan();
  }
  function onError(err) {
    cleanUp();
    rejectFn(err);
  }
  video.addEventListener("loadeddata", onLoadedData);
  video.addEventListener("error", onError);

  return {
    resultPromise,
    stop() {
      cleanUp();
      rejectFn(new Error("Scanning stopped or canceled."));
    },
  };
}
