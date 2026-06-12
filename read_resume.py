import sys
sys.stdout.reconfigure(encoding='utf-8')

# Try pdfplumber first, then pypdf2, then pdfminer
try:
    import pdfplumber
    with pdfplumber.open('images/Manan_Negi_GenAI_Resume.pdf') as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                print(text)
    sys.exit(0)
except ImportError:
    pass

try:
    from PyPDF2 import PdfReader
    reader = PdfReader('images/Manan_Negi_GenAI_Resume.pdf')
    for page in reader.pages:
        print(page.extract_text())
    sys.exit(0)
except ImportError:
    pass

try:
    from pdfminer.high_level import extract_text
    text = extract_text('images/Manan_Negi_GenAI_Resume.pdf')
    print(text)
    sys.exit(0)
except ImportError:
    pass

print("No PDF library available. Please install: pip install pdfplumber")
