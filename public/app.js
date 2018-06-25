$(document).ready(function() {

// Grab the articles as a json
$.getJSON("/articles", function(data) {

  // For each event returned
  for (var i = 0; i < data.length; i++) {
    // Append each event as a Bootstrap div to the div with an id of 'articles'
    $("#articles").append(
      `<div class="card col-md-3 m-3 js-div" data-id="${data[i]._id}" style="width: 18rem;">
        <img data-id="${data[i]._id}" class="card-img-top js-img" src="${data[i].image}" alt="Event Image">
        <div class="card-body mx-auto">
          <p class="card-text">
            <a class="font-weight-bold text-dark" href="${data[i].link}/"target="_blank">${data[i].title}</a>
          </p>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item mx-auto">${data[i].venue}</li>
          <li class="list-group-item mx-auto"><a data-id="${data[i]._id}" id="saved" class="btn btn-warning text-dark">Save Event</a></li>
        </ul>
      </div>`
    );
  }
});

// A function to empty the previous articles and add in the saved articles
function getSaved() {
  // $("#articles").empty();
  $.getJSON("/articles/saved", function(data) {
    // Empty the previous unsaved events/articles

    for (var i = 0; i < data.length; i++) {

      $("#articles").append(
        `<div class="card col-md-3 m-3 js-div" data-id="${data[i]._id}" style="width: 18rem;">
          <img data-id="${data[i]._id}" class="card-img-top js-img" src="${data[i].image}" alt="Event Image">
          <div class="card-body mx-auto">
            <p class="card-text">
              <a class="font-weight-bold text-dark" href="${data[i].link}/"target="_blank">${data[i].title}</a>
            </p>
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item mx-auto">${data[i].venue}</li>
            <li class="list-group-item js-saved mx-auto"><a data-id="${data[i]._id}" class="btn btn-dark js-saved js-open-modal text-warning" data-toggle="modal" data-target="#exampleModal${data[i]._id}">Add Note</a></li>
          </ul>
          <!-- Modal for notes -->
          <div class="modal fade" id="exampleModal${data[i]._id}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">${data[i].title}</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <form>
                    <div class="form-group past-notes${data[i]._id}" id="noteinput">
                      
                    </div>
                    <div class="form-group">
                      <label for="note-text" class="col-form-label">Message:</label>
                      <textarea class="form-control" id="message-text${data[i]._id}"></textarea>
                    </div>
                  </form>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                  <button data-id="${data[i]._id}" type="button" id="savenote" class="btn btn-warning text-dark js-save-note">Save Note</button>
                </div>
              </div>
            </div>
          </div>
        </div>`
      );
    }
  });
};

// Whenever someone clicks on the 'save note' button...
$(document).on("click", ".js-open-modal", function() {
  // Empty the notes from the note section
  // Save the id from the button tag
  var thisId = $(this).attr("data-id");
  console.log('Data ID is: ' + thisId);

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // console.log(data.note.body);
      $("#message-text" + thisId).val('');
      // $("#noteinput").empty();
      // The title of the article is written to top of modal
      // $('#exampleModalLabel').text(data.title);
      // $('.past-notes').text(data.note.body);
      // An input to enter a new title
      // $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      // $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      // $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        console.log('Note Body is below: ');
        console.log(data.note.body);
        console.log('data.note in full: ');
        console.log(data.note);
        // Place the title of the note in the title input
        // $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $(".past-notes" + thisId).text(data.note.body);
      }
    });
});

// The event handler for saving a note for an event/article.
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  console.log('Saving a note for this id: ' + thisId);

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      // title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#message-text" + thisId).val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log('Data from the clicking a save note button: ');
      console.log(data);
      // Empty the notes section
      // $("#notes").empty();
      $("#message-text" + thisId).val('');
      $(".past-notes").text(data.note.body);
    });

  // Also, remove the values entered in the input and textarea for note entry
  // $("#titleinput").val("");
  // $("#bodyinput").val("");
});

// Clear articles button.
$('.js-clear').on('click', function() {
    $('.js-article').empty();
});

// Save articles button.
$(document).on("click", "#saved", function() {
  // Grab the id associated with the article from the submit button
  
  var thisId = $(this).attr("data-id");
  console.log('saved');
  console.log(thisId);
  
  $.ajax({
    method: "PUT",
    url: "/articles/" + thisId,
    data: {
      saved: true
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
    });
});

// Event handler for returning the saved events/articles
$(document).on('click', '#saved-list', function(req, res) {
  event.preventDefault();
  $("#articles").empty();
  getSaved();
});

});
