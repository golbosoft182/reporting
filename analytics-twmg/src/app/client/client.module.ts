import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NvD3Module } from 'ng2-nvd3';
//custom component for module
import {ClientComponent} from './client.component'
//custom provider for module
import {AuthGuard} from '../authentication/auth.guard';
import {InlineEditorModule} from 'ng2-inline-editor';
//custom service
import {ClientService} from './client.service'
import {ClientArrayPipe} from '../Pipe/ClientArrayPipe'
//custom routes
const routes: Routes = [
  {path: 'client/:id',  component: ClientComponent}
];

//init modules
@NgModule({
  declarations: [
    ClientComponent,ClientArrayPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    NvD3Module,
    InlineEditorModule,
    RouterModule.forRoot(
      routes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    
  ],
  providers: [ClientService]
})

export class ClientModule { }
