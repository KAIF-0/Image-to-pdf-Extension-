import jsPDF from "jspdf"

export const generatePDF = (
  images: string[],
  filename: string
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4"
      })

      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()

      for (let i = 0; i < images.length; i++) {
        try {
          const img = await loadImage(images[i])

          //adding every image in new page
          if (i > 0) {
            pdf.addPage()
          }

          const margin = 20
          const maxWidth = pageWidth - margin * 2
          const maxHeight = pageHeight - margin * 2

          let imgWidth = img.width
          let imgHeight = img.height

          if (imgWidth > maxWidth || imgHeight > maxHeight) {
            const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight)
            imgWidth *= ratio
            imgHeight *= ratio
          }

          const x = (pageWidth - imgWidth) / 2
          const y = (pageHeight - imgHeight) / 2

          //adding image to pdf
          await pdf.addImage(images[i], "JPEG", x, y, imgWidth, imgHeight)
        } catch (error) {
          console.error("Error adding image to PDF:", error)
          throw error
        }
      }

      const pdfUrl = pdf.output("datauristring", {
        filename: filename
      })
      resolve(pdfUrl)
    } catch (error) {
      reject(error)
    }
  })
}

const loadImage = (dataUrl: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = dataUrl
  })
}
