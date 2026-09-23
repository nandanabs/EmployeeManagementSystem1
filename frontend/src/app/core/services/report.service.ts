import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private apiUrl = environment.apiUrl + '/reports';

  constructor(private http: HttpClient) {}

  // Downloads a report file (PDF or Excel) and triggers a browser download.
  downloadReport(reportName: string, format: 'pdf' | 'excel'): void {
    const url = `${this.apiUrl}/${reportName}/${format}/`;
    this.http.get(url, { responseType: 'blob' }).subscribe((blob) => {
      const extension = format === 'pdf' ? 'pdf' : 'xlsx';
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `${reportName}-report.${extension}`;
      link.click();
      window.URL.revokeObjectURL(link.href);
    });
  }
}
