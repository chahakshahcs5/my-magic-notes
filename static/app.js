// shownotes();

// let addNoteButton = document.getElementById("addBtn");
// addNoteButton.addEventListener("click", function (e) {
//   let Description = document.getElementById("addDescription");
//   let title = document.getElementById("addTitle");
//   let note = {
//     Description: Description.value,
//     title: title.value
//   };
//   let notes = localStorage.getItem("Notes");
//   if (notes == null) {
//     noteObj = [];
//   } else {
//     noteObj = JSON.parse(notes);
//   }
//   noteObj.push(note);
//   localStorage.setItem("Notes", JSON.stringify(noteObj));
//   shownotes();
// });
// function shownotes() {
//   let notes = localStorage.getItem("Notes");
//   if (notes == null) {
//     noteObj = [];
//   } else {
//     noteObj = JSON.parse(notes);
//   }
//   let index = 0;
//   let html = "";
//   noteObj.forEach(function (element, index) {
//     html +=`<div class="card col-sm-4 card-note" style="width: 18rem;">
//                 <div class="card-note-body">
//                   <h5 class="card-title">${element.title}</h5>
//                   <div>
//                   <p class="card-Description">${element.Description}</p>
//                   </div>
//                   <button class="btn btn-primary" id="${index}" onclick= "deleteNote(this.id)" button> Delete Note </button>
//                 </div>
//             </div>`;
//     index++;        
//   });
//   let div = document.getElementById("div");
//   if (noteObj.length != 0) {
//     div.innerHTML = html;
//   } else {
//     div.innerHTML = `Nothing to show here, add a note.`;
//   }
// }

// function deleteNote(index){
//   // Delete Note from UI
//     let deleteNote = document.getElementById(index);
//     deleteNote.parentNode.parentNode.remove(); 
//   // Delete Note from Local Storage
//   let notes = localStorage.getItem("Notes");
//   noteObj = JSON.parse(notes);
//   noteObj.splice(index, 1);
//   localStorage.setItem("Notes", JSON.stringify(noteObj));
// }
  let search = document.getElementById('search');

  search.addEventListener('input', function(){
    let searchVal = search.value.toLowerCase();
    let cardNotes = document.getElementsByClassName('card-note');
    Array.from(cardNotes).forEach(function(element){
        let cardDescription = element.getElementsByTagName('p')[0].innerText;
        if(cardDescription.includes(searchVal)){
             element.style.display = 'block';
         }else{
            element.style.display = 'none';
        }
      })
  });
