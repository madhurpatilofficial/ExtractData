import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { ScriptService } from 'ngx-script-loader';
import * as pdfjsLib from 'pdfjs-dist';

// Declare pdfjsLib as a global variable of type any
// declare const pdfjsLib: any;

@Injectable({
  providedIn: 'root'
})
export class ExtractDataService {
  constructor(private scriptService: ScriptService) {
    this.loadPdfJsLibrary();
  }

  private async loadPdfJsLibrary() {
    try {
      await this.scriptService.loadScript('pdfjs', {
        url: 'node_modules/pdfjs-dist/build/pdf.min.js'
      });
      console.log('PDF.js library loaded successfully');
    } catch (error) {
      console.error('Error loading PDF.js library:', error);
    }
  }

  extractData(file: File): Observable<string> {
    return new Observable((observer: Observer<string>) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const typedArray = new Uint8Array(fileReader.result as ArrayBuffer);
        this.extractTextFromPdf(typedArray).then(
          text => {
            console.log('Extracted text:', text); // Log extracted text
            observer.next(text);
            observer.complete();
          },
          error => {
            console.error('Error extracting text:', error);
            observer.error(error);
          }
        );
      };
      fileReader.onerror = (error) => {
        console.error('Error reading file:', error);
        observer.error(error);
      };
      fileReader.readAsArrayBuffer(file);
    });
  }

  private async extractTextFromPdf(data: Uint8Array): Promise<string> {
    try {
      // Check if pdfjsLib is defined before using it
      if (typeof pdfjsLib === 'undefined') {
        throw new Error('PDF.js library is not loaded');
      }
      
      const loadingTask = pdfjsLib.getDocument({ data });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;
      let fullText = '';

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => {
          if ('str' in item) {
            return item.str;
          } else {
            // Handle the absence of 'str' property here (e.g., provide a fallback value)
            return '';
          }
        }).join(' ');
        
        fullText += pageText + '\n';
      }

      return fullText;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw error;
    }
  }
}
