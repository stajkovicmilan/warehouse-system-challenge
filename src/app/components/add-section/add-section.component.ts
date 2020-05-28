import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { Section } from 'src/app/models/section';

@Component({
  selector: 'app-add-section',
  templateUrl: './add-section.component.html',
  styleUrls: ['./add-section.component.scss']
})
export class AddSectionComponent implements OnInit {

  addSectionForm: FormGroup;
  floorId: number;

  constructor(
    private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {

    this.addSectionForm = this.fb.group({
      id: [(new Date()).getTime(), [Validators.required]],
      name: [null, [Validators.required]],
    });

    this.activeRoute.params.subscribe(params => {
      this.floorId = params.floorId;
    });
  }

  async save() {
    if (!this.addSectionForm.valid) {
      return;
    }
    const data = this.addSectionForm.value;
    data.floorId = +this.floorId;
    this.apiService.addSection(data);
    this.resetForm();
  }

  resetForm(){
    this.addSectionForm = this.fb.group({
      id: [new Date().getTime(), [Validators.required]],
      name: null,
    });
  }

}
