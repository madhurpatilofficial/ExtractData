import { Component } from '@angular/core';
import { ExtractDataService } from 'src/app/services/extractdata.service';

@Component({
  selector: 'app-extractdata',
  templateUrl: './extractdata.component.html',
  styleUrls: ['./extractdata.component.css']
})
export class ExtractdataComponent {
  extractedText: string = ''; // Variable to store extracted text

  constructor(private extractDataService: ExtractDataService) {}

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.extractDataService.extractData(file).subscribe(
        data => {
          this.extractedText = data; // Store extracted text
        },
        error => {
          console.error('Error extracting data:', error);
          // Handle error
        }
      );
    }
  }
}
