/* App class
* 
* Methods and variables to manage the state of the page.
* 
* - Instance variables: assigned to document elements in order to assign 
*   event handlers, track state and respond to user interactions
* - Event handlers: actions like adding/deleting a card, copying text
* - setup(): finds and assigns document elemtens to instance variables
*   and event handlers
* - load..(): called whenever a change is made to auto-refresh cards
*/

import {CodeJar} from 'https://medv.io/codejar/codejar.js'
import { Teach, TeachCard, Grade, GradeCard } from "./Cards.js";


class App {
  constructor() {
    this._teachForm = null;
    this._teachPhoto = null;
    this._teach = null;

    this._grade = null;
    this.gradeForm = null;

    /* Event handlers that you need to bind (call on API) */
    this._onAddTeach = this._onAddTeach.bind(this);
    this._onAddGrade = this._onAddGrade.bind(this);
    this._onDeleteCard = this._onDeleteCard.bind(this);
    this._viewAssignNum = this._viewAssignNum.bind(this);
    this._onCopy = this._onCopy.bind(this);
  }

  setup(){
    this._teach = new Teach();
    this._teachForm = document.querySelector("#teachForm");
    this._teachForm.addEventListener("submit", this._onAddTeach);
    this._loadTeach();

    /* Event listener for image uploads */
    document.querySelector("#img").addEventListener("change", this.onSelectFile);

    this._grade = new Grade();
    this._gradeForm = document.querySelector("#gradeForm");
    this._gradeForm.addEventListener("submit", this._onAddGrade);
    this._loadGrade();
    document.querySelector("#assignmentView").addEventListener("change", this._viewAssignNum);

    for (const minmax of document.querySelectorAll(".minmax")) {
      minmax.addEventListener("click",this. _onMinMax);
    }
    
    /* Setting up code editor */
    const jar = CodeJar(document.querySelector('.editor'), this._codeEdit);
    
  }

  /* Minimizes/Maximizes the form */
  _onMinMax = (event) => {
    let content = event.currentTarget.closest(".cardForm").querySelector(".formContent");
    if (content.style.display == "none"){
      content.style.display = "flex";
    } else {
      content.style.display = "none";
    }
  }

  /* Dealing with selecting an image */
   onSelectFile = (event) => {
    let file = event.currentTarget.files[0];
    if (!file) return;
    let reader = new FileReader();
    reader.addEventListener("error", (event) => {
      throw new Error("Error reading image ");
    });

    reader.addEventListener("load", (event) => {
      this._teachPhoto = reader.result;
      console.log(this._teachPhoto);
    });

    reader.readAsDataURL(file);
  };

  /* Displays a teach card */
  _displayTeachCard(teachData){
    let teachCard = document.querySelector("#templateTeach").cloneNode(true);
    teachCard.id = teachData._id;
    console.log(teachCard.id);
    teachCard.classList.remove("template");

    teachCard.querySelector(".weekTitle").textContent = "WEEK" + " " + teachData.week;
    
    /* only displays certaiin parts of a card if there teachData content */
    if (teachData.note != ""){
      teachCard.querySelector(".notes").textContent = teachData.note;
    }
    if (teachData.photo != null){
      teachCard.querySelector(".photo").src = teachData.photo;
      teachCard.querySelector(".photo").style.display = "flex";
    } else {
      teachCard.querySelector(".photo").style.display = "none";
    }
    if (teachData.links != ""){
      for (let link of teachData.links){
        let a = document.createElement('a');
        a.href = link;
        a.innerHTML = link;
        let li = document.createElement('li');
        li.appendChild(a)
        teachCard.querySelector('.links').appendChild(li);  
      }
    }

    teachCard.querySelector(".delete").addEventListener("click", this._onDeleteCard);
    document.querySelector("#teach").append(teachCard);
  }

  /* Function to reload all the teach cards whenever an adjustment is made (card added/deleted) */
  async _loadTeach(){
    document.querySelector("#teach").textContent="";
    let teachCards = await this._teach.getCards();

    this._teachForm.reset();

    for (let teachCard of teachCards){
      let teachCardClass = new TeachCard(teachCard);
      this._displayTeachCard(teachCardClass)
    }
  }

  /* Creating a new teach card from form data and adding it */
  async _onAddTeach(event) {
    event.preventDefault();

    let newTeachCard = new TeachCard(
      {
        week: this._teachForm.week.value,
        note: this._teachForm.note.value,
        photo: this._teachPhoto,
        links: this._teachForm.links.value.split(",")
      }
    )

    await this._teach.add(newTeachCard);
    await this._loadTeach();
  }

  /* Displays a grade card */
  _displayGradeCard(gradeData){
    let gradeCard = document.querySelector("#templateGrade").cloneNode(true);
    gradeCard.id = gradeData._id;
    gradeCard.classList.remove("template");

    gradeCard.querySelector(".comment").textContent = gradeData.comment;
    gradeCard.querySelector(".assignmentNum").textContent = "Assignment " + gradeData.assign;

    gradeCard.querySelector(".delete").addEventListener("click", this._onDeleteCard);
    gradeCard.querySelector(".copy").addEventListener("click", this._onCopy);
    document.querySelector("#grade").append(gradeCard);
  }

  /* Function to reload all the grade cards whenever an adjustment 
  is made (card added/deleted, or different view)  */
  async _loadGrade(){
    document.querySelector("#grade").textContent="";
    this._gradeForm.reset();

    let selectedNum = document.querySelector("#assignmentView").value;
    document.querySelector("#assignmentView").textContent = "";

    let assignments = await this._grade.getAssignNums();

    var opt = document.createElement('option');
    opt.value = "";
    opt.innerHTML = "All assignments";
    document.querySelector("#assignmentView").append(opt);

    for (const assignNum of assignments){
      var opt = document.createElement('option');
      opt.value = assignNum;
      opt.innerHTML = assignNum;
      document.querySelector("#assignmentView").append(opt);
    }

    document.querySelector("#assignmentView").value = selectedNum;

    let gradeCards = [];

    if (selectedNum == ""){
      gradeCards = await this._grade.getCards();

    } else { // if a specific view for an assignment number
      gradeCards = await this._grade.getCardsAssign(selectedNum);
    }
    for (let gradeCard of gradeCards){
      let gradeCardClass = new GradeCard(gradeCard);
      this._displayGradeCard(gradeCardClass)
    }
  }

  /* Creating a new grade card from form data and adding it */
  async _onAddGrade(event){
    event.preventDefault();

    let newGradeCard = new GradeCard(
      {
        assign: this._gradeForm.assignment.value,
        comment: this._gradeForm.comment.value
      }
    )

    await this._grade.add(newGradeCard);
    await this._loadGrade();
  }

  /* Function call for when a user selects an assignment number to view */
  async _viewAssignNum(){
    this._loadGrade();
  }

  /* Function call for when a delete button is pressed */
  async _onDeleteCard(event){
    let card = event.currentTarget.closest(".card");
    let id = card.id;

    if (card.classList.contains("teachingCard")){ // to delete a teachCard
      this._teach.delete(id);
      this._loadTeach();
    } else if (card.classList.contains("gradingCard")){ // to delete a gradeCard
      this._grade.delete(id);
      this._loadGrade();
    } 
    
    /* This was for if the card was a LAIR card
    else if (){

    } */
  }

  /* Function call for when a copy button is pressed */
  async _onCopy(event){
    let comment = event.currentTarget.closest(".card").querySelector(".comment").textContent;
    navigator.clipboard.writeText(comment); // copy to keyboard

    let card = event.currentTarget.closest(".card");

    setTimeout(function(){
      card.style.backgroundColor = "#E5E8E8";
    }, 500);
    card.style.backgroundColor = "gray";;
  }

  /* Dealing with a code editor */
  _codeEdit = editor => {
    let code = editor.textContent;
    code = code.replace(
      /\((\w+?)(\b)/g,
      '(<font color="#8a2be2">$1</font>$2'
    );
    editor.innerHTML = code;
  };


}

let app = new App();
app.setup();