import { Component } from '@angular/core';
import { AudiogramComponent } from '../audiograms/audiograms.component';

@Component({
  selector: 'app-maincontent',
  imports: [AudiogramComponent],
  templateUrl: './maincontent.component.html',
  styleUrl: './maincontent.component.scss'
})
export class MaincontentComponent {

}
