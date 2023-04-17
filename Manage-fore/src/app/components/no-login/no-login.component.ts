import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-no-login',
  templateUrl: './no-login.component.html',
  styleUrls: ['./no-login.component.css']
})
export class NoLoginComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

}
