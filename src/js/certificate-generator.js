// Certificate Generation System

class CertificateGenerator {
    constructor() {
        this.templates = {
            python: {
                title: 'Python Programming Mastery',
                description: 'has successfully completed the comprehensive Python Programming course',
                color: '#3776ab',
                icon: 'fab fa-python',
                chapters: 12
            },
            javascript: {
                title: 'JavaScript Development Excellence',
                description: 'has successfully completed the JavaScript Fundamentals course',
                color: '#f7df1e',
                icon: 'fab fa-js-square',
                chapters: 14
            },
            flutter: {
                title: 'Flutter Mobile Development',
                description: 'has successfully completed the Flutter Mobile Development course',
                color: '#02569b',
                icon: 'fas fa-mobile-alt',
                chapters: 16
            },
            'html-css': {
                title: 'Web Development Fundamentals',
                description: 'has successfully completed the HTML & CSS Basics course',
                color: '#e34f26',
                icon: 'fab fa-html5',
                chapters: 10
            },
            sql: {
                title: 'Database Management with SQL',
                description: 'has successfully completed the SQL Database Management course',
                color: '#336791',
                icon: 'fas fa-database',
                chapters: 12
            },
            ruby: {
                title: 'Ruby Web Development',
                description: 'has successfully completed the Ruby Programming course',
                color: '#cc342d',
                icon: 'fas fa-gem',
                chapters: 14
            },
            cpp: {
                title: 'C++ Systems Programming',
                description: 'has successfully completed the C++ Programming course',
                color: '#00599c',
                icon: 'fas fa-code',
                chapters: 18
            }
        };
        this.init();
    }

    init() {
        // Load jsPDF if not already loaded
        if (typeof window.jsPDF === 'undefined') {
            this.loadJsPDF();
        }
    }

    loadJsPDF() {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = () => {
            console.log('jsPDF loaded successfully');
        };
        document.head.appendChild(script);
    }

    generateCertificate(courseId, studentName, completionDate = new Date()) {
        const template = this.templates[courseId];
        if (!template) {
            throw new Error('Invalid course ID');
        }

        // Create certificate data
        const certificateData = {
            id: this.generateCertificateId(),
            studentName: studentName,
            courseTitle: template.title,
            description: template.description,
            completionDate: completionDate,
            issueDate: new Date(),
            template: template
        };

        return certificateData;
    }

    async downloadCertificatePDF(certificateData) {
        if (typeof window.jsPDF === 'undefined') {
            throw new Error('PDF library not loaded');
        }

        const { jsPDF } = window.jsPDF;
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        // Certificate dimensions
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;

        // Background
        doc.setFillColor(245, 248, 255); // Light blue background
        doc.rect(0, 0, pageWidth, pageHeight, 'F');

        // Border
        doc.setDrawColor(2, 86, 155); // Primary blue
        doc.setLineWidth(2);
        doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);

        // Inner border
        doc.setLineWidth(0.5);
        doc.rect(margin + 5, margin + 5, pageWidth - 2 * margin - 10, pageHeight - 2 * margin - 10);

        // Header - BandhanNova Logo and Title
        doc.setFontSize(24);
        doc.setTextColor(2, 86, 155);
        doc.setFont('helvetica', 'bold');
        doc.text('BandhanNova', pageWidth / 2, margin + 25, { align: 'center' });

        // Certificate Title
        doc.setFontSize(32);
        doc.setTextColor(2, 86, 155);
        doc.text('Certificate of Completion', pageWidth / 2, margin + 45, { align: 'center' });

        // Decorative line
        doc.setDrawColor(66, 165, 245);
        doc.setLineWidth(1);
        doc.line(pageWidth / 2 - 50, margin + 50, pageWidth / 2 + 50, margin + 50);

        // "This is to certify that"
        doc.setFontSize(16);
        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'normal');
        doc.text('This is to certify that', pageWidth / 2, margin + 70, { align: 'center' });

        // Student Name
        doc.setFontSize(28);
        doc.setTextColor(2, 86, 155);
        doc.setFont('helvetica', 'bold');
        doc.text(certificateData.studentName, pageWidth / 2, margin + 90, { align: 'center' });

        // Course Description
        doc.setFontSize(16);
        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'normal');
        const descriptionText = `${certificateData.description}`;
        doc.text(descriptionText, pageWidth / 2, margin + 110, { align: 'center' });

        // Course Title
        doc.setFontSize(20);
        doc.setTextColor(2, 86, 155);
        doc.setFont('helvetica', 'bold');
        doc.text(`"${certificateData.courseTitle}"`, pageWidth / 2, margin + 130, { align: 'center' });

        // Completion Date
        doc.setFontSize(14);
        doc.setTextColor(15, 23, 42);
        doc.setFont('helvetica', 'normal');
        const dateText = `Completed on ${certificateData.completionDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })}`;
        doc.text(dateText, pageWidth / 2, margin + 150, { align: 'center' });

        // Footer
        const footerY = pageHeight - margin - 30;
        
        // Certificate ID
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Certificate ID: ${certificateData.id}`, margin + 10, footerY);

        // Issue Date
        const issueDateText = `Issued: ${certificateData.issueDate.toLocaleDateString()}`;
        doc.text(issueDateText, pageWidth - margin - 10, footerY, { align: 'right' });

        // Signature line
        doc.setDrawColor(100, 100, 100);
        doc.setLineWidth(0.5);
        doc.line(pageWidth / 2 - 40, footerY - 20, pageWidth / 2 + 40, footerY - 20);
        
        doc.setFontSize(12);
        doc.setTextColor(2, 86, 155);
        doc.setFont('helvetica', 'bold');
        doc.text('BandhanNova Team', pageWidth / 2, footerY - 10, { align: 'center' });

        // Download the PDF
        const fileName = `${certificateData.studentName.replace(/\s+/g, '_')}_${courseId}_Certificate.pdf`;
        doc.save(fileName);

        return fileName;
    }

    generateCertificateId() {
        const timestamp = Date.now().toString(36);
        const randomStr = Math.random().toString(36).substring(2, 8);
        return `BN-${timestamp}-${randomStr}`.toUpperCase();
    }

    saveCertificateRecord(certificateData) {
        const certificates = JSON.parse(localStorage.getItem('bandhannova_certificates') || '[]');
        certificates.push({
            ...certificateData,
            downloadDate: new Date().toISOString()
        });
        localStorage.setItem('bandhannova_certificates', JSON.stringify(certificates));
    }

    getCertificateHistory() {
        return JSON.parse(localStorage.getItem('bandhannova_certificates') || '[]');
    }

    validateCertificate(certificateId) {
        const certificates = this.getCertificateHistory();
        return certificates.find(cert => cert.id === certificateId);
    }

    // HTML Certificate Preview
    generateHTMLPreview(certificateData) {
        return `
            <div class="certificate-preview-html" style="
                width: 800px;
                height: 600px;
                background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%);
                border: 3px solid var(--primary-blue);
                border-radius: 15px;
                padding: 40px;
                font-family: 'Inter', sans-serif;
                position: relative;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                margin: 20px auto;
            ">
                <!-- Decorative corners -->
                <div style="
                    position: absolute;
                    top: 20px;
                    left: 20px;
                    width: 50px;
                    height: 50px;
                    border-top: 3px solid var(--accent-blue);
                    border-left: 3px solid var(--accent-blue);
                "></div>
                <div style="
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    width: 50px;
                    height: 50px;
                    border-top: 3px solid var(--accent-blue);
                    border-right: 3px solid var(--accent-blue);
                "></div>
                <div style="
                    position: absolute;
                    bottom: 20px;
                    left: 20px;
                    width: 50px;
                    height: 50px;
                    border-bottom: 3px solid var(--accent-blue);
                    border-left: 3px solid var(--accent-blue);
                "></div>
                <div style="
                    position: absolute;
                    bottom: 20px;
                    right: 20px;
                    width: 50px;
                    height: 50px;
                    border-bottom: 3px solid var(--accent-blue);
                    border-right: 3px solid var(--accent-blue);
                "></div>

                <!-- Header -->
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="
                        display: inline-flex;
                        align-items: center;
                        gap: 10px;
                        margin-bottom: 10px;
                    ">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                            <path d="M20 2L35 12v16L20 38L5 28V12L20 2z" stroke="var(--primary-blue)" stroke-width="2" fill="none"/>
                            <path d="M20 12L30 18v8L20 32L10 26v-8L20 12z" fill="var(--primary-blue)" opacity="0.3"/>
                            <circle cx="20" cy="20" r="3" fill="var(--primary-blue)"/>
                        </svg>
                        <h1 style="
                            font-size: 28px;
                            color: var(--primary-blue);
                            margin: 0;
                            font-weight: 700;
                        ">BandhanNova</h1>
                    </div>
                    <h2 style="
                        font-size: 36px;
                        color: var(--primary-blue);
                        margin: 0;
                        font-weight: 600;
                    ">Certificate of Completion</h2>
                    <div style="
                        width: 100px;
                        height: 2px;
                        background: var(--accent-blue);
                        margin: 15px auto;
                    "></div>
                </div>

                <!-- Content -->
                <div style="text-align: center; margin-bottom: 40px;">
                    <p style="
                        font-size: 18px;
                        color: var(--dark-text);
                        margin-bottom: 20px;
                    ">This is to certify that</p>
                    
                    <h3 style="
                        font-size: 32px;
                        color: var(--primary-blue);
                        margin: 20px 0;
                        font-weight: 700;
                        text-decoration: underline;
                        text-decoration-color: var(--accent-blue);
                    ">${certificateData.studentName}</h3>
                    
                    <p style="
                        font-size: 16px;
                        color: var(--dark-text);
                        margin-bottom: 15px;
                        line-height: 1.5;
                    ">${certificateData.description}</p>
                    
                    <h4 style="
                        font-size: 24px;
                        color: var(--primary-blue);
                        margin: 20px 0;
                        font-weight: 600;
                    ">"${certificateData.courseTitle}"</h4>
                    
                    <p style="
                        font-size: 14px;
                        color: var(--dark-text);
                        opacity: 0.8;
                    ">Completed on ${certificateData.completionDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}</p>
                </div>

                <!-- Footer -->
                <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 60px;
                    padding-top: 20px;
                    border-top: 1px solid var(--border-gray);
                ">
                    <div style="font-size: 12px; color: var(--dark-text); opacity: 0.6;">
                        Certificate ID: ${certificateData.id}
                    </div>
                    <div style="text-align: center;">
                        <div style="
                            width: 120px;
                            height: 1px;
                            background: var(--dark-text);
                            margin-bottom: 5px;
                        "></div>
                        <div style="
                            font-size: 14px;
                            color: var(--primary-blue);
                            font-weight: 600;
                        ">BandhanNova Team</div>
                    </div>
                    <div style="font-size: 12px; color: var(--dark-text); opacity: 0.6;">
                        Issued: ${certificateData.issueDate.toLocaleDateString()}
                    </div>
                </div>
            </div>
        `;
    }
}

// Global certificate generator instance
window.certificateGenerator = new CertificateGenerator();

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CertificateGenerator;
}
