// Paths to your PDF files
const pdfPaths = {
    menu1: 'menu1.pdf',
    menu2: 'menu2.pdf'
};

let currentPdf = pdfPaths.menu1; // Default PDF
let isLoading = false; // Flag to track if a PDF is currently being loaded

async function loadPDF(pdfPath) {
    if (isLoading) return; // Ignore if a PDF is already being loaded

    isLoading = true; // Set loading flag to true
    const loadingIndicator = document.getElementById('loading');
    loadingIndicator.style.display = 'block'; // Show loading indicator

    const slidesContainer = document.getElementById('slides-container');
    slidesContainer.innerHTML = ''; // Clear previous slides

    try {
        const loadingTask = pdfjsLib.getDocument(pdfPath);
        const pdf = await loadingTask.promise;

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const viewport = page.getViewport({ scale: 1.5 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({ canvasContext: context, viewport: viewport }).promise;
            const image = canvas.toDataURL('image/png');

            const imgElement = document.createElement('img');
            imgElement.src = image;
            slidesContainer.appendChild(imgElement);
        }
    } catch (error) {
        console.error('Error loading PDF:', error);
    } finally {
        isLoading = false; // Reset laading 
        loadingIndicator.style.display = 'none'; // Hide laading indicator
    }
}

// Wait for the DOM to load before attaching event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Load the default PDF when the page loads
    loadPDF(currentPdf);

    // Add event listeners to the menu items
    document.getElementById('menu1').addEventListener('click', () => {
        if (!isLoading && currentPdf !== pdfPaths.menu1) { // Only load if not already loading and not the current PDF
            currentPdf = pdfPaths.menu1;
            loadPDF(currentPdf);
        }
    });

    document.getElementById('menu2').addEventListener('click', () => {
        if (!isLoading && currentPdf !== pdfPaths.menu2) { // Only load if not already loading and not the current PDF
            currentPdf = pdfPaths.menu2;
            loadPDF(currentPdf);
        }
    });
});