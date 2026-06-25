import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Renders the .paper DOM node to a canvas and downloads it as a PNG.
 * Selecting by class name (rather than threading a ref through several
 * layers) keeps the export utility decoupled from component structure;
 * there is only ever one `.paper` element on screen at a time.
 */
export async function downloadAsImage(paperColor: string): Promise<void> {
  const node = document.querySelector<HTMLElement>(".letter-paper");
  if (!node) throw new Error("Paper element not found");

  const canvas = await html2canvas(node, { backgroundColor: paperColor, scale: 2 });
  const link = document.createElement("a");
  link.download = "letter-bombed.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

export async function downloadAsPdf(paperColor: string): Promise<void> {
  const node = document.querySelector<HTMLElement>(".letter-paper");
  if (!node) throw new Error("Paper element not found");

  const canvas = await html2canvas(node, { backgroundColor: paperColor, scale: 2 });
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF({
    unit: "px",
    format: [canvas.width / 2, canvas.height / 2],
  });
  pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
  pdf.save("letter-bombed.pdf");
}
