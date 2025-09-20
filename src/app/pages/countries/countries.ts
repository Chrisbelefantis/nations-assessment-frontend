import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-countries',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule],
  templateUrl: './countries.html',
  styleUrl: './countries.css'
})
export class Countries implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'area', 'countryCode'];
  countries: CountryInfoDto[] = [];

  // Pagination
  pageIndex = 0; // backend expects pageNumber
  pageSize = 10;
  totalElements = 0;

  // UI state
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchCountries(this.pageIndex, this.pageSize);
  }

  handlePageEvent(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchCountries(this.pageIndex, this.pageSize);
  }

  private fetchCountries(pageNumber: number, pageSize: number) {
    this.error = null;

    const params = new HttpParams()
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    this.http
      .get<CountryInfoResponseDto>('http://localhost:8080/country/all', { params })
      .subscribe({
        next: (res) => {
          this.countries = res.countries ?? [];
          // Fallbacks in case backend fields differ slightly
          this.totalElements = (res.totalElements ?? res.totalItems ?? this.countries.length) as number;
          this.pageIndex = (res.pageNumber ?? pageNumber) as number;
          this.pageSize = (res.pageSize ?? pageSize) as number;
          // no-op
        },
        error: (err) => {
          this.error = 'Failed to load countries';
          console.error(err);
        }
      });
  }
}

// Types aligned with provided DTOs and common pageable shape
interface CountryInfoDto {
  id: number;
  name: string;
  area: string;
  countryCode: string;
}

interface CountryInfoResponseDto extends PageableResponse {
  countries: CountryInfoDto[];
}

interface PageableResponse {
  pageNumber?: number;
  pageSize?: number;
  totalElements?: number;
  totalItems?: number; // alternative name just in case
  totalPages?: number;
}
