$(document).ready(function() {



// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one

  
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    // $("#articles").append("<p data-id='" + data[i]._id + "'>" + '<img src="' + data[i].image + '">' + '<a href="' + data[i].link + '/" target="_blank">' + data[i].title + "</a></p><p>" + data[i].venue + "</p>");
    // let buttonSaved = $('<a>');
    //   buttonSaved.attr('href', '/');
    //   buttonSaved.addClass('btn btn-success js-saved');
    //   $('.for-button').append(buttonSaved);

    $("#articles").append(
      `<div class="card col-md-3 m-3 js-div" data-id="${data[i]._id}" style="width: 18rem;">
        <img data-id="${data[i]._id}" class="card-img-top js-img" src="${data[i].image}" alt="Event Image">
        <div class="card-body">
          <p class="card-text">
            <a href="${data[i].link}/"target="_blank">${data[i].title}</a>
          </p>
        </div>
        <ul class="list-group list-group-flush">
          <li class="list-group-item">${data[i].venue}</li>
          <li class="list-group-item"><a data-id="${data[i]._id}" id="saved" class="btn btn-success">Save Event</a></li>
        </ul>
      </div>`
    );
  }
});

function getUnsaved() {
  $.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      // $("#articles").append("<p data-id='" + data[i]._id + "'>" + '<img src="' + data[i].image + '">' + '<a href="' + data[i].link + '/" target="_blank">' + data[i].title + "</a></p><p>" + data[i].venue + "</p>");
      $("#articles").append(
        `<div class="card col-md-3 m-3 js-div" data-id="${data[i]._id}" style="width: 18rem;">
          <img data-id="${data[i]._id}" class="card-img-top js-img" src="${data[i].image}" alt="Event Image">
          <div class="card-body">
            <p class="card-text">
              <a href="${data[i].link}/"target="_blank">${data[i].title}</a>
            </p>
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">${data[i].venue}</li>
            <li class="list-group-item"><a class="btn btn-success js-saved" href="/">Save Event</a></li>
          </ul>
        </div>`
      );
    }
  });
};

function getSaved() {
  $.getJSON("/saved", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      // $("#articles").append("<p data-id='" + data[i]._id + "'>" + '<img src="' + data[i].image + '">' + '<a href="' + data[i].link + '/" target="_blank">' + data[i].title + "</a></p><p>" + data[i].venue + "</p>");
      // let buttonSaved = $('<a>');
      // buttonSaved.attr('href', '/');
      // buttonSaved.addClass('btn btn-success js-saved');

      // <a class="btn btn-success js-saved" href="/">Save Event</a>

      $("#articles").append(
        `<div class="card col-md-3 m-3 js-div" data-id="${data[i]._id}" style="width: 18rem;">
          <img data-id="${data[i]._id}" class="card-img-top js-img" src="${data[i].image}" alt="Event Image">
          <div class="card-body">
            <p class="card-text">
              <a href="${data[i].link}/"target="_blank">${data[i].title}</a>
            </p>
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">${data[i].venue}</li>
            <li class="list-group-item js-saved"><a data-id="${data[i]._id} class="btn btn-success js-saved" href="/">Save Event</a></li>
          </ul>
        </div>`
      );
    }
  });
};

// Whenever someone clickson an element with the class of js-img tag
$(document).on("click", ".js-img", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
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
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

// Clear articles button.
$('.js-clear').on('click', function() {
    $('.js-article').empty();
});

// Save articles button.

$(document).on("click", "#saved", function() {
  // Grab the id associated with the article from the submit button
  
  // event.preventDefault();
  console.log('saved');
  var thisId = $(this).attr("data-id");
  console.log(thisId);
  
  
// $.ajax({
//   method: "PUT",
//   url: "/articles/" + thisId,
//   data: {
//     saved: true
//   }
// })
//   // With that done
//   .then(function(data) {
//     // Log the response
//     console.log(data);
    
//   });
});

});
