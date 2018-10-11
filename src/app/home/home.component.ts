import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  private score;
  private time;
  private countdownId: any;
  private statuscheckId: any;
  private currentLevel;
  private isPlaying: any;
  wordInput: any = "";
  currentWord: any;
  seconds: any;
  timeDisplay: any;
  scoreDisplay: any;
  isStartGame: any = false;
  message: any;
  private words: any = [];

  constructor(private _dataService: DataService) { }


  ngOnInit() {
    this.currentWord = "hello";
    this.seconds = 5;
    this.time = 5;
    this.currentLevel = 5;
    this.score = 0;
    this.scoreDisplay = 0;
    this.timeDisplay = 0;


    this._dataService.fetchWordList().then(
      data => {
        this.words = Object.assign([], data);
        this.showWord();
      }).catch((err) => {
        console.log(err);
      }
      );
  }

  // Pick & show random word
  private showWord() {
    // Generate random array index
    const randIndex = Math.floor(Math.random() * this.words.length);
    // Output random word
    this.currentWord = this.words[randIndex];
  }

  // Match currentWord to wordInput
  private matchWords(): boolean {
    if (this.wordInput === this.currentWord) {
      this.message = 'Correct!!!';
      return true;
    } else {
      this.message = '';
      return false;
    }
  }

  // Countdown timer
  private countdown() {
    if (this.time > 0) {

      // Decrement
      this.time--;
    } else if (this.time == 0) {
      // Game is over

      this.isPlaying = false;

      if (this.countdownId) {
        clearInterval(this.countdownId);
        this.countdownId = undefined;
      }
    }

    // Show time
    this.timeDisplay = this.time;
  }

  // Check game status
  private checkStatus() {
    if (!this.isPlaying && this.time == 0) {
      this.message = 'Game Over!!!';
      this.score = -1;
      this.isStartGame = false;

      if (this.statuscheckId) {
        clearInterval(this.statuscheckId);
        this.statuscheckId = undefined;
      }
    }
  }

  wordChange(e) {

    //this.wordInput = e.target.value;
    this.wordInput = e;
    
    if (!this.countdownId)
      this.countdownId = setInterval(() => { this.countdown(); }, 1000);
    //Check game status

    if (!this.statuscheckId)
      this.statuscheckId = setInterval(() => { this.checkStatus(); }, 50);


    this.startMatch();
  }

  // Start match
  private startMatch() {


    if (this.matchWords()) {
      this.isPlaying = true;
      this.time = parseInt(this.currentLevel) + 1;
      this.showWord();
      this.wordInput = '';
      this.score++;
    }

    // If score is -1, display 0
    if (this.score === -1) {
      this.scoreDisplay = 0;
    } else {
      this.scoreDisplay = this.score;
    }
  }

}
