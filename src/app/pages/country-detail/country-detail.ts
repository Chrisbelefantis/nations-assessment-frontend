import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-country-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatPaginatorModule],
  templateUrl: './country-detail.html',
  styleUrl: './country-detail.css'
})
export class CountryDetail implements OnInit {
  id: number | null = null;
  name: string | null = null;

  displayedColumns: string[] = ['language', 'official'];
  languages: LanguageDto[] = [];

  // Pagination
  pageIndex = 0;
  pageSize = 10;
  totalElements = 0;

  // UI state
  error: string | null = null;

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.id = idParam ? Number(idParam) : null;

    // Read name from navigation state (not URL params)
    const state = (history.state || {}) as { name?: string };
    this.name = state.name ?? null;

    if (this.id !== null) {
      this.fetchLanguages(this.pageIndex, this.pageSize);
    } else {
      this.error = 'Invalid country id';
    }
  }

  handlePageEvent(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchLanguages(this.pageIndex, this.pageSize);
  }

  private fetchLanguages(pageNumber: number, pageSize: number) {
    if (this.id === null) return;
    this.error = null;

    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    this.http
      .get<LanguageResponseDto>(`http://localhost:8080/country/${this.id}/languages`, { params })
      .subscribe({
        next: (res) => {
          this.languages = res.languages ?? [];
          this.totalElements = (res.totalElements ?? this.languages.length) as number;
          this.pageIndex = (res.pageNumber ?? pageNumber) as number;
          this.pageSize = (res.pageSize ?? pageSize) as number;
        },
        error: (err) => {
          this.error = 'Failed to load languages';
          console.error(err);
        }
      });
  }
}

interface LanguageDto {
  language: string;
  official: boolean;
}

interface LanguageResponseDto {
  pageNumber?: number;
  pageSize?: number;
  totalPages?: number;
  totalElements?: number;
  languages: LanguageDto[];
}
