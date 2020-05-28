import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-add-froor',
  templateUrl: './add-froor.component.html',
  styleUrls: ['./add-froor.component.scss']
})
export class AddFroorComponent implements OnInit {

  addFloorForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.addFloorForm = this.fb.group({
      id: [new Date().getTime(), [Validators.required]],
      name: [null, [Validators.required]],
    });
  }

  async save() {
    if (!this.addFloorForm.valid) {
      return;
    }
    const data = this.addFloorForm.value;
    await this.apiService.addFloor(data);
    this.resetForm();
  }

  resetForm(){
    this.addFloorForm = this.fb.group({
      id: [new Date().getTime(), [Validators.required]],
      name: null,
    });
  }
}
