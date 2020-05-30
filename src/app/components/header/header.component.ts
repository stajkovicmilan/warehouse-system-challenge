import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @ViewChild('searchBlock') searchBlock: ElementRef;

  searchText: string;
  results: Product[] = [];
  searchPromise: any;

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
  }

  @HostListener('document:click', ['$event.target'])
  onCLick(target) {
    if (!this.searchBlock.nativeElement.contains(target)) {
      this.results = [];
    }
  }


  search(): void {
    if (!this.searchText || this.searchText.length < 2) {
      this.results = [];
      return;
    }
    if (this.searchPromise) {
      clearTimeout(this.searchPromise);
    }
    this.searchPromise = setTimeout(async () => {
      console.log('search for => ', this.searchText);
      this.results = await this.apiService.search(this.searchText);
    }, 200);
  }

  cleanResults(): void {
    this.results = [];
    this.searchText = null;
  }
}
