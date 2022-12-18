import apiRequest from "./api.js";

/* A small class to represent a TeachCard */
export class TeachCard {
  constructor(data) {
    this.data = data;
    this._id = data._id;
    this.week = data.week;
    this.photo = data.photo;
    this.links = data.links;
    this.note = data.note;
  }
}

export class Teach {
  async getCards() {
    let data = await apiRequest("GET", "/teach/cards");
    return data["teachCards"];
  }

  async add(teachCard) {
    let add = await apiRequest("POST", "/teach", teachCard.data);
    return;
  }

  async delete(id){
    let del = await apiRequest("DELETE", "/teach/" + id)
    return;
  }
}

/* A small class to represent a GradeCard */
export class GradeCard {
  constructor(data) {
    this.data = data;
    this._id = data._id;
    this.assign = data.assign;
    this.comment = data.comment;
  }
}

export class Grade {
  async getCards() {
    let data = await apiRequest("GET", "/grade/cards");
    return data["gradeCards"];
  }

  async add(gradeCard) {
    let add = await apiRequest("POST", "/grade", gradeCard.data);
    return;
  }

  async delete(id){
    let del = await apiRequest("DELETE", "/grade/" + id)
    return;
  }

  async getAssignNums(){
    let data = await apiRequest("GET", "/grade/assignments");
    return data["assignments"]
  }

  async getCardsAssign(num) {
    let data = await apiRequest("GET", "/grade/" + num);
    return data["gradeCards"];
  }
}