import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { Floor } from 'src/app/models/floor';

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

  async save(): Promise<void> {
    if (!this.addFloorForm.valid) {
      return;
    }
    const newFloor: Floor = this.addFloorForm.value;
    await this.apiService.addFloor(newFloor);
    this.resetForm();
  }

  resetForm(): void {
    this.addFloorForm = this.fb.group({
      id: [new Date().getTime(), [Validators.required]],
      name: null,
    });
  }
}
