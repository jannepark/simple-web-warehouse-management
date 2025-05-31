import { useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogTitle, Button, Box } from "@mui/material";
import PropTypes from "prop-types";
import { startBarcodeScanning } from "../../utils/barcodeReader";

export default function BarcodeScanningDialog({ open, onClose, onScanResult }) {
  const scanningSessionRef = useRef(null);

  // Ensures that the container is actually in the DOM
  const waitForContainer = () => {
    return new Promise((resolve) => {
      const check = () => {
        const container = document.getElementById("video-container");
        if (container) {
          resolve(container);
        } else {
          requestAnimationFrame(check);
        }
      };
      check();
    });
  };

  useEffect(() => {
    if (open) {
      (async () => {
        try {
          const container = await waitForContainer();
          scanningSessionRef.current = await startBarcodeScanning(container);
          const barcode = await scanningSessionRef.current.resultPromise;
          onScanResult(barcode);
          onClose();
        } catch (err) {
          console.error("Error during barcode scanning:", err.message);
          if (err && err.message === "The object can not be found here.") {
            alert("No camera found. Please ensure your device has a camera and permissions are granted.")
          }
          else {
            alert("Error during barcode scanning.");
          }
          onClose();
        }
      })();
    }
    return () => {
      if (scanningSessionRef.current?.stop) {
        scanningSessionRef.current.stop();
      }
      scanningSessionRef.current = null;
    };
  }, [open, onClose, onScanResult]);

  const handleCancel = () => {
    if (scanningSessionRef.current?.stop) {
      scanningSessionRef.current.stop();
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle>Scan Barcode</DialogTitle>
      <DialogContent>
        <Box
          id="video-container"
        />
        <Button onClick={handleCancel}>Cancel</Button>
      </DialogContent>
    </Dialog>
  );
}

BarcodeScanningDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onScanResult: PropTypes.func.isRequired,
};
BarcodeScanningDialog.js


